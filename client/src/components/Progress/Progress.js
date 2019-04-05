import React, { Component } from 'react';

class VideoSubmission extends Component {

 render() {
   const {ProgressScroll,ComExpand,
    ShowMoreRep ,FindRep, ErrMsg} = this.props
   return (
     <div className="progress-class">
       <div>
         <h2>Progress</h2>
       </div>
       <div>
         <p>Your progress:</p>
         <p>Scrolling: {ProgressScroll}</p>
         <p>Expanding Comments: {ComExpand}</p>
         <p>"Show More Replies" Buttons: {ShowMoreRep}</p>
         <p>Finding Replies: {FindRep}</p>
         <p>{ErrMsg}</p>
         <p>Video: https://www.youtube.com/watch?v=IHt71N47cc0</p>
       </div>
     </div>
   )
 }
}

export default VideoSubmission;