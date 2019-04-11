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

  handleDateFilter = (event) => {
    // Get option text
    const value = event.target.options[event.target.selectedIndex].text
    if(value === "Last Hour"){
      const date = ['second', 'minute']
      this.props.dateFilter(date)
    }

    if(value === "Today"){
      const date = ['second', 'minute', 'hour']
      this.props.dateFilter(date)
    }

    if(value === "This Week"){
      const date = ['second', 'minute', 'hour', 'day']
      this.props.dateFilter(date)
    }

    if(value ==="This Month"){
      const date = ['second', 'minute', 'hour', 'day','week']
      this.props.dateFilter(date)
    }

    if(value ==="This Month"){
      const date = ['second', 'minute', 'hour', 'day','week']
      this.props.dateFilter(date)
    }

    if(value ==="This Year"){
      const date = ['second', 'minute', 'hour', 'day', 'week', 'month']
      this.props.dateFilter(date)
    }

    if(value === "Comments Made: Lifetime"){
      const date = ''
      this.props.dateFilter(date)
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
            <label className="likes-filter-label" htmlFor="likes-filter">Have at least this many likes: </label>
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
              <label className={"word-filter-label " + wordFilterClick}  htmlFor="word-filter">Contains the following phrase</label>
            </div>

            <div className="input-field-date col s12">
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
          </div>

           
          

        </form>


        <br></br>
        <br></br>


      </div>
    )
  }
}

export default Filter;