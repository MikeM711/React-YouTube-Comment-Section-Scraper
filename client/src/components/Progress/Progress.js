import React, { Component } from 'react';

import './Progress.css';
import progressRunning from '../../Images/progress-running.png';
import ytIcon from '../../Images/youtube-icon.png';

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
    const completeProgressSub = completeFindRep === "complete" ? (
      <h6 className="complete">Scroll down to view Results</h6>
    ) : false;

    return (
      <div className="progress-class">
        <div className="progress-title">
          <img src={progressRunning} alt="" />
          <h4 className={completeFindRep} ><b>Progress {completeProgress}</b></h4>
          {completeProgressSub}
        </div>
        <hr />
        <div className="progress-row">
          <div className="progress-display">
            <p className="errorMsg">{ErrMsg}</p>
            <p className={completeFindVideo}> <b>Finding Video:</b> {findingVideo}</p>
            <p className={completeScroll}> <b>Scrolling:</b> {ProgressScroll}</p>
            <p className={completeExpand}> <b>Expanding Comments:</b> {ComExpand}</p>
            <p className={completeShowMore}> <b>"Show More Replies" Buttons:</b> {ShowMoreRep}</p>
            <p className={completeFindRep}> <b>Finding Replies:</b> {FindRep}</p>
          </div>
        </div>
        <div className="progress-issues">
          <div className="card-panel progress-issues-card #e8eaf6 indigo lighten-5 col s4" >
            <p>If your progress is hanging (no progress made within 120 seconds), or an incorrect error shows up: </p>
            <p>1. Refresh and try again</p>
            <span>2. Send your progress log and your link to my </span>
            <a href="https://github.com/MikeM711/youtube-comment-section-scraper"
              target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        {Thumbnail ? (
            <div className="thumbnail-class">
              <div className="video-title">
                <img src={ytIcon} alt="" />
                <h4> <b>YouTube Video</b> </h4>
              </div>
              <hr />
              <h4 className="center">{Title}</h4>
              <div className="thumbnail center">
                <img src={Thumbnail} alt="" />
              </div>
            </div>
          ) : null}
          
      </div>
    );
  };
};

export default Progress;