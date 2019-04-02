import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {
  state = {
    data: ''
  }
  componentDidMount() {
    axios.get('/api/hello')
      .then(res => {
        this.setState({
          data: res.data.express
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { data } = this.state
    return (
      <div className="app">
        <div>
        <h2>Hello world</h2>
        <p>My React Application</p>
        <p>Express data: {data}</p>
        </div>
      </div>
    )
  }
}



export default App;