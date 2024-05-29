import { createBrowserRouter } from 'react-router-dom';
// import HomePage from './home';
import HomePageV2 from './homev2';

const router = createBrowserRouter([
  // { path: '/', element: <HomePage /> },
  { path: '/', element: <HomePageV2 /> },
]);

export default router;
