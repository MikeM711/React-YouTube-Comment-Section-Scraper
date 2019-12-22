const puppeteer = require('puppeteer');

async function main(req, res, youtubeLink, io) {
  try {
    // launch puppeteer
    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // slowMo: 250 // slow down by 250ms
    });

    // Get comment section height - used for debugging
    async function getCommmentSectionHeight() {
      const commentSectionElem = await page.
        $('ytd-item-section-renderer#sections');
      const boundingBox = await commentSectionElem.boundingBox();
      const commentSectionHeight = boundingBox.height;
      return commentSectionHeight
    }

    // Create a new page in the browser, store it in a page object
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Go to YouTube URL
    await page.goto(`${youtubeLink}`);

    // We know this page is loaded when the below selector renders on screen
    await page.waitForSelector('yt-visibility-monitor#visibility-monitor', { timeout: 60000 });
    await page.waitFor(100); // time to breathe
    await console.log('video is in view!');

    // Start of "heartbeat messages" to let the connection know it is alive
    await res.write('video is in view');

    // Get the video element
    const videoBtn = await page.$('video.video-stream');

    // Do not use links with spaces in them
    const validLink = youtubeLink.includes(" ");

    // A second check to make sure the YouTube URL exists
    const videoUnavailable = await page.$('div.yt-player-error-message-renderer');

    if (videoUnavailable || validLink) {
      await io.emit('ErrorMsg', `Backend Error: Check to make sure your URL, "${youtubeLink}", exists and try again.`);
      browser.close();
      res.end();
    };

    // stop the video
    await videoBtn.click();

    // Handles error where Chromium does not recognize a YouTube video format
    const videoError = await page.$('div.ytp-error-content-wrap');

    if (videoError) {
      await io.emit('ErrorMsg', "Error: This YouTube video uses a video format that is unrecognizable by this application's browser. Please try another video.");
      browser.close();
      res.end();
    };

    // Send YT video title to frontend
    const titleSelect = 'h1.title yt-formatted-string.ytd-video-primary-info-renderer';
    await page.waitForSelector(titleSelect, { timeout: 60000 });
    const titleSelelctHandle = await page.$(titleSelect);
    const titleName = await page.evaluate(title => title.innerText, titleSelelctHandle);
    await console.log(titleName);
    await io.emit('Title', titleName);;

    // Send YT thumbnail to frontend
    const videoSelect = 'ytd-page-manager.ytd-app ytd-watch-flexy';
    const videoId = await page.$eval(videoSelect, view => view.getAttribute('video-id'));
    const Thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    await io.emit('Thumbnail', Thumbnail);

    // Update progress on the frontend
    await io.emit('VideoFound', true);
    await io.emit('ScrollData', 'Starting Scroll');

    // Scroll function to render out all comment threads
    async function scrollFunc(int) {
      await page.evaluate(async (int) => {
        await new Promise((resolve, reject, ) => {
          try {
            const maxScroll = Number.MAX_SAFE_INTEGER;
            let lastScroll = 0;
            const interval = setInterval(() => {
              window.scrollBy(0, int); //scroll amount
              const scrollTop = document.documentElement.scrollTop;
              if (scrollTop === maxScroll || scrollTop === lastScroll) {
                clearInterval(interval);
                resolve();
              } else {
                lastScroll = scrollTop;
              }
            }, 100); //scroll time
          } catch (err) {
            console.log(err);
            reject(err.toString());
          };
        });
      }, int);
    };
    // Scroll all the way down
    console.log('scrolling...');

    /* Problem: if we scroll too much, too fast, to the bottom of the page - comments don't get rendered out
      When we render out the page, scroll slightly and wait for comments to be loaded
    */
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });

    // If comments are disabled, exit out of the process
    const disabledCom = await page.$('yt-formatted-string#message');
    if (disabledCom) {
      await io.emit('ErrorMsg', `Error: The video "${titleName}" has its comments disabled. Choose another YouTube video that does not have its comments disabled.`);
      browser.close();
      res.end();
    }

    // count the amount of youtube comments
    await page.waitForSelector('yt-formatted-string.count-text', { timeout: 60000 });
    const commentNumHandle = await page.$("yt-formatted-string.count-text");
    let commentNumber = await page.evaluate(num => num.innerText, commentNumHandle);

    // Convert the number of comments into a JS number
    commentNumber = Number(commentNumber.replace(" Comments", "").replace(",", ""));
    console.log('YouTube sees', commentNumber, 'posts');

    // Do not allow program to continue, if YouTube finds 1000+ comments
    if (commentNumber >= 1000) {
      await io.emit('ErrorMsg', `Error: The video "${titleName}" has too many comments (YouTube detects ${commentNumber} Comments). Choose another YouTube video with less than 1,000 comments.`);
      browser.close();
      res.end();
    }

    // Fix the "Stopping on scroll" problem, wait for page to render out "next continuation" HTML
    await page.waitForSelector('yt-next-continuation.ytd-item-section-renderer', { timeout: 60000 });

    // variables for while loop
    let active = true;
    let i = 0;

    // while loop causes application to keep scrolling, until there is no more HTML left to render
    while (active) {
      // element selector for every thread (OP comment)
      const commentsStr = 'ytd-comment-renderer.ytd-comment-thread-renderer div#body div#main ytd-expander#expander div#content yt-formatted-string#content-text';

      // All Element Handler threads (OP comments) before scrolling
      let preCommentHanlder = await page.$$(commentsStr);
      await scrollFunc(1000);

      // debugging: outputs the comment section height
      // var commentSectionHeight = await getCommmentSectionHeight()
      // console.log("height: " + commentSectionHeight); // common for first 2 batches to have same number

      // After each scrolling iteration, check to see if the below selector exists in the "buffer" handle
      // If it does exist, more HTML needs to be rendered
      let buffer = await page.$('yt-next-continuation.ytd-item-section-renderer');
      await page.waitFor(100); // time to breathe

      // heartbeat message over the connection
      await res.write('scrolling');

      // All threads (OP comments) after scrolling
      let afterCommentHanlder = await page.$$(commentsStr);

      // If exectuion enters here, the scroll has rendered comments
      if (preCommentHanlder.length < afterCommentHanlder.length) {
        i++;
        console.log('Scroll batch rendered:', i);
        await io.emit('ScrollData', `Scroll batches rendered: ${i}`);
        await res.write('more comments loaded');
      };

      // if execution enters inside this loop, "continuation" HTML does not exist - all threads (OP comments) have been rendered out
      if (!buffer) {
        console.log("No more 'continuation' HTML");
        await io.emit('ScrollData', `Scroll batches rendered: ${i}`);
        active = false;
      };
    };

    await page.waitFor(1000); // time to breathe

    // The "context" of all "View # replies" buttons in the below selector - a long rectangle 'div-like' selector - AKA expander
    let expander = await page.$$('div#expander');
    console.log('Clicking "View replies" buttons');

    // We only want to enter the "popup" loop once, so that we click the "YouTube TV" prompt once if it appears
    let activePop = true;

    // iterate through all visible "View replies" buttons
    if (expander.length) {
      for (let i = 0; i < expander.length; i++) {

        /* Sometimes YouTube will have a "YouTube TV" or "Survey" prompt
          We need to exit it in order to access the buttons at the bottom of the screen
          Note: popup does not go away in the HTML once it has been clicked
        */

        // Check to see if popup selector exists
        const popup = await page.$('paper-dialog.ytd-popup-container');

        if (activePop && popup) {
          console.log('popup found');

          let popupBtn = await page.$('paper-dialog.ytd-popup-container yt-formatted-string.style-text');
          if (popupBtn) {
            await page.waitFor(500); // breathe before clicking popup
            await popupBtn.click();
          }

          let surveyBtn = await page.$('ytd-single-option-survey-renderer.ytd-popup-container yt-icon-button.ytd-single-option-survey-renderer button.yt-icon-button')
          if (surveyBtn) {
            await page.waitFor(500); // breathe before clicking popup
            await surveyBtn.click();
          }

          // do not allow execution to enter this loop anymore
          activePop = false;
        };

        // inside the expander context, there's a "paper-button" button in the below selector
        let showMore = await expander[i].$('paper-button.ytd-button-renderer');

        // click that "View # replies" button
        await showMore.click();

        // Find all replies after we click "View # replies" button
        let clickedReplies = await expander[i].$$('ytd-comment-renderer.ytd-comment-replies-renderer');

        /* Note: If we click too many buttons, too fast - the program will mis-click
          To slow the program down, we will keep the exeuction in a while-loop until a reply renders out */
        while (clickedReplies == 0) {
          clickedReplies = await expander[i].$$('ytd-comment-renderer.ytd-comment-replies-renderer');
        };

        // replies have been rendered out, execution will continue
        await page.waitFor(100); // some "breathing time" for execution after render
        // await console.log('spinner disappeared')
        await console.log(`${i + 1} " out of " ${expander.length} "comments"`);

        // Send progress to the frontend
        await io.emit('ExpandedCommentData', `${i + 1} out of ${expander.length} comments expanded`);

        // Heartbeat message over the connection
        await res.write('expanded comment');
      };
    } else {
      await io.emit('ExpandedCommentData', '0 out of 0 comments expanded');
    };

    await page.waitFor(2000); // breathing time

    // yt-next-continuation.ytd-comment-replies-renderer
    // Where we needd to fix
    console.log('clicking "show more replies" buttons');
    // all currently visible "Show more replies" buttons
    // let showMoreRep = await page.$$('yt-formatted-string.yt-next-continuation');
    const repliesHTML = 'div#continuation yt-next-continuation.ytd-comment-replies-renderer yt-formatted-string.yt-next-continuation'
    let showMoreRep = await page.$$(repliesHTML);
    active = true;

    // A loop for "Show more replies" buttons
    while (active) {
      // Check to see if a single "Show more replies" button exists
      let singleMoreRep = await page.$(repliesHTML);

      // If a single "Show more replies" button exists, enter 'if' loop
      if (singleMoreRep) {

        // All replies before button click
        let preTotRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer');

        // All "Show More Replies" buttons before button click
        let preTotMoreRep = await page.$$(repliesHTML);

        // clicking the single "Show more replies" button

        // debugging: outputs the comment section height + total replies
        // commentSectionHeight = await getCommmentSectionHeight()
        // console.log("height before click: " + commentSectionHeight);
        // var totalShowMoreReplies = await page.$$(repliesHTML);
        // console.log('total show more replies before click', totalShowMoreReplies.length)

        await singleMoreRep.click();

        /* Now that "Show More Replies" button has been clicked, we need execution to wait until replies have been fully rendered
          Replies are fully rendered when:
            1. There are more replies on the YT page than before click (now deprecated)
            2. There is one less "Show More Replies" button on the YT page
              - The above is needed because sometimes a clicked "Show More Replies" button does not render out ANY comments
        */

        // debugging: outputs the comment section height + total replies
        // commentSectionHeight = await getCommmentSectionHeight()
        // console.log("height after click: " + commentSectionHeight);
        // totalShowMoreReplies = await page.$$(repliesHTML);
        // console.log('total show more replies after click', totalShowMoreReplies.length)


        // To handle the case: multiple "show more replies" are in one thread

        // Problem: if we click a "show more replies" button, and this button count does not update, 
        // it is safe to assume that the particular comment thread is very long and has another "show more replies" button to click
        // A new soln was developed for Dec 2018, as the older one is now deprecated
        // Old solution: The number of posts were compared before and after
        // Old solution does not work because, even if the post number is updated, the "show more replies" button HTML can *still* remain inside the HTML for a certain amount of time thereafter. 
        // We must wait for this particular button HTML to be removed.

        // We will wait 45s to click the "show more replies" button if clicking one button does not decrease the total button count by -1 on a page
        // Meaning, we plan to click on a "show more replies" button inside the same thread
        var d = new Date();
        var waitingTime = 45 * 1000 // 45 seconds
        var timeWhenShowMoreRepClicked = d.getTime();
        var waitingTimeOver = d.setTime(timeWhenShowMoreRepClicked + waitingTime);

        // We need to keep the connection alive if we plan on waiting the full 45 seconds for this particular case
        // Below are the times when we need to send a message over the connection line
        var active_15 = true
        var active_30 = true

        do {

          // Get the time during each iteration to compare against waitingTimeOver
          var currDate = new Date();
          var getCurrTime = currDate.getTime()

          // All replies after button click - useful for debugging
          let afterTotRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer');

          // All "Show More Replies" buttons after button click
          let afterTotMoreRep = await page.$$(repliesHTML);

          // Handles the case of allowing the execution to move on if one less "show more replies" button is clicked and fully rendered out
          // If one less "Show More Reply" button is found, compared to pre-button click, allow execution to move on
          if (afterTotMoreRep.length == preTotMoreRep.length - 1) {
            console.log('one less "show more replies" button inside the page')
            break
          }

          // Handling the case of multiple "show more replies" in one comment thread

          /* 
          OLD SOLUTION DISCUSSION

          Old Soln: If more posts have been rendered than pre-button click, allow execution to move on

          This old method does not work anymore, YouTube does not fully remove the "show more replies" button when more posts are loaded in.
          You must wait a certain amount of time before the button is fully removed from the HTML

          // deprecated as of Dec 2019 (old soln)
          // else if (preTotRep.length < afterTotRep.length) {
          //   // If more posts have been rendered than pre-button click, allow execution to move on
          //   renderActive = false;
          //   console.log('hit total replies')
          //   // await res.write('hit total before pause');
          //   // await page.waitFor(15000);
          //   // await res.write('hit total after pause');
          // }

          */

          // NEW SOLUTION: if 45s has passed, allow the execution to continue

          // For New Soln: we don't want to wait 45s without keeping the connection alive
          var floorCurr = Math.floor(getCurrTime / 1000)
          var floorInit = Math.floor(timeWhenShowMoreRepClicked / 1000)

          if (active_15 && (floorCurr - floorInit) >= 15) {
            console.log('15 seconds have passed')
            await res.write('15 seconds have passed')
            active_15 = false
          }

          if (active_30 && (floorCurr - floorInit) >= 30) {
            console.log('30 seconds have passed')
            await res.write('30 seconds have passed')
            active_30 = false
          }

        } while (getCurrTime <= waitingTimeOver)

        // debugging: outputs the comment section height + total replies
        // commentSectionHeight = await getCommmentSectionHeight()
        // console.log("height after leaving loop: " + commentSectionHeight);
        // totalShowMoreReplies = await page.$$(repliesHTML);
        // console.log('total show more replies after leaving loop', totalShowMoreReplies.length)

        await page.waitFor(200); // Even though everything is rendered properly at this point, this gives some "breathing room", before next execution

        // Get the number of "Show more replies" button to display to the frontend
        showMoreRep = await page.$$(repliesHTML);

        console.log(`${showMoreRep.length} "show more replies" buttons visible`);
        await page.waitFor(200); // more breathing time

        // Update progress on the frontend
        await io.emit('ShowMoreRepData', `${showMoreRep.length} "show more replies" buttons visible`);

        // Heartbeat message over connection
        await res.write('show more replies');

      } else {
        // "Show more replies" button HTML does not exist, break out of while loop
        active = false;
      };
    };

    // Update progress to the frontend
    await io.emit('ShowMoreRepData', '0 "show more replies" buttons visible');
    await console.log('comments expanded');

    // total amount of replies currently
    const totRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer');
    const toPosts = await page.$$('ytd-comment-thread-renderer.ytd-item-section-renderer');

    await page.waitFor(1000); // time to breathe

    // Element handler of all comments
    const allComments = await page.$$('yt-formatted-string#content-text');
    console.log("We have found: ", allComments.length, "comments");

    // The 'CommentSection' that will store all the data we need for the frontend
    let CommentSection = [];

    // The "container" for all comment threads
    const allOPCommentContainers = await page.$$('ytd-comment-thread-renderer.ytd-item-section-renderer');

    // Iterate through each thread "container"
    for (let i = 0; i < allOPCommentContainers.length; i++) {
      // Every selector below will be relative to each thread "container"
      // The selector for the first comment of every thread (a space in the string is required)
      const commentThreadStr = 'ytd-comment-renderer.ytd-comment-thread-renderer ';

      // selector for each comment
      const commentHandlerStr = 'div#body div#main ytd-expander#expander div#content yt-formatted-string#content-text';

      // selector for each avatar
      const imgHandlerStr = 'yt-img-shadow';

      // selector for each name
      const nameHandlerStr = 'a#author-text span.ytd-comment-renderer';

      // selector for each date
      const dateLinkHandlerStr = 'div#body div#main div#header div#header-author yt-formatted-string.published-time-text a.yt-simple-endpoint';

      // selelctor for each "like amount"
      const likeHandlerStr = 'div#body div#main span#vote-count-left';

      // selector for creator badge
      const isCreatorHandlerStr = 'span#author-comment-badge ytd-author-comment-badge-renderer';

      // Element handles for defined selectors, and their evaluations

      // Comment Element Handle
      const commentHandler = await allOPCommentContainers[i].$(commentThreadStr + commentHandlerStr);

      // Evaluating the comment text
      const comment = await page.evaluate(singleComment => singleComment.innerText, commentHandler);

      // Avatar image Element Handle
      const imgHandler = await allOPCommentContainers[i].$(commentThreadStr + imgHandlerStr);

      // Evaluating the avatar image
      const avatar = await imgHandler.$eval('img#img', imgSelector => imgSelector.src);

      // Element handle that holds the name of initial commenter
      const nameHandler = await allOPCommentContainers[i].$(commentThreadStr + nameHandlerStr);

      // Name of initial commenter
      let name = await page.evaluate(name => name.innerText, nameHandler);
      name = name.trim();

      // Element handle that holds the date and link of comment
      const dateLinkHandler = await allOPCommentContainers[i].$(commentThreadStr + dateLinkHandlerStr);

      // Evaluating date of post - shows edit, if any
      const date = await page.evaluate(singleDate => singleDate.innerText, dateLinkHandler);

      // Element handle that holds the likes
      const likeHandler = await allOPCommentContainers[i].$(commentThreadStr + likeHandlerStr);

      // Evaluating likes
      let likes = await page.evaluate(likeAmt => likeAmt.innerText, likeHandler);
      likes = likes.trim();

      // link to particular comment (context)
      const link = await page.evaluate(link => link.href, dateLinkHandler);

      // check if original thread creator made this particular post
      const isCreatorHandler = await allOPCommentContainers[i].$(commentThreadStr + isCreatorHandlerStr);

      if (isCreatorHandler) {
        //if the isCreatorHandler has a "style" attribute, we know that the poster is the creator, and not just a "verified account"
        const hasStyle = await allOPCommentContainers[i].$eval(isCreatorHandlerStr, badge => badge.getAttribute('style'))
        // console.log(hasStyle)
        if (hasStyle) {
          var isCreator = true;
        } else {
          isCreator = false;
        }
      } else {
        var isCreator = false;
      };

      // Check if this thread "container" has any replies
      const hasReplies = await allOPCommentContainers[i].$$('div#expander ytd-comment-renderer.ytd-comment-replies-renderer');
      if (hasReplies.length > 0) {
        console.log('Replies found for', (i + 1));

        // Send progress data to the frontend
        io.emit('FindRepliesData', `Replies found for Post #${(i + 1)}`);

        // 'replies' array needs access to data from inside the following 'for loop' block scope
        var replies = [];

        // Relative location of "reply" data (selector) (a space required in the string)
        const replyThreadStr = 'ytd-comment-replies-renderer ';

        for (let i = 0; i < hasReplies.length; i++) {
          // Reply text element handle
          const repliesHandler = await hasReplies[i].$(replyThreadStr + commentHandlerStr);

          // The replier text evaluated
          const reply = await page.evaluate(singleReply => singleReply.innerText, repliesHandler);

          // Element handle that holds the avatar image of replier
          const imgHandlerRep = await hasReplies[i].$(replyThreadStr + imgHandlerStr);

          // Avatar image of replier
          const avatarRep = await imgHandlerRep.$eval('img#img', imgSelector => imgSelector.src);

          // Element handle that holds the name of a replier
          const nameHandlerRep = await hasReplies[i].$(replyThreadStr + nameHandlerStr);

          // Name of the replier
          let nameRep = await page.evaluate(name => name.innerText, nameHandlerRep);
          nameRep = nameRep.trim();

          // Element handle that holds the date and link of replier
          const dateLinkHandlerRep = await hasReplies[i].$(replyThreadStr + dateLinkHandlerStr);

          // Date of post evaluated - shows edit if any - for replier
          const dateRep = await page.evaluate(singleDate => singleDate.innerText, dateLinkHandlerRep);

          // Element handle that holds the likes of replier
          const likeHandlerRep = await hasReplies[i].$(replyThreadStr + likeHandlerStr);

          // Evaluating likes of replier
          let likesRep = await page.evaluate(likeAmt => likeAmt.innerText, likeHandlerRep);
          likesRep = likesRep.trim();

          // link to particular replier (context)
          const linkRep = await page.evaluate(link => link.href, dateLinkHandlerRep);

          // check if original thread creator made this reply
          const isCreatorHandlerRep = await hasReplies[i].$(replyThreadStr + isCreatorHandlerStr);

          // Find if this reply was made by the video creator
          if (isCreatorHandlerRep) {
            var isCreatorRep = true;
          } else {
            var isCreatorRep = false;
          };

          // All information about a particular reply
          const replyInfo = {
            id: i,
            avatarRep,
            nameRep,
            dateRep,
            reply,
            likesRep,
            linkRep,
            isCreatorRep,
          };
          replies.push(replyInfo);
        };
      } else {
        // execution enters here when no replies are found in a comment thread (OP post)

        // heartbeat message over the connection
        await res.write('finding replies');
        console.log('No replies found for', (i + 1));

        // Send progress to the frontend
        io.emit('FindRepliesData', `No replies found for Post #${(i + 1)}`);
        var replies = false;
      };
      // Store thread data
      // Thread is stored as the OP comment, and replies are stored in the 'replies' property
      const thread = {
        id: i,
        avatar,
        name,
        date,
        comment,
        likes,
        link,
        isCreator,
        replies
      };

      // Heartbeat over connection
      await res.write('collecting comment data');

      // Store all threads (OP comment & its replies) in the CommentSection object
      CommentSection.push(thread);
    };
    await io.emit('FindRepliesData', '"Reply Finding" Complete! Scroll down to view results.');

    // Data payload
    const myJSON = JSON.stringify(CommentSection, null, 2);
    console.log('End of puppeteer');
    browser.close();

    // return back to the route with payload
    return myJSON;
  } catch (error) {
    console.log("our error", error);
    browser.close();

    // If execution lands here, these are the most common errors I've seen
    const navErr = "Error: Protocol error (Page.navigate): Cannot navigate to invalid URL";
    const nullErr = `TypeError: Cannot read property 'click' of null`;
    const EvalErr = `Error: Evaluation failed`;

    // If any of these errors occurred, send the below string to the frontend
    if (error == navErr || error == nullErr || error.startsWith(EvalErr)) {
      await io.emit('ErrorMsg', `Backend Error: Check to make sure your URL, "${youtubeLink}", exists and try again.`);
    } else {
      await io.emit('ErrorMsg', `${error}`);
    };
  };
};

module.exports = main;