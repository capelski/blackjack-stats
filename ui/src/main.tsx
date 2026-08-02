import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { publicPath } from '../constants.ts';
import App from './App.tsx';
import './i18n/index';
import './index.css';

const mountApp = () => {
  const rootElement = document.getElementById('root')!;

  Modal.setAppElement(rootElement);

  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter basename={publicPath}>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
};

if (typeof window !== 'undefined') {
  mountApp();
}

export async function prerender({ url }: { url: string }) {
  const { renderToString } = await import('react-dom/server');
  const { parseLinks } = await import('vite-prerender-plugin/parse');

  const html = await renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  const links = parseLinks(html);

  return { html, links };
}
