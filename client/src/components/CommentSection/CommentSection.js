import React, { Component } from 'react';

import './CommentSection.css';
import ReplyComponent from '../Reply/Reply';
import Filter from '../Filter/Filter';
import filterFunction from '../../utils/FilterUtil';
import undefAvatar from '../../Images/question-mark.jpg';
import checkmarkImg from '../../Images/checkmark.png';
import commentIcon from '../../Images/comment-icon.png';

class CommentSection extends Component {
  state = {
    videoCreatorComRep: false,
    wordFilter: false,
    likesFilter: false,
    dateFilter: false,
    nameFilter: false,
  };

  handleCreatorFilter = (isActive) => {
    this.setState({
      videoCreatorComRep: isActive,
    });
  };

  handleWordFilter = (str) => {
    this.setState({
      wordFilter: str,
    });
  };

  handleLikesFilter = (num) => {
    num = Number(num)
    this.setState({
      likesFilter: num,
    });
  };

  handleDateFilter = (date) => {
    this.setState({
      dateFilter: date,
    });
  };

  handleNameFilter = (name) => {
    this.setState({
      nameFilter: name,
    });
  };

  render() {
    // Result payload
    const { Result } = this.props;
    let JSONresult = JSON.parse(Result);
    const { videoCreatorComRep, wordFilter, likesFilter, dateFilter, nameFilter } = this.state;

    // Filtering the result if it exists/true
    // If the filter finds a thread, where no posts match the criteria, we will not display that thread
    JSONresult = JSONresult ? (filterFunction(JSONresult, videoCreatorComRep, wordFilter,
      likesFilter, dateFilter, nameFilter)) : (JSONresult);

    // Each comment thread will contain "Reply" components (if there is any)
    // Each thread will be stored in the following array (if it exists)
    const comments = JSONresult.length ? (
      JSONresult.map(OPcomment => {
        const Creator = OPcomment.isCreator ? ("comment-header-creator") : ("comment-header");
        const checkmark = OPcomment.isCreator ? (checkmarkImg) : (null);
        const Avatar = OPcomment.avatar !== "" ? (OPcomment.avatar) : (undefAvatar);

        // Below variable adds "finder" to the className of a div to show what post has been found, due to filtering
        const finder = OPcomment.filter === true ? ("finder") : ("");

        // For a single comment thread, replies will be stored below
        const replies = OPcomment.replies.length ? (
          OPcomment.replies.map(reply => {
            return (
              <ReplyComponent
                key={reply.id}
                reply={reply}
              />
            );
          })
        ) : (null);

        // A single comment thread
        return (
          <div className="comment-thread collection" key={OPcomment.id}>
            <div className="comment-class card">
              <div className={Creator}>
                <img src={Avatar} alt=""></img>
                <span> <b>{OPcomment.name}</b> </span>
                <img src={checkmark} alt="" />
                <span> | Date: {OPcomment.date} | </span>
                <span>Likes: {OPcomment.likes} | </span>
                <span>
                  <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context </a>
                </span>
              </div>
              {/* If a comment matches the filter, display a light green div for the comment */}
              <div className={"comment-content " + finder}>
                <p>{OPcomment.comment}</p>
              </div>
            </div>
            <div className="comment-class-reply">
              {replies}
            </div>
          </div>
        );
      })
    ) : (<div className="center card no-comments-card">No Comments found</div>);

    // Render out filter, comments and replies
    return (
      <div className="completed-scrape-results">
        <Filter
          creatorFilter={this.handleCreatorFilter}
          wordFilter={this.handleWordFilter}
          LikesFilter={this.handleLikesFilter}
          dateFilter={this.handleDateFilter}
          nameFilter={this.handleNameFilter}
        />
        <div className="comment-class">
          <div className="comment-title">
            <img className="comment-icon" src={commentIcon} alt="" />
            <h3 className="blue-text"> <b>Comment Section</b></h3>
          </div>
          {comments}
        </div>
      </div>
    );
  };
};

export default CommentSection;