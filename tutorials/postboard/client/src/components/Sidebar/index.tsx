import { MenuItem } from 'hooks/types';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from 'assets/images/logo.png';
import { useNavigate } from 'react-router';
import Login from 'views/Login';

type SidebarProps = {
  items: Array<MenuItem>;
};

const Sidebar = ({ items }: SidebarProps) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar-container">
      <div className="overlay"></div>
      <div className="sidebar">
        <img src={Logo} alt="Postcard app logo" />
        <ul className="menu-items">
          {items.map((item) => (
            <li className="menu-item" key={item.label} onClick={() => navigate(item.route)}>
              <button>
                <item.iconComponent className="icon" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
          <Login />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
