export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const path = (route = '/') => base + (route.startsWith('/') ? route : '/' + route);
export const REPOSITORY = 'https://github.com/gulnoorCheema/OpenEngineering';
