import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import UploadPage from '../pages/UploadPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import UserPage from '../pages/UserPage.vue'
import FollowPage from '../pages/FollowPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/upload',
    name: 'Upload',
    component: UploadPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/user/:id',
    name: 'User',
    component: UserPage
  },
  {
    path: '/follow',
    name: 'Follow',
    component: FollowPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router