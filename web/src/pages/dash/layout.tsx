import { Outlet } from 'react-router-dom';

export default function DashLayout() {
  return (
    <main>
      <h1>Dash Layout</h1>
      <Outlet />
    </main>
  );
}
