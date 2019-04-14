import React, { Component } from 'react';

class Form extends Component {
  state = {
    url: '',
    inputDisable: '',
  }

  // Listens to every change of value in input field
  handleChange = (e) => {
    this.setState({
      url: e.target.value
    });
  }

  handleSubmit = (event) => {
    // Don't allow page to refresh
    event.preventDefault();

    // Send URL data out of Form, into VideoSubmission component
    console.log('form submitted', this.state.url)
    this.props.UrlSubmit(this.state.url)

    // Once submitted, don't allow user to use any inputs
    this.setState({
      inputDisable: true
    })
  }

  handleTestVideo = () => {
    this.setState({
      url: 'https://www.youtube.com/watch?v=IHt71N47cc0'
    })
  }

  render() {

    // If Progress component is active, toggle disabled attributes to be true
    const { progressActive } = this.props

    return (
      <div className="form">
        <div className="url-form" >
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.url}
              disabled={progressActive}
              placeholder="Enter YouTube video URL here (2,000 comments maximum)"
            />
            <button
              className="waves-effect waves-light btn #42a5f5 blue lighten-1"
              disabled={progressActive}
            >Submit</button>
          </form>
          
          <br></br>

          <button
            className="waves-effect waves-light btn #90caf9 blue lighten-3"
            onClick={this.handleTestVideo}
            disabled={progressActive}
          >Click For An Example URL</button>
        </div>

      </div>
    )
  }
}

export default Form;