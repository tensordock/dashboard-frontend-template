import { LazyMotion, domAnimation } from 'framer-motion';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import { RouterProvider } from 'react-router-dom';
import Loader from './components/loader';
import router from './pages/router';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <LazyMotion features={domAnimation}>
        <RouterProvider router={router} />
      </LazyMotion>
    </Suspense>
    <Toaster position="bottom-right" />
  </React.StrictMode>
);
