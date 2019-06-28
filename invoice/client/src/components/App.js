import { Grid, Row, Col } from 'react-flexbox-grid';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';

import { StateProvider } from '../state';
import Header from './Header';
import InvoicesPage from './InvoicesPage';
import PayInvoicePage from './PayInvoicePage';
import PrivateRoute from './PrivateRoute';
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
              <Col xs={12} lg={10}>
                <Route path="/" exact component={SignInPage} />
                <PrivateRoute path="/invoices" component={InvoicesPage} />
                <PrivateRoute path="/send-invoice" component={SendInvoicePage} />
                <PrivateRoute path="/pay-invoice" component={PayInvoicePage} />
              </Col>
            </Row>
          </Grid>
        </div>
      </StateProvider>
    </Router>
  );
}

export default App;
