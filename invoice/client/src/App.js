import React from 'react';
import SignInPage from './SignInPage';
import Header from './Header';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="App">
        <SignInPage />
      </div>
    </React.Fragment>
  );
}

export default App;
