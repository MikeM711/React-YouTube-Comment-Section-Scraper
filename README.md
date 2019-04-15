# Youtube Comment Section Scraper
A full stack application that scrapes and filters YouTube comments of a particular video, using Node.js, Express and React.

The application scrapes YouTube comments with Chrome Headless (using Google's [Puppeteer](https://github.com/GoogleChrome/puppeteer)), instead of using the YouTube API.  Application relays real-time progress messages to the client using Socket.IO, for an appropriate user-experience. Data and progress is displayed to the client, using React.

Once the client has received the comment section data, the user is able to filter comments and replies by: video creator, number of likes, word phrases, username, and date. Filtering is displayed instantly. Using multiple filters will be chained together for a more specific result.

If a comment or reply in a thread does not meet filter criteria, the comment thread will not display.  

If either a comment or a reply meets filter criteria, the particular post will highlight in green, and the whole thread will display. Having the entire thread display was in the mindset of providing context to the filtered post.

Check out the application: https://youtube-comment-scraper.herokuapp.com/

## Backend

Using Headless Chrome and Puppeteer, this application scrapes the following off of replies and comments:
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

If you wish to display dummy data: inside [Video Submission Component](https://github.com/MikeM711/youtube-comment-section-scraper/blob/master/client/src/components/VideoSubmission.js), comment out the `let...` line, and un-comment the last 3 lines.

    // Testing & Production

    let { ioResResult } = this.state // production
    // let ioResResult = JSON.stringify(require('../utils/TestResults/ResultTest2')) // testing
    // resultsActive = true // testing
    // progressActive = true // testing

# FAQ

Q: Why use `"puppeteer": "^1.9.0"` and not the latest version?

A: The latest version has trouble viewing YouTube videos.

Q: How come the number of "Scroll Batches" may vary for the same video?

A: How YouTube renders its comment section, and the time it takes to render, varies. That said, the program should complete with the same number of comments and replies every time.

Q: Why are comments capped at 2,000?

A: The Application can scrape an infinite number of comments.  But there are a few issues: 

1) The more HTML is rendered, the slower the YouTube page becomes. I would rather not have the user wait a long time for a comment section to load. 

2) Heroku can become finicky when dealing with large numbers of comments.
