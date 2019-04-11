import React, { Component } from 'react';

class Form extends Component {
 state = {
   url:'',
   ioThumbnail: '',
  //  ioTitle: '',
  //  ioResResult: false, // Result Response
  //  ioResProgressScroll: false, // Scroll Progress
  //  ioResComExpand: false, // "Comments Expaned" Response Progress
  //  ioResShowMoreRep: false, // "Show More Replies" Response Progress
  //  ioResFindRep: false, // "Find Replies" Progress
  //  ioErrMsg: false, // Puppeteer errors
  //  endpoint: "/" // originally: http://127.0.0.1:5000
 }

 // Listens to every change of value in input field
 handleChange = (e) => {
   this.setState({
     url: e.target.value
   });
 }

 handleSubmit = (event) => {
   event.preventDefault();
   console.log('form submitted', this.state.url)
   this.props.UrlSubmit(this.state.url)
   this.setState({
     url: ''
   })
 }

 render() {

  const {ioErrMsg} = this.props

   return (
     <div className="form">
       <div className="url-form" >
         <form onSubmit={this.handleSubmit}>
           {/* 'value' property used to make value = '' after submit, that's it */}
           <input type="text" onChange={this.handleChange} value={this.state.url} />
           <button className="waves-effect waves-light btn">Submit</button>
           <p className="errorMsg">{ioErrMsg}</p>
         </form>
       </div>
        <p>Video: https://www.youtube.com/watch?v=IHt71N47cc0</p>
        <p>https://www.youtube.com/watch?v=U1_ZvIVQHuI</p>
     </div>
   )
  }
}

export default Form;