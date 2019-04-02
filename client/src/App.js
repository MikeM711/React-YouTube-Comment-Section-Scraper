import React, { Component } from 'react';
import axios from 'axios'

class App extends Component {
  state = {
    data: '',
    post:'',
    response: '',
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

  // Listens to every change of value in input field
  handleChange = (e) => {
    this.setState({
      post: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('form submitted', this.state.post)
    //2nd param passes data, the data is attached to the 'post' param - req.body.post
    axios.post('/api/world',{
      post: this.state.post
    })
      .then(res => {
        console.log(res)
        // put the res.data inside our state, so we can use it in the component
        this.setState({
          post: '',
          response: res.data
        });
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
        <div>
          <form onSubmit={this.handleSubmit}>
            {/* 'value' property used to make value = '' after submit, that's it */}
            <input type="text" onChange={this.handleChange} value={this.state.post} />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <p>The response to your form was: {this.state.response}</p>
        </div>
      </div>
    )
  }
}



export default App;