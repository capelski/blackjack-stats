import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { publicPath } from '../../constants';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

Modal.setAppElement(rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter basename={publicPath}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
