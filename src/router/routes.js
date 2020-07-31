
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  { path: '/popup', component: () => import('pages/Popup.vue') },
  { path: '/charts', component: () => import('pages/Charts.vue') },
  { path: '/test', component: () => import('pages/Test.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
