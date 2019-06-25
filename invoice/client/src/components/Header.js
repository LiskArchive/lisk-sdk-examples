import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { useStateValue } from '../state';
import { name } from '../config.json';
import logo from '../assets/logo.svg';

export default function Header() {
  const [{ account }] = useStateValue();
  const [{ collapsed }, setState] = React.useState({
    collapsed: true,
  });

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
      { account ?
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink tag={RRNavLink} to="/invoices">My Invoices</NavLink>
            </NavItem>
          </Nav>
        </Collapse> :
        null
      }
    </Navbar>
  );
}
