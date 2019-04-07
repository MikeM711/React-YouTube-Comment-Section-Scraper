import React, { Component } from 'react';
import './Reply.css'

class Reply extends Component {

  render() {
    const { reply } = this.props

    return (
      <div className="reply-class card" key={reply.id}>
      <img src={reply.avatarRep} alt=""></img>
        {/*
          
          <span> <b>{OPcomment.name}</b> | </span>
          <span>Date: {OPcomment.date} | </span>
          <span>Likes: {OPcomment.likes} | </span>
          <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context | </a>
          <span>Creator? {Creator} </span>
          <p>{OPcomment.comment}</p>
          */}
        <span>{reply.reply}</span>

      </div>
    )
  }
}

export default Reply;