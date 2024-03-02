import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Routes
} from 'react-router-dom';

import { loadRecommendedAnime } from './components/Recommend.jsx';
import Recommend from './components/Recommend.jsx';
import { getSearchResult } from './components/SearchPage.jsx';
import SearchPage from './components/SearchPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import NotFoundPage from './components/PageNotFound.jsx';
import { loadPopularAnime, loadTopScoreAnime } from './components/PopularPage.jsx';
import PopularPage from './components/PopularPage.jsx';
import LoginPage, {login as loginAction} from './components/login/LoginPage.jsx';
import RegisterPage, {register as registerAction} from './components/login/RegisterPage.jsx';
import LogoutPage from './components/login/LogoutPage.jsx';
import ProtectedRoute, {ProtectedElement } from './components/login/ProtectedRoute.jsx';
import Dashboard, {loadUser as loadUserData} from './components/Dashboard.jsx';


import axios from 'axios';
import { store } from './components/store/LoginStateStore.jsx';
import { Provider } from 'react-redux';

import i18n from './translation/i18n';
import  {I18nextProvider} from 'react-i18next';


axios.defaults.withCredentials = true;

//Note that we have enabled csrf protection on backend, enable axios to send csrf verification token
//on each request
//For more details, see auth.py and LoginPage.jsx
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <PopularPage />,
          loader: loadPopularAnime
        },
        {
          path: 'recommend/:mal_id',
          element: <Recommend />,
          loader: loadRecommendedAnime
        },
        {
          path: 'search',
          element: <SearchPage />,
          loader: getSearchResult
        },
        {
          path: 'popular',
          element: <PopularPage />,
          loader: loadPopularAnime
        },
        {
          path: 'highest-rating',
          element: <PopularPage />,
          loader: loadTopScoreAnime
        },
        {
          path: 'register',
          element: <RegisterPage />,
          action: registerAction
        },
        {
          path: 'login',
          element: <LoginPage />,
          action: loginAction
        },
        {
          path: 'logout',
          element: <LogoutPage />
        },
        {
          path: 'dashboard',
          element: (
            <ProtectedElement > 
              <Dashboard />
            </ProtectedElement>
          ),
          action: loadUserData
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
        
      ]
    },
    
  ]
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store} >
        <RouterProvider router={router} />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>,
)
