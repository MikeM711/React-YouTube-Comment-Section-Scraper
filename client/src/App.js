import React, { Component } from 'react';
import VideoSubmission from './components/VideoSubmission';
import { Route, BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path='/' component={VideoSubmission}/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;