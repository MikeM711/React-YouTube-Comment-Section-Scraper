import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import Form from './Form/Form'
import Progress from './Progress/Progress'
import CommentSection from './CommentSection/CommentSection'

class VideoSubmission extends Component {
 state = {
   url:'',
   ioThumbnail: '',
   ioTitle: '',
   ioVideoFound: false,
   ioResResult: false, // Result Response
   ioResProgressScroll: false, // Scroll Progress
   ioResComExpand: false, // "Comments Expaned" Response Progress
   ioResShowMoreRep: false, // "Show More Replies" Response Progress
   ioResFindRep: false, // "Find Replies" Progress
   ioErrMsg: false, // Puppeteer errors
   endpoint: "/", // originally: http://127.0.0.1:5000
   formActive: true,
   progressActive: false,
   resultsActive: false,
 }

componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("Title", data => this.setState({ ioTitle: data }));
    socket.on("VideoFound", data => this.setState({ ioVideoFound: data }));
    socket.on("Thumbnail", data => this.setState({ ioThumbnail: data }));
    socket.on("ScrollData", data => this.setState({ioResProgressScroll: data}))
    socket.on("ExpandedCommentData", data => this.setState({ioResComExpand: data}))
    socket.on("ShowMoreRepData", data => this.setState({ioResShowMoreRep: data}))
    socket.on("FindRepliesData", data => this.setState({ioResFindRep: data}))
    socket.on("ResultData", data => this.setState({ ioResResult: data }));
    socket.on("ErrorMsg", data => this.setState({ioErrMsg: data}))
    }

 // Listens to every change of value in input field
 handleChange = (e) => {
   this.setState({
     url: e.target.value
   });
 }

  handleUrlSubmit = (url) => {
    // event.preventDefault();
    this.setState({
      url: url
    })

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
        //2nd param passes data, the data is attached to the 'post' param - req.body.post
        axios.post('/youtubeData', {
          url: this.state.url
        })
          .then(res => {
            console.log('hit')
            console.log(res)
            // put the res.data inside our state, so we can use it in the component
            this.setState({
              url: '',
              resultsActive: true,
            });
          })
          .catch(err => console.log(err))
      } else {
        this.setState({
          ioErrMsg: 'Error: please provide a valid YouTube URL'
        })
      }
    })
 }

 render() {
   const {ioThumbnail, ioTitle, ioVideoFound, ioResProgressScroll, ioResComExpand,
     ioResShowMoreRep ,ioResFindRep, ioErrMsg} = this.state

     // Component Activation
     let {formActive, progressActive, resultsActive} = this.state 

     let {ioResResult} = this.state // production
     // let ioResResult = JSON.stringify(require('./ResultTest2')) // testing
     // resultsActive = true // testing
     // progressActive = true // testing

     // If there is no "ioResResult", make the variable 'false'
     ioResResult = ioResResult ? (ioResResult) : (false)

   return (
     <div className="app container">
       <div>
         <h2>YouTube Comment Scraper</h2>
       </div>
       <div>

         {formActive ? (
           <Form
             ioErrMsg={ioErrMsg}
             UrlSubmit={this.handleUrlSubmit}
           />
         ) : (null)}

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