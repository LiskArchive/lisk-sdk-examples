import React from 'react';
import { Routes, Route, useParams } from 'react-router';
import Tab from 'components/Tab';
import ViewProfile from 'pages/ViewProfile';
import ViewFollowers from 'pages/ViewFollowers';
import ViewFollowing from 'pages/ViewFollowing';

const AccountRoutes = () => {
  const address = useParams().id;
  return (
    <div className="account">
      <h3 className="bold">
        Account <small className="small">{address}</small>
      </h3>
      <Tab
        tabs={[
          { label: 'Posts', route: `/profile/${address}` },
          { label: 'Followers', route: `/profile/${address}/followers` },
          { label: 'Following', route: `/profile/${address}/following` },
        ]}
      />
      <Routes>
        <Route path="/" element={<ViewProfile />} />
        <Route path="/followers" element={<ViewFollowers />} />
        <Route path="/following" element={<ViewFollowing />} />
      </Routes>
    </div>
  );
};

export default AccountRoutes;
