import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import React from 'react';

import { formatAmount } from '../utils/formatters';
import { name } from '../config.json';
import { useStateValue } from '../state';
import logo from '../assets/logo.svg';

export default function Header() {
  const [{ account }, dispatch] = useStateValue();
  const [{ collapsed }, setState] = React.useState({
    collapsed: true,
  });

  const logout = () => {
    dispatch({ type: 'accountSignedOut' });
  };

  const toggleNavbar = () => {
    setState({
      collapsed: !collapsed,
    });
  };

  return (
    <Navbar color="faded" light expand="md">
      <NavbarBrand tag={RRNavLink} to="/" className="mr-auto">
        <img src={logo} alt={name} style={{ width: 140 }} />
      </NavbarBrand>
      <NavbarToggler onClick={toggleNavbar} className="mr-2" />
      { account
        ? (
          <React.Fragment>
            <Collapse isOpen={!collapsed} navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink tag={RRNavLink} to="/invoices">My Invoices</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
            <span>
              {' '}
Address:
              <strong>
                {account.address}
                {' '}
              </strong>
&nbsp;
              {' '}
            </span>
            <span>
              {' '}
Balance:
              <strong>{formatAmount(account.balance)}</strong>
            </span>
            <NavLink tag={RRNavLink} to="/" onClick={logout}>Logout</NavLink>
          </React.Fragment>
        )
        : null
      }
    </Navbar>
  );
}
