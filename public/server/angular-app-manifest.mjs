
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/auth"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/plans"
  },
  {
    "renderMode": 2,
    "route": "/profile"
  },
  {
    "renderMode": 2,
    "route": "/settings"
  },
  {
    "renderMode": 2,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1854, hash: 'a2fa855a4b824dec7413f5f0d1c033176b5ab0dd11da87c5378d528a93bae977', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1028, hash: '46ae4afdb02cd14fc569e377cb04cd92c457d0aef331a7f5955fdf5daa62aadb', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'plans/index.html': {size: 237, hash: 'aaaf1e9c33387caae270f427ed4e16fa371c84718fab174b7ab8a5a68f7bab58', text: () => import('./assets-chunks/plans_index_html.mjs').then(m => m.default)},
    'profile/index.html': {size: 237, hash: 'aaaf1e9c33387caae270f427ed4e16fa371c84718fab174b7ab8a5a68f7bab58', text: () => import('./assets-chunks/profile_index_html.mjs').then(m => m.default)},
    'auth/index.html': {size: 6569, hash: '54e9cef6f3dd8bbe64f570cd2d5de450ddff9845d5c3459b865e2a860df85b2e', text: () => import('./assets-chunks/auth_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 237, hash: 'aaaf1e9c33387caae270f427ed4e16fa371c84718fab174b7ab8a5a68f7bab58', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'settings/index.html': {size: 237, hash: 'aaaf1e9c33387caae270f427ed4e16fa371c84718fab174b7ab8a5a68f7bab58', text: () => import('./assets-chunks/settings_index_html.mjs').then(m => m.default)},
    'styles-ZITZNPAJ.css': {size: 2539, hash: 'IBVM/vR4h64', text: () => import('./assets-chunks/styles-ZITZNPAJ_css.mjs').then(m => m.default)}
  },
};
