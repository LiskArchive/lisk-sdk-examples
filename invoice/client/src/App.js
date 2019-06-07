import React from 'react';
import SignInPage from './SignInPage';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="App">
        <Grid fluid>
          <Row  center="xs">
            <Col xs={12} md={8} lg={6}>
              <SignInPage />
            </Col>
          </Row>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default App;
