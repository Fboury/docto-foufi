import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from './components/Layout/AppLayout';
import { AddInjection } from './pages/AddInjection/AddInjection';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { History } from './pages/History/History';
import { Stats } from './pages/Stats/Stats';
import { Profile } from './pages/Profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Ton menu et ton fond sombre
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: '/ajout-injection',
        element: <AddInjection />
      },
      {
        path: '/history',
        element: <History />
      },
      {
        path: '/stats',
        element: <Stats />
      },
      {
        path: '/profil',
        element: <Profile />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
