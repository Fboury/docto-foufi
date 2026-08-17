import { createBrowserRouter, RouterProvider } from 'react-router';
import { AppLayout } from './components/Layout/AppLayout';
import { AddInjection } from './pages/AddInjection/AddInjection';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Ton menu et ton fond sombre
    children: [
      {
        path: '',
        element: (
          <AddInjection
            onSubmit={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        )
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
