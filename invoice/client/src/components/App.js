import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignInPage from './SignInPage';
import InvoicesPage from './InvoicesPage';
import SendInvoicePage from './SendInvoicePage';
import Header from './Header';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Grid fluid>
          <Row center="xs">
            <Col xs={12} md={10} lg={8}>
              <Route path="/" exact component={SignInPage} />
              <Route path="/invoices" component={InvoicesPage} />
              <Route path="/send-invoice" component={SendInvoicePage} />
            </Col>
          </Row>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
