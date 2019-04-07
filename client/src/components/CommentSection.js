import React, { Component } from 'react';
import Comment from './Comment/Comment'
const JSONresult = require('./ResultTest')

class CommentSection extends Component {

  render() {
    // const { Result } = this.props
    // const JSONresult = JSON.parse(Result)

    return (
      <div className="progress-class">
        <div>
          <h2>Result</h2>
        </div>

          <Comment 
            JSONresult = {JSONresult}
          />
      </div>
    )
  }
}

export default CommentSection;