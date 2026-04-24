import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route('menu', './routes/menu/index.tsx'),
  route('play', './routes/play/index.tsx'),
  route('game', './routes/game/index.tsx'),
  route('api/locales/:lng/:ns', './routes/locales.ts'),
  route('*', './routes/not-found.tsx'),
] satisfies RouteConfig;
