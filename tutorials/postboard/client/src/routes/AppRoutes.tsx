import React, { useContext } from 'react';
import Sidebar from 'components/Sidebar';
import { AuthContext } from 'context/AuthContext';
import useMenuItems from 'hooks/useMenuItems';
import Login from 'views/Login';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import ViewPost from 'pages/ViewPost';
import ExploreInput from 'components/ExploreInput';

const AppRoutes = () => {
  const authContext = useContext(AuthContext);
  const items = useMenuItems({ isLoggedIn: !!authContext.state.address });
  return (
    <div className="container grid-container">
      <Sidebar items={items} />
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
