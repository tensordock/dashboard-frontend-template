import { LazyMotion, domAnimation } from 'framer-motion';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { RouterProvider } from 'react-router-dom';
import PageLoader from './components/page-loader';
import router from './pages/router';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLoader>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router} />
      </LazyMotion>
    </PageLoader>
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
