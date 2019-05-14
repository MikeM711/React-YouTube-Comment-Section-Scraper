import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import VideoSubmission from './components/VideoSubmission/VideoSubmission';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path='/' component={VideoSubmission} />
        </div>
      </BrowserRouter>
    );
  };
};

export default App;