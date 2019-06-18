import { Grid, Row, Col } from 'react-flexbox-grid';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';

import { StateProvider } from '../state';
import Header from './Header';
import InvoicesPage from './InvoicesPage';
import PayInvoicePage from './PayInvoicePage';
import SendInvoicePage from './SendInvoicePage';
import SignInPage from './SignInPage';

import './App.css';

function App() {
  return (
    <Router>
      <StateProvider>
        <Header />
        <div className="App">
          <Grid fluid>
            <Row center="xs">
              <Col xs={12} md={10} lg={8}>
                <Route path="/" exact component={SignInPage} />
                <Route path="/invoices" component={InvoicesPage} />
                <Route path="/send-invoice" component={SendInvoicePage} />
                <Route path="/pay-invoice" component={PayInvoicePage} />
              </Col>
            </Row>
          </Grid>
        </div>
      </StateProvider>
    </Router>
  );
}

export default App;
