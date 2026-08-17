import { createBrowserRouter, RouterProvider } from 'react-router';
import AddInjection from './pages/AddInjection/AddInjection';
import { AuthProvider } from './context/AuthContext';
import { GoalsProvider } from './context/GoalsContext';
import { AppLayout } from './components/Layout/AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Ton menu et ton fond sombre
    children: [
      {
        path: '',
        element: <AddInjection />
      }
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <RouterProvider router={router} />
      </GoalsProvider>
    </AuthProvider>
  );
}
