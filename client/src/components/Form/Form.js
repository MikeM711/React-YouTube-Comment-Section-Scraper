import React, { Component } from 'react';

import './Form.css';
import gitIcon from '../../Images/github-icon.png';

class Form extends Component {
  state = {
    url: '',
    inputDisable: '',
  };

  handleUrlChange = (e) => {
    this.setState({
      url: e.target.value
    });
  };

  handleSubmit = (event) => {
    // Don't allow page to refresh
    event.preventDefault();

    // Send URL data out of Form, into VideoSubmission component
    console.log('form submitted', this.state.url);
    this.props.UrlSubmit(this.state.url);

    // Once submitted, don't allow user to use any inputs
    this.setState({
      inputDisable: true
    });
  };

  handleTestVideo = () => {
    this.setState({
      url: 'https://www.youtube.com/watch?v=IHt71N47cc0'
    });
  };

  render() {
    // If Progress component is active, toggle disabled attributes to be true
    const { progressActive } = this.props;
    return (
      <div className="form">
        <div className="url-form" >
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              onChange={this.handleUrlChange}
              value={this.state.url}
              disabled={progressActive}
              placeholder="Enter YouTube video URL here (2,000 comments maximum)"
            />
            <button
              className="waves-effect waves-light btn #42a5f5 blue lighten-1"
              disabled={progressActive}
            >Submit</button>
          </form>
          <br />
          <button
            className="waves-effect waves-light btn #90caf9 blue lighten-3"
            onClick={this.handleTestVideo}
            disabled={progressActive}
          >Click For An Example URL</button>
        </div>
        <br />
        <div className="github-repo">
          <img src={gitIcon} alt="" />
          <a href="https://github.com/MikeM711/youtube-comment-section-scraper"
            target="_blank" rel="noopener noreferrer">GitHub Repo</a>
        </div>
      </div>
    );
  };
};

export default Form;