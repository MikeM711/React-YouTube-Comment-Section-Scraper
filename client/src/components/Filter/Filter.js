import React, { Component } from 'react';
import './Filter.css'

class Filter extends Component {
  state = {
    videoCreatorComRep: false,
    wordFilterText: false,
    wordFilterClick:'',
  }

  handleVideoCreator = () => {
    this.setState((state,props) => ({
      videoCreatorComRep: !state.videoCreatorComRep
    }), () => {
      this.props.creatorFilter(this.state.videoCreatorComRep) 
    })
  }

  handleWordFilterChange = (event) => {
    const value = event.target.value
    this.setState((state,props) => ({
      wordFilterText: value
    }), () => {
    this.props.wordFilter(value)
    })
  }


  render() {
    // const { Result } = this.props
    let { wordFilterClick } = this.state

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
                onChange={() => { this.handleVideoCreator() }}
              />
              <span>Comments by the Video Creator</span>
            </label>
          </p>

          <div className="row">
            <div className="input-field col s6">
              <input 
                id="word-filter" 
                type="text"
                onBlur={() => { 
                  if(!this.state.wordFilterText){
                    this.setState({wordFilterClick: ''}) }
                  }}
                onFocus={() => { this.setState({wordFilterClick: 'active'}) }}
                onChange={this.handleWordFilterChange}
                />
              <label className={"word-filter-label " + wordFilterClick}  htmlFor="word-filter">Comments that contain the following phrase</label>
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