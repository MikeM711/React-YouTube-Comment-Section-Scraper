import React, { Component } from 'react';

import './Reply.css';
import undefAvatar from '../../Images/question-mark.jpg';
import checkmarkImg from '../../Images/checkmark.png';

class Reply extends Component {

  render() {
    const { reply } = this.props;
    const CreatorRep = reply.isCreatorRep ? ("reply-header-creator") : ("reply-header");
    const checkmarkRep = reply.isCreatorRep ? (checkmarkImg) : (null);
    const AvatarRep = reply.avatarRep !== "" ? (reply.avatarRep) : (undefAvatar);
    const finder = reply.filter === true ? ("finder") : ("");

    return (
      <div className="reply-class collection-item" key={reply.id}>
        <div className={CreatorRep}>
          <img src={AvatarRep} alt=""></img>
          <span> <b>{reply.nameRep}</b> </span>
          <img src={checkmarkRep} alt="" />
          <span> | Date: {reply.dateRep} | </span>
          <span>Likes: {reply.likesRep} | </span>
          <a href={reply.linkRep} target="_blank" rel="noopener noreferrer" >Context</a>
        </div>
        <div className={"reply-content " + finder}>
          <p>{reply.reply}</p>
        </div>
      </div>
    );
  };
};

export default Reply;