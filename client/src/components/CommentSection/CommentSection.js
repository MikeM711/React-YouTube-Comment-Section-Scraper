import React, { Component } from 'react';
import ReplyComponent from  '../Reply/Reply'
import './CommentSection.css'
import undefAvatar from '../../Images/question-mark.jpg'
import checkmarkImg from '../../Images/checkmark.png'
let JSONresult = require('../ResultTest2')

class CommentSection extends Component {

  render() {
    // const { Result } = this.props
    // const JSONresult = JSON.parse(Result)

    function CreatorReplyFilter(OPpost) {
      if (OPpost.replies) {
        var creatorReply = OPpost.replies.filter(replyPost => {
          return replyPost.isCreatorRep === true
        })
        if(creatorReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    function LikesReplyFilter(OPpost,likeBound){
      if (OPpost.replies) {
        var likesFilter = OPpost.replies.filter(replyPost => {
          let numRepLikes = Number(replyPost.likesRep)
          return numRepLikes >= likeBound
        })

        if (likesFilter.length > 0) {
          return OPpost
        } else {
          return null
        }
      }
    }

    function StringReplyFilter(OPpost) {
      if (OPpost.replies) {
        var stringReply = OPpost.replies.filter(replyPost => {
          return replyPost.reply.toLowerCase().includes('night')
        })
        if(stringReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    // Filtering example
    if(JSONresult){
      JSONresult = JSONresult.filter(OPpost => {
        
        // return threads where the video creator is the OP
        let creatorOPFilter = OPpost.isCreator === true
        
        // return threads where the video creator is the replier
        let creatorRepFilter = CreatorReplyFilter(OPpost)

        // return threads where the OP includes a certain string
        let wordOPFilter = OPpost.comment.toLowerCase().includes('night')

        // return threads where the replier includes a certain string
        let stringRepFilter = StringReplyFilter(OPpost);
        
        // return threads that have one or more replies of a certain amount of likes
        let likesRepFilter = LikesReplyFilter(OPpost,3)
        
        /*
        Returns video creator threads AND video creator replies
          return creatorOPFilter || creatorRepFilter

        Returns full threads if OP posts and replies use a certain word
          return stringRepFilter || wordOPFilter
        */
        
        return OPpost

        // return OPpost
      })
    }
    

    const comments = JSONresult.length ? ( 
      JSONresult.map(OPcomment => {

        const Creator = OPcomment.isCreator ? ("comment-header-creator") : ("comment-header")
        const checkmark = OPcomment.isCreator ? (checkmarkImg) : (null)
        const Avatar = OPcomment.avatar !== "" ? (OPcomment.avatar) : (undefAvatar)

        // Below variable adds "finder" to the className of a div to show what post has been found, due to filtering
        
        // const finder = " finder"
        const finder = ""
        
        const replies = OPcomment.replies.length ? (
          OPcomment.replies.map(reply => {
            return (
              <ReplyComponent
                key = {reply.id}
                reply = {reply}
              />
            )
          })
        ) : (null)
        
        return (
          <div className="comment-thread collection" key={OPcomment.id}>
            <div className="comment-class card">

              <div className={Creator}> 
                <img src={Avatar} alt=""></img>
                <span> <b>{OPcomment.name}</b> </span>
                <img src={checkmark} alt=""/>
                <span> | Date: {OPcomment.date} | </span>
                <span>Likes: {OPcomment.likes} | </span>
                <span>
                  <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context </a> 
                </span>
                {/*<span>Creator? {Creator} </span> */}
              </div>

              <div className={"comment-content" + finder}>
                <p>{OPcomment.comment}</p>
              </div>

            </div>

            <div className="comment-class-reply">
              {replies}
            </div>
            
          </div>
        )
      })) : (<div className="center">No Comments found</div>)

    return (
      <div className="progress-class">
        <div>
          <h2>Result</h2>
        </div>
        {/* Filter component 
          - Have a "filter state"
          - send "filter" instructions by function out of component
          - start with a hard-coded filter
            - ie: comments/replies of isCreator and isCreatorRep = true
        
        */}
        <div className="comment-class">
          {comments}
        </div>
      </div>
    )
  }
}

export default CommentSection;