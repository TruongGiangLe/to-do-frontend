import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Todo from '../views/Todo.vue'
import NewAccount from '../views/NewAccount.vue'
import EditAccount from '../views/EditAccount.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: '/my-todolist.com/auth/login',
    name: 'Home',
    component: Home
  },
  {
    path: '/my-todolist.com/auth/registration',
    name: 'NewAccount',
    component: NewAccount
  },
  {
    path: '/my-todolist/app/todo_tasks',
    name: 'Todo',
    component: Todo
  },
  {
    path: '/my-todolist/app/edit_account',
    name: 'EditAccount',
    component: EditAccount
  }

]

const router = new VueRouter({
  routes
})

export default router
