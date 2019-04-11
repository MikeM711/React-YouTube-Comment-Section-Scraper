import React, { Component } from 'react';
import './Progress.css'

class Progress extends Component {

  render() {
    const { ProgressScroll, ComExpand, ShowMoreRep, FindRep, 
      ErrMsg, Thumbnail, Title, VideoFound } = this.props

      const findingVideo = VideoFound ? ('Video Found!') : ('Searching...')

      const completeFindVideo = VideoFound ? ("complete") : ("incomplete")
      const completeScroll = ComExpand ? ("complete") : ("incomplete")
      const completeExpand = ShowMoreRep ? ("complete") : ("incomplete")
      const completeShowMore = ShowMoreRep === '0 "show more replies" buttons visible' ? 
        ("complete") : ("incomplete")
      const completeFindRep = FindRep === '"Reply Finding" Complete!' ? 
        ("complete") : ("incomplete")

    return (
      <div className="progress-class">
        <div>
          <h2>Progress</h2>
        </div>
        <div className="progress-display">
          <p className="errorMsg">{ErrMsg}</p>
          <p className={completeFindVideo}> <b>Finding Video:</b> {findingVideo}</p>
          <p className={completeScroll}> <b>Scrolling:</b> {ProgressScroll}</p>
          <p className={completeExpand}> <b>Expanding Comments:</b> {ComExpand}</p>
          <p className={completeShowMore}> <b>"Show More Replies" Buttons:</b> {ShowMoreRep}</p>
          <p className={completeFindRep}> <b>Finding Replies:</b> {FindRep}</p>
          
          <h3>{Title}</h3>
          
        </div>
        <div className="thumbnail">
          <img src={Thumbnail} alt=""/>
        </div>
      </div>
    )
  }
}

export default Progress;