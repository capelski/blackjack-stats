export const getLocalizedRoute = (language: string, route: string) => {
  return `/${language}/${route}`;
};

export const splitPathname = (pathname: string) => {
  const [language, ...route] = pathname.split('/').filter(Boolean);
  return { language, route: route.join('/') };
};

export const translateLocalizedRoute = (pathname: string, language: string) => {
  const { route } = splitPathname(pathname);
  return `/${language}/${route}`;
};
