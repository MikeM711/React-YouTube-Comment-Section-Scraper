import React, { Component } from 'react';
import ReplyComponent from '../Reply/Reply'

class Comment extends Component {

  render() {
    const { JSONresult } = this.props

    const comments = JSONresult.length ? ( 
      JSONresult.map(OPcomment => {

        const Creator = OPcomment.isCreator ? ("true") : ("false")

        const replies = OPcomment.replies.length ? (
          OPcomment.replies.map(reply => {
            return (
              <div className="reply card" key={reply.id}>
                <p>{reply.reply}</p>
              </div>
            )
          })
        ) : (null)
        
        return (
          <div className="comment card" key={OPcomment.id}>
            <img src={OPcomment.avatar} alt=""></img>
            <span> <b>{OPcomment.name}</b> | </span>
            <span>Date: {OPcomment.date} | </span>
            <span>Likes: {OPcomment.likes} | </span>
            <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context | </a>
            <span>Creator? {Creator} </span>
            <p>{OPcomment.comment}</p>
            {replies}
          </div>
        )

      })
    ) : (
      <div className="center">No Comments found</div>
    )

    return (
      <div className="comment-class">
          {comments}
      </div>
    )
  }
}

export default Comment;