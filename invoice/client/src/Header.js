import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
} from 'reactstrap';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    return (
    <Navbar color="faded" light>
      <NavbarBrand href="#/" className="mr-auto">Invoice PoC</NavbarBrand>
      <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
      <Collapse isOpen={!this.state.collapsed} navbar>
        <Nav navbar>
          <NavItem>
            <NavLink href="#/my-invoices">My Invoices</NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
    );
  }
}
