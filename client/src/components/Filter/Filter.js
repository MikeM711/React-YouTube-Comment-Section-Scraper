import React, { Component } from 'react';

class Filter extends Component {
  state = {
    videoCreatorComRep: false
  }

  handlevideoCreator = () => {
    this.setState({
      videoCreatorComRep: !this.state.videoCreatorComRep
    })
  }

  render() {
    // const { Result } = this.props

    return (
      <div className="filter-class">
        <h2>Filter</h2>

        <form action="#">
          <p>
            <label>
              <input 
                type="checkbox" 
                className="filled-in" 
                checked={this.state.videoCreatorComRep}
                onChange={() => { this.handlevideoCreator() }}
              />
              <span>Show all Comments and Replies by the Video Creator</span>
            </label>
          </p>
        </form>

        <br></br>
        <br></br>


      </div>
    )
  }
}

export default Filter;