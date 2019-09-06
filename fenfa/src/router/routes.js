export default [
    {
        path:'/',
        redirect:'/music'
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('../views/music')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register')
    },
    {
      path: '*',
      name: '404',
      component: () => import('../views/404')
    }
]