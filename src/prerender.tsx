import { renderToString } from 'react-dom/server.edge';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import './i18n/index';
import './index.css';
import { prerenderUrls } from './prerender-routes.ts';
import { routes } from './routes.tsx';

export async function prerender({ url }: { url: string }) {
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

  // Returning every url of the route tree, which the plugin adds to the routes it prerenders
  return { html, links: prerenderUrls };
}
