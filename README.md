# React Youtube Comment Section Scraper
A full stack application that scrapes and filters YouTube comments of a particular video, using Node.js, Express.js, React.js, Puppeteer and Socket.IO.

This application scrapes YouTube comments with Chromium Headless (using Google's [Puppeteer](https://github.com/GoogleChrome/puppeteer)), instead of using the YouTube API.  It also relays real-time progress messages to the client using Socket.IO, for an appropriate user-experience. Data and progress is displayed to the client, using React.js.

Once the client has received the comment section data, the user is able to filter comments and replies by: video creator, number of likes, word phrases, username, and date. Filtering is displayed instantly. Using multiple filters will be chained together for a more specific result.

If a comment or reply in a thread does not meet filter criteria, the comment thread will not display.  

If either a comment or a reply meets filter criteria, the particular post will highlight in green, and the whole thread will display. Having the entire thread display was made in the mindset of providing context to the filtered post.

Check out the application here: https://youtube-comment-scraper.herokuapp.com/

## Demo: Fetching The Comment Section

What is it like to run this application?

The gif below demonstrates the "Example URL" provided within the application.

![demo-fetch](https://raw.githubusercontent.com/MikeM711/React-YouTube-Comment-Section-Scraper/master/demo/youtube-scraper-demo.gif)

## Demo: The Filter

Have you ever wanted to view only top comments, but you find that some are buried within the comment section?

Have you ever wanted to view all of the comments that the video creator has made on their video? Maybe they have replied some gems to someone's comment.

The filter inside this application will help you with that!

![demo-filter](https://raw.githubusercontent.com/MikeM711/React-YouTube-Comment-Section-Scraper/master/demo/widget-calculator-filter.gif)

## Backend

Using Headless Chromium and Puppeteer, this application scrapes the following off of replies and comments:
- Comment/Reply Text
- Avatar Image
- Name
- Date
- Likes
- Context
- Made by Video Creator (`true/false`)

Larger comment sections generally take a while to fully scrape. For user-experience, the backend sends out the following progress data to the frontend using Socket.IO:
- Finding Video
- Scrolling
- Expanding Comment Replies
- Clicking "Show More Replies" buttons
- Gathering data

## Frontend

Filters provided:
- Video creator
- Number of likes
- Word phrases
- Username
- Date

Handles errors:
- Providing a YouTube video that has its comments disabled
- Providing an invalid YouTube link
- Providing a YouTube video that has 2,000+ comments

Filtering situations:
- Disables "Username" filter if "Video creator" filter is used, and vice versa

# Development
Install backend dependencies: `npm install`

Install frontend dependencies: `cd client` `npm install`

Concurrently run both backend and frontend servers (root directory): `npm run start`

### View Dummy YouTube Comment Section

If you wish to display dummy data: inside [Video Submission Component](https://github.com/MikeM711/React-YouTube-Comment-Section-Scraper/blob/master/client/src/components/VideoSubmission/VideoSubmission.js), comment out the `let...` line, and un-comment the last 3 lines.

    // Testing & Production
    let { ioResResult } = this.state; // production
    // let ioResResult = JSON.stringify(require('../../utils/TestResults/ResultTest2')); // testing
    // resultsActive = true; // testing
    // progressActive = true; // testing

### Test Videos

    https://www.youtube.com/watch?v=lDLQA6lQSFg (disabled comments)
    https://www.youtube.com/watch?v=IaKLsGIR6SM (0 comments)
    https://www.youtube.com/watch?v=DozrRY2NENU (500 comments)
    https://www.youtube.com/watch?v=OGxgnH8y2NM (800 comments + long comment chain)
    https://www.youtube.com/watch?v=RoGHVI-w9bE (800 comments + long comment chain + many 1k+ comments)
    https://www.youtube.com/watch?v=ybrY9JWVBv4 (too many comments )

# Troubleshooting

1. The application is hanging when I use it. What's going on?

If the application hangs, it will typically hang during the clicking of the `"Show More Replies" buttons` portion of the run. If the comment section is large, having it hang for ~2 minutes or less is normal.

However, if the application hangs longer than that, the most probable cause is because YouTube overlays prompts about things like "YouTube Red" or "Rate your YouTube Experience". These prompts that are frequently updated by YouTube will impede the clicking of the "show more replies" buttons in particular. I have tried to hunt for all of the prompts to close them all, but the process became too tedious. It is better that you refresh and try again if you are stuck. 

The frequency of prompts will be much less the more runs you do.

2. I have ran, refreshed and restarted a few times, but the application has not completed a run

Chances are that YouTube has updated its HTML - YouTube tends to update its HTML every one or two months causing some operations to not work. Typically, only minor tweaks are needed to get the app back up and running.

# FAQ

Q: For videos with a large amount of comments, why does the number of YouTube comments scraped by this application not always equal to the number that YouTube displays?

A: This program reads comments like an average user, and therefore, will scrape all comments that an average user will view.  Interestingly, it seems that YouTube does not display all of its comments!  This typically occurs when a video has about 300+ comments.  You can test this out by manually expanding all comments of this [video](https://www.youtube.com/watch?v=DozrRY2NENU&lc=UgwJXxkTYTp3wUA579Z4AaABAg) (click every "View # replies" and "Show more replies" buttons). Personally, I have found ~90 comments less than what YouTube displays (equal to the number this application can scrape).

If you are creating a program that must be able to read all YouTube comments (including ones that do not get rendered), check out the [YouTube API](https://developers.google.com/youtube/v3/docs/commentThreads).

If you are creating a program where all of your data is accurately displayed on the client and the HTML does not frequently change (or you are prepared to fix your code during these HTML changes), Puppeteer is a viable choice.

Q: Why use `"puppeteer": "^1.9.0"` and not the latest version?

A: The latest version has trouble viewing YouTube videos.

Q: Why does the number of "Scroll Batches" vary for the same video?

A: How YouTube renders its comment section, and the time it takes to render, varies. Thus, making the number of "Scroll Batches" vary.  That said, this program should complete with the same number of comments and replies every time.

Q: Why are comments capped at 1,000?

A: The application can scrape an infinite number of comments.  But there are a few issues: 

1) As more HTML is rendered, the slower the YouTube page becomes. The scraping process may take longer than a user would be happy with.

2) Heroku can become finicky when dealing with Puppeteer/Chromium processing large numbers of comments on the page.
