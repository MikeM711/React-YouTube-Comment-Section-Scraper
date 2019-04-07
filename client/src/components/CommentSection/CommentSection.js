import React, { Component } from 'react';
import ReplyComponent from  '../Reply/Reply'
import './CommentSection.css'
import undefAvatar from '../../Images/question-mark.jpg'
import checkmarkImg from '../../Images/checkmark.png'
// const JSONresult = require('../ResultTest')

class CommentSection extends Component {

  render() {
    const { Result } = this.props
    const JSONresult = JSON.parse(Result)

    const comments = JSONresult.length ? ( 
      JSONresult.map(OPcomment => {

        const Creator = OPcomment.isCreator ? ("comment-header-creator") : ("comment-header")
        const checkmark = OPcomment.isCreator ? (checkmarkImg) : (null)
        const Avatar = OPcomment.avatar !== "" ? (OPcomment.avatar) : (undefAvatar)
        
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
              <div className="comment-content">
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
        <div className="comment-class">
          {comments}
        </div>
      </div>
    )
  }
}

export default CommentSection;