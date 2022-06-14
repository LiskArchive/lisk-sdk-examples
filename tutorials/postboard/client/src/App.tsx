import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'theme';

import AppRoutes from 'routes/AppRoutes';
import { AuthContext } from 'context/AuthContext';
import { PostContext } from 'context/PostContext';
import useAuthController from 'context/AuthController';
import usePostController from 'context/PostController';
import useAlertController from 'context/AlertController';
import { AlertContext } from 'context/AlertContext';

const App = () => {
  const auth = useAuthController();
  const post = usePostController();
  const alert = useAlertController();
  return (
    <AuthContext.Provider value={{ state: auth.state, dispatch: auth.dispatch }}>
      <PostContext.Provider value={{ state: post.state, dispatch: post.dispatch }}>
        <AlertContext.Provider value={{ state: alert.state, dispatch: alert.dispatch }}>
          <Suspense>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </Suspense>
        </AlertContext.Provider>
      </PostContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
