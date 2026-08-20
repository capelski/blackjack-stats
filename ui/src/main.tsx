import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { publicPath } from '../constants.ts';
import './i18n/index';
import './index.css';
import { routes } from './routes.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root')!;

  Modal.setAppElement(rootElement);

  const router = createBrowserRouter(routes, { basename: publicPath });

  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );
};

if (typeof window !== 'undefined') {
  mountApp();
}

export async function prerender({ url }: { url: string }) {
  const { renderToString } = await import('react-dom/server');
  const { parseLinks } = await import('vite-prerender-plugin/parse');
  const { createStaticHandler, createStaticRouter, StaticRouterProvider } = await import(
    'react-router-dom'
  );

  // The static counterpart of createBrowserRouter: the routes are matched ahead of rendering
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(url, 'http://localhost')));

  if (context instanceof Response) {
    throw new Error(`Prerendering ${url} resulted in a ${context.status} response`);
  }

  const html = await renderToString(
    <StaticRouterProvider
      context={context}
      hydrate={false}
      router={createStaticRouter(handler.dataRoutes, context)}
    />,
  );
  const links = parseLinks(html);

  return { html, links };
}
