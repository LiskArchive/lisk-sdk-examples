import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'theme';

import Loading from 'components/Loading';
import AppRoutes from 'routes/AppRoutes';
import { AuthContext } from 'context/AuthContext';
import { PostContext } from 'context/PostContext';
import useAuthController from 'context/AuthController';
import usePostController from 'context/PostController';

const App = () => {
  const auth = useAuthController();
  const post = usePostController();
  return (
    <AuthContext.Provider value={{ state: auth.state, dispatch: auth.dispatch }}>
      <PostContext.Provider value={{ state: post.state, dispatch: post.dispatch }}>
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Suspense>
      </PostContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
