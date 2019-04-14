import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import Form from './Form/Form'
import Progress from './Progress/Progress'
import CommentSection from './CommentSection/CommentSection'

class VideoSubmission extends Component {
  state = {
    url: '', // YouTube URL
    ioThumbnail: '', // YouTube thumbnail
    ioTitle: '', //  YouTube video title
    ioVideoFound: false, // "Finding Video" progress
    ioResProgressScroll: false, // Scroll Progress
    ioResComExpand: false, // "Comments Expaned" Response Progress
    ioResShowMoreRep: false, // "Show More Replies" Response Progress
    ioResFindRep: false, // "Find Replies" Progress
    ioResResult: false, // Result Response
    ioErrMsg: false, // Puppeteer errors
    endpoint: "/", // URL we want to connect to
    progressActive: false, // Toggle "Progress" component display
    resultsActive: false, // Toggle "Results" component display
  }

  componentDidMount() {
    // Connect to server with socket.io
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    // Listening for events and sending the data to the state
    socket.on("Title", data => this.setState({ ioTitle: data }));
    socket.on("VideoFound", data => this.setState({ ioVideoFound: data }));
    socket.on("Thumbnail", data => this.setState({ ioThumbnail: data }));
    socket.on("ScrollData", data => this.setState({ ioResProgressScroll: data }))
    socket.on("ExpandedCommentData", data => this.setState({ ioResComExpand: data }))
    socket.on("ShowMoreRepData", data => this.setState({ ioResShowMoreRep: data }))
    socket.on("FindRepliesData", data => this.setState({ ioResFindRep: data }))
    socket.on("ResultData", data => this.setState({ ioResResult: data }));
    socket.on("ErrorMsg", data => this.setState({ ioErrMsg: data }))
  }

  componentWillUpdate() {
    // Handles the issue: user refreshes during the async/await process
    // When something gets updated, we will display the progress component, so that the user is aware of what is going on
    if (!this.state.progressActive) {
      this.setState({
        progressActive: true
      })
    }
  }

  // Listens to every change of value in input field
  handleChange = (e) => {
    this.setState({
      url: e.target.value
    });
  }

  handleUrlSubmit = (url) => {

    this.setState((state, props) => ({
      url: url
    }), () => {

      // Only enter axios if user provides a valid YouTube link beginning
      if (this.state.url.startsWith("https://www.youtube.com/watch?") || this.state.url.startsWith("https://m.youtube.com/watch?")) {

        this.setState({
          formActive: false,
          progressActive: true,
          ioErrMsg: false,
        })

        // 2nd param of POST passes data, the data is attached to the 'url' param - req.body.url
        axios.post('/youtubeData', {
          url: this.state.url
        })
          .then(res => {
            // logging out all of our "heartbeat" messages
            console.log(res)
          })
          .catch(err => console.log(err))
      } else {
        // Send out an error if we fail "if" check
        this.setState({
          ioErrMsg: 'Error: Please provide a valid YouTube video URL'
        })
      }
    })
  }

  render() {
    // socket.io event data
    const { ioThumbnail, ioTitle, ioVideoFound, ioResProgressScroll, ioResComExpand,
      ioResShowMoreRep, ioResFindRep, ioErrMsg } = this.state

    // Component Activation
    let { progressActive, resultsActive } = this.state

    // Display "CommentSection" component (our results) when socket emits the below message:
    resultsActive = ioResFindRep === '"Reply Finding" Complete! Scroll down to view results.' ? (true) : (false)

    // Testing & Production

    let { ioResResult } = this.state // production
    // let ioResResult = JSON.stringify(require('../utils/TestResults/ResultTest2')) // testing
    // resultsActive = true // testing
    // progressActive = true // testing

    // If there is no "ioResResult", make the variable 'false'
    ioResResult = ioResResult ? (ioResResult) : (false)

    return (
      <div className="app container">
        <div>
          <h2 className="blue-text">YouTube Comment Scraper</h2>
        </div>
        <div>

          <Form
            ioErrMsg={ioErrMsg}
            UrlSubmit={this.handleUrlSubmit}
            progressActive={progressActive}
          />

          {progressActive ? (
            <Progress
              Thumbnail={ioThumbnail}
              Title={ioTitle}
              VideoFound={ioVideoFound}
              ProgressScroll={ioResProgressScroll}
              ComExpand={ioResComExpand}
              ShowMoreRep={ioResShowMoreRep}
              FindRep={ioResFindRep}
              ErrMsg={ioErrMsg}
            />
          ) : (null)}

          {resultsActive ? (
            <CommentSection
              Result={ioResResult}
            />
          ) : (null)}

        </div>
      </div>
    )
  }
}

export default VideoSubmission;