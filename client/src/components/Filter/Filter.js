import React, { Component } from 'react';
import './Filter.css'

class Filter extends Component {
  state = {
    videoCreatorComRep: false,
    wordFilterText: false,
    likesFilterNum: '',
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
    const value = event.target.value.toLowerCase()
    console.log(value)
    this.setState((state,props) => ({
      wordFilterText: value
    }), () => {
      this.props.wordFilter(value)
    })
  }

  handleLikesFilterChange = (event) => {
    const value = event.target.value
    const re = /^[0-9\b]+$/; // only allow Numbers (0 - 9)
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState((state, props) => ({
        likesFilterNum: value
      }), () => {
        this.props.LikesFilter(value)
      })
    }
  }


  render() {
    // const { Result } = this.props
    let { wordFilterClick } = this.state

    return (
      <div className="filter-class">
        <h2>Filter</h2>

        <form action="#" className="filter-form">
          <p>
            <label>
              <span className="word-filter-text">Comments by the Video Creator</span>
              <input 
                className="word-filter-checkbox filled-in"
                type="checkbox" 
                checked={this.state.videoCreatorComRep}
                onChange={() => { this.handleVideoCreator() }}
              />
              {/* In order to show the checkbox, I need to have a span tag after it.
                The span tag includes a space - meaning: you can click a little to the right, and a click will still register */}
              <span>&nbsp;</span>
            </label>
          </p>

          <div className="likes-filter-input">
            <label className="likes-filter-label" htmlFor="likes-filter">Comments that have at least this many likes: </label>
            <input 
              id="likes-filter" 
              type="number" 
              className="browser-default" 
              min="0"
              value={this.state.likesFilterNum}
              onChange={this.handleLikesFilterChange}
            />
          </div>

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

           
          

        </form>


        <br></br>
        <br></br>


      </div>
    )
  }
}

export default Filter;