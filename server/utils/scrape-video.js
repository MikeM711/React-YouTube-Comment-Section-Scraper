const puppeteer = require('puppeteer');


async function main(req,res,youtubeLink,io) {
  try {
    // Begin with puppeteer Code

    // Launch the Chromium browser - have a browser object
    // show browser with: headless:false
    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
      // slowMo: 250 // slow down by 250ms
    });

    // Create a new page in the browser - have a page object
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });

    // Controversial videos, like politics, tend to have a lot of "show more replies"
    // https://www.youtube.com/watch?v=U1_ZvIVQHuI

    // Go to a video with a lot of comments, use scroll function
    // Here's a nature video: https://www.youtube.com/watch?v=Ce-l9VpZn84

    // Creator responding to comments: https://www.youtube.com/watch?v=BeSztzFtWeQ
    // large video test: https://www.youtube.com/watch?v=th5QV1mnWXo
    // quick video test: https://www.youtube.com/watch?v=az8DrhofHeY
    // great test as well: https://www.youtube.com/watch?v=IHt71N47cc0
    
    await page.goto(`${youtubeLink}`);

    // We know this page is loaded when the below selector renders on screen
    await page.waitForSelector('yt-visibility-monitor#visibility-monitor')
    await page.waitFor(100) // time to breathe

    await console.log('video is in view!')

    // function write() {
    //   return new Promise(function (resolve) {
    //     res.write({data: 'hello router, video is in view'})
    //     resolve()
    //   });
    // }

    // await write()

    await res.write('my response')

    // USE res.write I think
    await res.write('video is in view')
    // res.send({data: 'hello router, video is in view'})
    
    // yt-visibility-monitor id="visibility-monitor"

    // a delay function to let the video render, so we can click it to pause it (not needed during headless)
    // function delay(time) {
    //   return new Promise(function (resolve) {
    //     setTimeout(resolve, time)
    //   });
    // }

    // time to let the video render
    //await delay(1500);

    // Get the video element
    const videoBtn = await page.$('video.video-stream')

    // stop the video
    await videoBtn.click()

    // send YouTube title to frontend

    // Handles error where Chromium does not recognize a YouTube video format
    const videoError = await page.$('div.ytp-error-content-wrap')

    if(videoError){
      await io.emit('ErrorMsg', "Error: This YouTube video uses a video format that is unrecognizable by this application's browser. Please try another video.");
      browser.close()
      res.end()
    }

    const videoUnavailable = await page.$('div.yt-player-error-message-renderer')
    if(videoUnavailable){
      await io.emit('ErrorMsg', `Error encountered in the backend. Check to make sure your URL, "${youtubeLink}", exists and try again.`);
      browser.close()
      res.end()
    }

    const titleSelect = 'h1.title yt-formatted-string.ytd-video-primary-info-renderer'
    

    await page.waitForSelector(titleSelect)
    const titleSelelctHandle = await page.$(titleSelect)
    const titleName = await page.evaluate(title => title.innerText, titleSelelctHandle)
    await console.log(titleName)

    await io.emit('Title', titleName);

    // Send back thumbnail to frontend

    const videoSelect = 'ytd-page-manager.ytd-app ytd-watch-flexy'
    const videoId = await page.$eval(videoSelect, view => view.getAttribute('video-id'))

    const Thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

    await io.emit('Thumbnail', Thumbnail);
    await io.emit('VideoFound', true)
    await io.emit('ScrollData', 'Starting Scroll');

    // Below will mute the video
    // const muteBtn = await page.$('button.ytp-mute-button')
    // muteBtn.click()

    // The Scroll function that we will be using in our application, so that stuff will load as we are scrolling - may need to be updated
    async function scrollFunc(int) {
      await page.evaluate(async (int) => {
        await new Promise((resolve, reject,) => {
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
          }
        });
      },int);
    }

    /* Problem: if we scroll too much, too fast, to the bottom of the page: 
        comments don't get rendered out
      When we render out the page, scroll slightly and wait for comments to be loaded
    */
    // await scrollFunc(100)

    await page.evaluate(() => {
      window.scrollBy(0, 400);
    });
    await page.waitForSelector('yt-formatted-string.count-text')

    // Fix the "Stopping on scroll" problem
    await page.waitForSelector('yt-next-continuation.ytd-item-section-renderer')

    // Scroll all the way down
    console.log('scrolling...')

    let active = true
    let i = 0

    while (active) {
      const commentsStr = 'ytd-comment-renderer.ytd-comment-thread-renderer div#body div#main ytd-expander#expander div#content yt-formatted-string#content-text'
      let preCommentHanlder = await page.$$(commentsStr)

      await scrollFunc(1000)

      // below will gather a new $('context') at each iteration, and test to see if visible or not
      let buffer = await page.$('yt-next-continuation.ytd-item-section-renderer')
      await page.waitFor(100) // time to breathe

      // res.send({data: 'scrolling'})
      await res.write('scrolling')

      let afterCommentHanlder = await page.$$(commentsStr)

      if(preCommentHanlder.length < afterCommentHanlder.length){
        i++
        console.log('more comments loaded!',i)
        await io.emit('ScrollData', `Scroll batches rendered: ${i}`);
        await res.write('more comments loaded')
      }

      if (!buffer) {
        console.log("no more 'continuation' tags")
        await io.emit('ScrollData', `Scroll batches rendered: ${i}`);
        active = false
      }

    }
    await page.waitFor(1000) // time to breathe

    console.log('out of while loop')

    // If a YouTube prompt pops up, and is in the way

    /* 
If: ('paper-dialog.ytd-popup-container') shows up,
  Click: The button: (' paper-dialog.ytd-popup-container yt-formatted-string.style-text')
*/

    // The "context" of all "View # replies" buttons in the below selector, a long rectangle 'div-like' selector - AKA expander
    let expander = await page.$$('ytd-expander.ytd-comment-replies-renderer')

    console.log('clicking buttons')

    // We only want to enter the "popup" loop once
    let activePop = true

    // iterate thru all visible reply buttons
    if (expander.length) {
      for (let i = 0; i < expander.length; i++) {

        /* Sometimes YouTube will have a "YouTube TV" prompt
          We need to exit it in order to access the buttons at the end of the page
          Note: popup does not go away in the HTML once it has been clicked

        */
       
        const popup = await page.$('paper-dialog.ytd-popup-container')
        if (activePop && popup) {
          const popupBtn = await page.$('paper-dialog.ytd-popup-container yt-formatted-string.style-text')
          await page.waitFor(500) // breathe before clicking popup
          await popupBtn.click()
          activePop = false;
        }
        
        /*
        If: ('paper-dialog.ytd-popup-container') shows up,
        Click: The button: (' paper-dialog.ytd-popup-container yt-formatted-string.style-text')
        YouTube TV - No long term contract
        */

        // inside the expander context, there's a "View # replies" button in the below selector
        let showMore = await expander[i].$('div.more-button')

        // click that "View # replies" button
        await showMore.click()
        

        // how many replies are found after we click the particular "View # replies" button?
        let clickedReplies = await expander[i].$$('ytd-comment-renderer.ytd-comment-replies-renderer')
        // console.log(clickedReplies.length) - I return 0 almost all of the time

        /* Note: If we click too many, too fast - the program will mis-click
          To slow the program down, we will keep the exeuction in a while-loop until a reply renders out */
        while(clickedReplies == 0){
          clickedReplies = await expander[i].$$('ytd-comment-renderer.ytd-comment-replies-renderer')
          
        }

        // replies have been rendered out, execution will continue
        await page.waitFor(100); // some "breathing time" for execution after render
        
        await console.log('spinner disappeared')

        await console.log(`${i + 1} " out of " ${expander.length} "comments"`)
        await io.emit('ExpandedCommentData', `${i + 1} out of ${expander.length} comments expanded`);


        // res.send({data: 'expanded comment'})
        await res.write('expanded comment')
      }
    } else {
      await io.emit('ExpandedCommentData', '0 out of 0 comments expanded');
    }

    // need more time to correctly gather up "Show more replies" buttons
    // Add in something other than a delay time???
    // The issue: sometimes showMoreRep can equal ZERO!
    await page.waitFor(2000);

    console.log('clicking "show more replies" buttons')


    // all currently visible "Show more replies" buttons
    let showMoreRep = await page.$$('yt-formatted-string.yt-next-continuation')

    // total amount of replies currently
    // let totRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer')

    active = true

    while (active) {

      let singleMoreRep = await page.$('yt-formatted-string.yt-next-continuation')
      if (singleMoreRep) {

        // All replies before button click
        let preTotRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer')
        // All "Show More Replies" buttons before button click
        let preTotMoreRep = await page.$$('yt-formatted-string.yt-next-continuation')

        singleMoreRep.click()

        

        renderActive = true;
        while (renderActive) {
          // All replies after button click
          let afterTotRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer')

          // All "Show More Replies" buttons before button click
          let afterTotMoreRep = await page.$$('yt-formatted-string.yt-next-continuation')

          

          // If more posts have been rendered than pre-button click, allow execution to move on
          if (preTotRep.length < afterTotRep.length) {
            renderActive = false;
          }

          if (afterTotMoreRep.length == preTotMoreRep.length - 1){
            renderActive = false;
            // If problems, add a delay here
          }

        }
        await page.waitFor(200); // Even though everything is rendered properly at this point, this gives some "breathing room", before next execution

        // Check if there is another level-deep of "Show more replies"
        showMoreRep = await page.$$('yt-formatted-string.yt-next-continuation')
        console.log(`${showMoreRep.length} "show more replies" buttons visible`)
        await io.emit('ShowMoreRepData', `${showMoreRep.length} "show more replies" buttons visible`);

        // res.send({data: 'expanded "show more replies"'})
        await res.write('show more replies')

      } else {
        active = false
      }

    }
    await io.emit('ShowMoreRepData', '0 "show more replies" buttons visible');

    await console.log('comments expanded?')
    // ctrl+f "show more replies" = 1


    // total amount of replies currently
    const totRep = await page.$$('ytd-comment-renderer.ytd-comment-replies-renderer') // 212 (total - 1)

    const toPosts = await page.$$('ytd-comment-thread-renderer.ytd-item-section-renderer') // 159

    await page.waitFor(1000); // time to breathe
    const allComments = await page.$$('yt-formatted-string#content-text')

    console.log("We have found: ", allComments.length , "comments")

    // Put comments into an object to be rendered

    /* Each comment thread: 
      ytd-comment-renderer.ytd-comment-thread-renderer (37)

      Comment thread body (carries all information): "
      "ytd-comment-thread-renderer.ytd-item-section-renderer 

      ytd-comment-renderer.ytd-comment-thread-renderer div#body"

      //////////////////////////////////////////////////////////

      Comment thread text FULL PATH: (37)
      "ytd-comment-thread-renderer.ytd-item-section-renderer 
      
      ytd-comment-renderer.ytd-comment-thread-renderer div#body div#main ytd-expander#expander div#content yt-formatted-string#content-text"

      //////////////////////////////////////////////////////////

      Comment replies FULL PATH: (23)
      "ytd-comment-thread-renderer.ytd-item-section-renderer 
      
      div#replies ytd-comment-replies-renderer ytd-expander div#content div div#loaded-replies ytd-comment-renderer"
    */

    // The 'CommentSection' that will include all content that we need
    let CommentSection = []

    // The container for all comment threads
    const allOPCommentContainers = await page.$$('ytd-comment-thread-renderer.ytd-item-section-renderer')


    // THE SRC IS HIDDEN FOR SOME USERS, AND THERE'S NOTHING I CAN DO ABOUT IT

    for(let i = 0; i < allOPCommentContainers.length; i++){

      // The selector for the first comment of every thread
      // space is required
      const commentThreadStr = 'ytd-comment-renderer.ytd-comment-thread-renderer '

      // The relative location of "Post" data

      const commentHandlerStr = 'div#body div#main ytd-expander#expander div#content yt-formatted-string#content-text'

      const imgHandlerStr = 'yt-img-shadow'

      const nameHandlerStr = 'a#author-text span.ytd-comment-renderer'

      const dateLinkHandlerStr = 'div#body div#main div#header div#header-author yt-formatted-string.published-time-text a.yt-simple-endpoint'

      const likeHandlerStr = 'div#body div#main span#vote-count-left'

      const isCreatorHandlerStr = 'div#body div#main div#header div#header-author span#author-comment-badge ytd-author-comment-badge-renderer.creator'

      // Element handle that holds the comment
      // Note to self: await turns elementHandler from pending => usable value
      const commentHandler = await allOPCommentContainers[i].$(commentThreadStr + commentHandlerStr)

      // The comment text
      const comment = await page.evaluate( singleComment => singleComment.innerText ,commentHandler)

      // Element handle that holds the avatar image
      const imgHandler = await allOPCommentContainers[i].$(commentThreadStr + imgHandlerStr)

      
      // Avatar image
      const avatar = await imgHandler.$eval('img#img',imgSelector => imgSelector.src)

      // while(avatar == ""){
      //   console.log('hit')
      //   avatar = await imgHandler.$eval('img#img',imgSelector => imgSelector.src)

      // }
     

      // Element handle that holds the name of initial commenter
      const nameHandler = await allOPCommentContainers[i].$(commentThreadStr + nameHandlerStr)

      // Name of initial commenter
      let name = await page.evaluate( name => name.innerText,nameHandler)

      name = name.trim()

      // Element handle that holds the date and link of comment
      const dateLinkHandler = await allOPCommentContainers[i].$(commentThreadStr + dateLinkHandlerStr)
      
      // Date of post - shows edit if any
      const date = await page.evaluate( singleDate => singleDate.innerText ,dateLinkHandler)

      // Element handle that holds the likes
      const likeHandler = await allOPCommentContainers[i].$(commentThreadStr + likeHandlerStr)

      // Evaluating likes
      let likes = await page.evaluate( likeAmt => likeAmt.innerText ,likeHandler)

      likes = likes.trim()

      // link to particular comment
      const link = await page.evaluate( link => link.href ,dateLinkHandler) 
      
      // check if original thread creator made this particular post

      const isCreatorHandler = await allOPCommentContainers[i].$(commentThreadStr + isCreatorHandlerStr)

      if(isCreatorHandler){
        var isCreator = true
      } else {
        var isCreator = false
      }

      // console.log(isCreator)

      // Check if a post has replies

      const hasReplies = await allOPCommentContainers[i].$$('div#replies ytd-comment-replies-renderer ytd-expander div#content div div#loaded-replies ytd-comment-renderer')

      if(hasReplies.length > 0){
        console.log('Replies found for',(i+1))
        io.emit('FindRepliesData', `Replies found for Post #${(i+1)}`);

        // 'replies' array needs access to data from inside the following block scope
        var replies = []

        // Relative location of "reply" data
        const replyThreadStr = 'ytd-comment-replies-renderer '

        for (let i = 0; i < hasReplies.length; i++) {

          // reply text element handler
          const repliesHandler = await hasReplies[i].$(replyThreadStr + commentHandlerStr)

          // The replier text
          const reply = await page.evaluate(singleReply => singleReply.innerText, repliesHandler)

          // full path: ytd-comment-replies-renderer yt-img-shadow
          // hasReplies[i]
          // replyThreadStr in Handler

          // Element handle that holds the avatar image of replier
          const imgHandlerRep = await hasReplies[i].$(replyThreadStr + imgHandlerStr)

          // Avatar image of replier
          const avatarRep = await imgHandlerRep.$eval('img#img',imgSelector => imgSelector.src)

          // Element handle that holds the name of a replier
          const nameHandlerRep = await hasReplies[i].$(replyThreadStr + nameHandlerStr)

          // Name of the replier
          let nameRep = await page.evaluate( name => name.innerText,nameHandlerRep)

          nameRep = nameRep.trim()

          // Element handle that holds the date and link of replier
          const dateLinkHandlerRep = await hasReplies[i].$(replyThreadStr + dateLinkHandlerStr)
      
          // Date of post - shows edit if any - for replier
          const dateRep = await page.evaluate( singleDate => singleDate.innerText ,dateLinkHandlerRep)

          // Element handle that holds the likes of replier
          const likeHandlerRep = await hasReplies[i].$(replyThreadStr + likeHandlerStr)

          // Evaluating likes of replier
          let likesRep = await page.evaluate( likeAmt => likeAmt.innerText ,likeHandlerRep)

          likesRep = likesRep.trim()

          // link to particular replier
          const linkRep = await page.evaluate( link => link.href ,dateLinkHandlerRep)

          // check if original thread creator made this reply

          const isCreatorHandlerRep = await hasReplies[i].$(replyThreadStr + isCreatorHandlerStr)

          if(isCreatorHandlerRep){
            var isCreatorRep = true
          } else {
            var isCreatorRep = false
          }

          const replyInfo = {
            id: i,
            avatarRep: avatarRep,
            nameRep: nameRep,
            dateRep: dateRep,
            reply: reply,
            likesRep: likesRep,
            linkRep: linkRep,
            isCreatorRep: isCreatorRep,
          }

          replies.push(replyInfo)
        }

      } else {
        // res.send({data: 'finding replies'})
        await res.write('finding replies')

        console.log('No replies found for', (i+1))
        io.emit('FindRepliesData', `No replies found for Post #${(i+1)}`);
        var replies = false
      }

      const thread = {
        id: i,
        avatar: avatar,
        name: name,
        date: date,
        comment: comment,
        likes: likes,
        link: link,
        isCreator: isCreator,
        replies: replies
      }

      // res.send({data: 'collecting comment data'})
      await res.write('collecting comment data')
      CommentSection.push(thread)

    }

    await io.emit('FindRepliesData', '"Reply Finding" Complete! Scroll down to view results.');
    const myJSON = JSON.stringify(CommentSection,null,2);

    // console.log(myJSON)
    console.log('end of loop')
    browser.close()

    return myJSON
    
  } catch (error) {
    console.log("our error", error)

    const navErr = "Error: Protocol error (Page.navigate): Cannot navigate to invalid URL"
    const nullErr = `TypeError: Cannot read property 'click' of null`
    const EvalErr = `Error: Evaluation failed`


    if(error == navErr || error == nullErr || error.startsWith(EvalErr)){
      await io.emit('ErrorMsg', `Error encountered. Check to make sure your URL, "${youtubeLink}", exists and try again`);
    } else{
      await io.emit('ErrorMsg', `${error}`);
    }
    
  }

};

module.exports = main

