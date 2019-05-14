import React, { Component } from 'react';

import './Progress.css';

class Progress extends Component {

  render() {
    // Socket.io messages from VideoSubmission component
    const { ProgressScroll, ComExpand, ShowMoreRep, FindRep,
      ErrMsg, Thumbnail, Title, VideoFound } = this.props;

    // Socket.io will be giving us the progress of the application
    let findingVideo = VideoFound ? ('Video Found!') : ('Searching...');
    findingVideo = !VideoFound && ErrMsg ? ('Video Not Found') : (findingVideo);

    // Turn text "green" (className = "complete") to let the user know that a section of progress is complete 
    const completeFindVideo = VideoFound ? ("complete") : ("incomplete");
    const completeScroll = ComExpand ? ("complete") : ("incomplete");
    const completeExpand = ShowMoreRep ? ("complete") : ("incomplete");
    const completeShowMore = ShowMoreRep === '0 "show more replies" buttons visible' ?
      ("complete") : ("incomplete");
    const completeFindRep = FindRep === '"Reply Finding" Complete! Scroll down to view results.' ?
      ("complete") : ("incomplete");
    const completeProgress = completeFindRep === "complete" ? ('Completed') : (null);

    return (
      <div className="progress-class">
        <h4>{Title}</h4>
        <div className="thumbnail">
          <img src={Thumbnail} alt="" />
        </div>
        <div className="progress-title">
          <h5 className={completeFindRep} ><b>Progress: {completeProgress}</b></h5>
        </div>
        <div className="progress-display">
          <p className="errorMsg">{ErrMsg}</p>
          <p className={completeFindVideo}> <b>Finding Video:</b> {findingVideo}</p>
          <p className={completeScroll}> <b>Scrolling:</b> {ProgressScroll}</p>
          <p className={completeExpand}> <b>Expanding Comments:</b> {ComExpand}</p>
          <p className={completeShowMore}> <b>"Show More Replies" Buttons:</b> {ShowMoreRep}</p>
          <p className={completeFindRep}> <b>Finding Replies:</b> {FindRep}</p>
        </div>
        <div className="row progress-issues-row">
          <div className="card-panel progres-issues-card #eeeeee grey lighten-3 col s6" >
            <p>If your progress is hanging (no progress made within 60 seconds), or an incorrect error shows up: </p>
            <p>1. Refresh and try again</p>
            <span>2. Send your progress log and your link to my </span>
            <a href="https://github.com/MikeM711/youtube-comment-section-scraper"
              target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    );
  };
};

export default Progress;