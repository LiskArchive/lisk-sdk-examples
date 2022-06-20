import React, { useContext, FunctionComponent, SVGProps } from 'react';
import Sidebar from 'components/Sidebar';
import { AuthContext } from 'context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import ViewPost from 'pages/ViewPost';
import { HomeSvg, ProfileSvg, ListSvg, NotificationSvg, SettingsSvg } from '../assets/icons';
import AccountRoutes from './AccountRoutes';
import Alert from 'components/Alert';
import { AlertContext } from 'context/AlertContext';

export type MenuItem = {
  iconComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
  route: string;
};

const AppRoutes = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const isLoggedIn = !!authContext.state.address;

  const menuItems: Array<MenuItem> = [
    { iconComponent: HomeSvg, label: 'Home', route: '/' },
    { iconComponent: ProfileSvg, label: 'Profile', route: `/profile/${authContext.state.address}` },
    { iconComponent: ListSvg, label: 'User list', route: '/' },
    { iconComponent: NotificationSvg, label: 'Notifications', route: '/' },
    { iconComponent: SettingsSvg, label: 'Settings', route: '/' },
  ];

  return (
    <div className="container grid-container">
      <Sidebar items={isLoggedIn ? menuItems : [menuItems[0]]} />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/profile/:id/*" element={<AccountRoutes />} />
        </Routes>
        {alertContext.state.message && <Alert message={alertContext.state.message} type={alertContext.state.type} />}
      </div>
    </div>
  );
};

export default AppRoutes;
