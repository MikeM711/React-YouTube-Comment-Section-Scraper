import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

class App extends Component {
 state = {
   data: '',
   url:'',
   response: '',
   ioResponse: false, // this property will have SocketIO data
   endpoint: "/" // originally: http://127.0.0.1:5000
 }

 componentDidMount() {
   axios.get('/api/hello')
     .then(res => {
       this.setState({
         data: res.data.express
       })
     })
     .catch(err => console.log(err))

   const { endpoint } = this.state;
   const socket = socketIOClient(endpoint);
   socket.on("FromAPI", data => this.setState({ ioResponse: data }));
   }

 // Listens to every change of value in input field
 handleChange = (e) => {
   this.setState({
     url: e.target.value
   });
 }

 handleSubmit = (e) => {
   e.preventDefault();
   console.log('form submitted', this.state.url)
   //2nd param passes data, the data is attached to the 'post' param - req.body.post
   axios.post('/youtubeData',{
     url: this.state.url
   })
     .then(res => {
       console.log('hit')
       console.log(res)
       // put the res.data inside our state, so we can use it in the component
       this.setState({
         url: '',
         response: res.data
       });
     })
     .catch(err => console.log(err))
 }

 render() {
   const {ioResponse} = this.state
   console.log(ioResponse)
   console.log(this.state.data)
   const { data } = this.state
   return (
     <div className="app container">
       <div>
         <h2>Hello world</h2>
         <p>My React Application</p>
         <p>Express data: {data}</p>
       </div>
       <div>
         <form onSubmit={this.handleSubmit}>
           {/* 'value' property used to make value = '' after submit, that's it */}
           <input type="text" onChange={this.handleChange} value={this.state.url} />
           <button>Submit</button>
         </form>
       </div>
       <div>
         <p>The response to your form was: {this.state.response}</p>
         <p>My ioResponse: {ioResponse}</p>
         <p>Video: https://www.youtube.com/watch?v=IHt71N47cc0</p>
       </div>
     </div>
   )
 }
}

export default App;