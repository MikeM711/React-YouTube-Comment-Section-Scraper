import React, { Component } from 'react';
import './Filter.css'

class Filter extends Component {
  state = {
    videoCreatorComRep: false
  }

  handlevideoCreator = () => {
    this.setState((state,props) => ({
      videoCreatorComRep: !state.videoCreatorComRep
    }), () => {
      this.props.creatorFilter(this.state.videoCreatorComRep) 
    })
    
    // 

  }

  render() {
    // const { Result } = this.props
    let wordFiltActive = "active"

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
              <span>Comments by the Video Creator</span>
            </label>
          </p>

          <div className="row">
            <div className="input-field col s6">
              <input 
                id="word-filter" 
                type="text"
                />
              <label className={"word-filter-label " + wordFiltActive}  htmlFor="word-filter">Comments that contain the following phrase</label>
            </div>
          </div>

          {/*
          <div className="row no-padding-bottom">
            <div className="word-filter col s12">
              Contains the following: 
                <div className="input-field inline word-filter">
                <input id="word-filter-inline" type="text" />
              </div>
            </div>
          </div>

          <div className="row no-padding-bottom">
            <div className="word-filter col s12">
              At least this many likes: 
                <div className="input-field inline word-filter">
                <input id="word-filter-inline" type="number" />
              </div>
            </div>
          </div>
          */}



        </form>


        <br></br>
        <br></br>


      </div>
    )
  }
}

export default Filter;