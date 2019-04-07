import React, { Component } from 'react';
import ReplyComponent from  '../Reply/Reply'
import './CommentSection.css'
const JSONresult = require('../ResultTest')

class CommentSection extends Component {

  render() {
    // const { Result } = this.props
    // const JSONresult = JSON.parse(Result)

    const comments = JSONresult.length ? ( 
      JSONresult.map(OPcomment => {

        const Creator = OPcomment.isCreator ? ("true") : ("false")

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
          <div className="comment-thread" key={OPcomment.id}>
            <div className="comment-class card">

              <img src={OPcomment.avatar} alt=""></img>
              <span> <b>{OPcomment.name}</b> | </span>
              <span>Date: {OPcomment.date} | </span>
              <span>Likes: {OPcomment.likes} | </span>
              <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context | </a>
              <span>Creator? {Creator} </span>
              <p>{OPcomment.comment}</p>
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