import React, { Component } from 'react';

import './Filter.css';
import filterIcon from '../../Images/filter-icon.png';

class Filter extends Component {
  state = {
    videoCreatorComRep: false,
    wordFilterClick: '',
    wordFilterText: false,
    likesFilterNum: '',
    userFilterClick: '',
    userFilterText: false,
  };

  handleVideoCreator = () => {
    this.setState((state) => ({
      videoCreatorComRep: !state.videoCreatorComRep
    }), () => {
      this.props.creatorFilter(this.state.videoCreatorComRep)
    });
  };

  handleWordFilterChange = (event) => {
    const value = event.target.value.toLowerCase()
    this.setState(() => ({
      wordFilterText: value
    }), () => {
      this.props.wordFilter(value)
    });
  };

  handleUserFilterChange = (event) => {
    // make sure that all username checks are rendered toLowerCase()
    const value = event.target.value.toLowerCase()
    this.setState(() => ({
      userFilterText: value
    }), () => {
      this.props.nameFilter(value)
    });
  };

  handleLikesFilterChange = (event) => {
    const value = event.target.value;
    const re = /^[0-9\b]+$/; // only allow Numbers (0 - 9)
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState(() => ({
        likesFilterNum: value
      }), () => {
        this.props.LikesFilter(value)
      });
    };
  };

  handleDateFilter = (event) => {
    const value = event.target.options[event.target.selectedIndex].text;
    switch (value) {
      case "Last Hour":
        let date = ['second', 'minute'];
        this.props.dateFilter(date);
        break;
      case "Today":
        date = ['second', 'minute', 'hour'];
        this.props.dateFilter(date);
        break;
      case "This Week":
        date = ['second', 'minute', 'hour', 'day'];
        this.props.dateFilter(date);
        break;
      case "This Month":
        date = ['second', 'minute', 'hour', 'day', 'week'];
        this.props.dateFilter(date);
        break;
      case "This Year":
        date = ['second', 'minute', 'hour', 'day', 'week', 'month'];
        this.props.dateFilter(date);
        break;
      case "Comments Made: Lifetime":
        date = '';
        this.props.dateFilter(date);
        break;
      default:
        date = '';
        this.props.dateFilter(date);
        break;
    };
  };

  render() {
    const { wordFilterClick, userFilterClick, userFilterText, videoCreatorComRep } = this.state;

    // Don't allow access to "Video Creator Filter" if "User Filter" is used
    const disableCreator = userFilterText ? ("disabled") : ("");

    // Don't allow access to "User Filter" if "Video Creator Filter" is used
    const disableUser = videoCreatorComRep ? ("disabled") : ("");
    const disableUserText = disableUser === "disabled" ? (" - disabled - Video Creator filter is On") : ("");

    return (
      <div className="filter-class">
        <div className="filter-title">
          <img src={filterIcon} alt="" />
          <h4> <b>Comment Filter</b> </h4>
        </div>
        <hr />

        {/* Creator Filter */}
        <form action="#" className="filter-form">
          <div className="creator-filter">
            <label>
              <span className="creator-filter-text">Comments by the Video Creator</span>
              <input
                className="creator-filter-checkbox filled-in"
                type="checkbox"
                checked={this.state.videoCreatorComRep}
                onChange={() => { this.handleVideoCreator() }}
                disabled={disableCreator}
              />
              {/* In order to show the checkbox, I need to have a span tag after it.
                I would rather have text on the left, to make the page look pleasing.
                Therefore - the span tag includes a space - meaning: you can click a little to the right, and a click will still register */}
              <span>&nbsp;</span>
            </label>
          </div>

          {/* Likes Filter */}
          <div className="likes-filter-input">
            <label className="likes-filter-label"
              htmlFor="likes-filter">Have at least this many likes: </label>
            <input
              id="likes-filter"
              type="number"
              className="browser-default"
              min="0"
              value={this.state.likesFilterNum}
              onChange={this.handleLikesFilterChange}
            />
          </div>

          {/* Word Filter */}
          <div className="row word-filter-row">
            <div className="input-field word-filter">
              <input
                id="word-filter"
                type="text"
                onBlur={() => {
                  if (!this.state.wordFilterText) {
                    this.setState({ wordFilterClick: '' })
                  }
                }}
                onFocus={() => { this.setState({ wordFilterClick: 'active' }) }}
                onChange={this.handleWordFilterChange}
              />
              <label className={"word-filter-label " + wordFilterClick} htmlFor="word-filter">Contains the following phrase</label>
            </div>
          </div>

          {/* User Filter */}
          <div className="row user-filter-row">
            <div className="input-field user-filter">
              <input
                id="user-filter"
                type="text"
                onBlur={() => {
                  if (!this.state.userFilterText) {
                    this.setState({ userFilterClick: '' });
                  };
                }}
                onFocus={() => { this.setState({ userFilterClick: 'active' }) }}
                onChange={this.handleUserFilterChange}
                disabled={disableUser}
              />
              <label className={"user-filter-label " + userFilterClick} htmlFor="user-filter">Created by the user{disableUserText} </label>
            </div>
          </div>

          {/* Date Filter Dropdown*/}
          <div className="input-field-date">
            <select
              defaultValue="0"
              className="date-filter browser-default"
              onChange={this.handleDateFilter}
            >
              <option value="0" >Comments Made: Lifetime</option>
              <option value="1">Last Hour</option>
              <option value="2">Today</option>
              <option value="3">This Week</option>
              <option value="4">This Month</option>
              <option value="5">This Year</option>
            </select>
          </div>

        </form>
      </div>
    );
  };
};

export default Filter;