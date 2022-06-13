import { MenuItem } from 'hooks/types';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logo from 'assets/images/logo.png';
import { useNavigate } from 'react-router';

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
              <a href="#">
                <item.iconComponent className="icon" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
