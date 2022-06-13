import React, { useContext, FunctionComponent, SVGProps } from 'react';
import Sidebar from 'components/Sidebar';
import { AuthContext } from 'context/AuthContext';
import Login from 'views/Login';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import ViewPost from 'pages/ViewPost';
import ExploreInput from 'components/ExploreInput';
import { HomeSvg, ProfileSvg, ListSvg, BookmarkSvg, NotificationSvg, SettingsSvg } from '../assets/icons';

export type MenuItem = {
  iconComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
  route: string;
};

const menuItems: Array<MenuItem> = [
  { iconComponent: HomeSvg, label: 'Home', route: '/' },
  { iconComponent: ProfileSvg, label: 'Profile', route: '/' },
  { iconComponent: ListSvg, label: 'User list', route: '/' },
  { iconComponent: BookmarkSvg, label: 'Bookmarks', route: '/' },
  { iconComponent: NotificationSvg, label: 'Notifications', route: '/' },
  { iconComponent: SettingsSvg, label: 'Settings', route: '/' },
];

const AppRoutes = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = !!authContext.state.address;
  return (
    <div className="container grid-container">
      <Sidebar items={isLoggedIn ? [menuItems[0]] : menuItems} />
      <div className="app">
        <ExploreInput />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<ViewPost />} />
        </Routes>
      </div>
      <div className="right-content">
        <Login />
      </div>
    </div>
  );
};

export default AppRoutes;
