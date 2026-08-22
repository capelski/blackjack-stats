import './i18n/index';
import './index.css';
import { routes } from './routes.tsx';

export async function prerender({ url }: { url: string }) {
  const { renderToString } = await import('react-dom/server.edge');
  const { createStaticHandler, createStaticRouter, StaticRouterProvider } =
    await import('react-router-dom');
  const { prerenderUrls } = await import('./prerender-routes.ts');

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
