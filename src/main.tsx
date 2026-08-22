import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { publicPath } from '../constants.ts';
import './i18n/index';
import './index.css';
import { routes } from './routes.tsx';

const rootElement = document.getElementById('root')!;

Modal.setAppElement(rootElement);

const router = createBrowserRouter(routes, { basename: publicPath });

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
