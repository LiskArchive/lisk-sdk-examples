import React from 'react';
import { Link } from 'react-router-dom';

type TabItem = {
  label: string;
  route: string;
};

type TabProps = { tabs: Array<TabItem> };

const Tab = ({ tabs }: TabProps) => (
  <div className="tab">
    <nav className="nav">
      {tabs.map((tab) => (
        <Link key={tab.label} className="nav-link" to={tab.route}>
          {tab.label}
        </Link>
      ))}
    </nav>
  </div>
);

export default Tab;
