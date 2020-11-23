<template>
    <div class="home">
      <Header/>
      <b-container>
        <b-row>
          <b-col sm="6" offset="3">
            Hi, {{ user.userName }}!
            <br>
            <b-jumbotron>
              <b-form>
                <b-form-group id="input-group">
                  <b-row>
                    <b-col sm="12">
                      <b-form-input
                        id="input-large"
                        size="lg"
                        v-model="task.taskContent"
                        placeholder="to do task..."
                        @keyup.enter="addTodo"
                      ></b-form-input>
                    </b-col>
                  </b-row>
                </b-form-group>
              </b-form>

              <!-- <Display v-if="task.content" v-bind:task="task"/> -->
              <!-- i got angery 'cause this line, fudge! -->
              <Display v-for="t in tasks" :key="t.id" v-bind:task="t"
              v-on:completetask="completeTask" v-on:deletetask="deleteTask"
              v-on:edittask="editTask" v-on:updatetask="updateTask"/>
              <br>
              <br>
            <b-button variant="link" class="but" @click="getAllTasks">All Tasks ({{ this.allTasks.length }})</b-button>
            <b-button variant="link" class="but" @click="getTodoTasks">To do ({{ this.todoTasks.length }})</b-button>
            <b-button variant="link" class="but" @click="getFinishedTasks">Finished ({{ this.finishedTasks.length }})</b-button>
            </b-jumbotron>
          </b-col>
        </b-row>
        <b-button variant="link" @click="logOut">log out</b-button>
        <b-button variant="link" @click="yourAccount">your account</b-button>
      </b-container>
      <Footer/>
    </div>
</template>
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Display from '@/components/Display.vue'
import axios from 'axios'

export default {
  data () {
    return {
      inTodoList: false,
      inFinishedList: false,
      user: {
        id: '',
        userName: '',
        password: ''
      },
      task: {
        id: 0,
        taskContent: '',
        status: 'to do',
        beingEdited: false,
        user_id: null
      },
      tasks: [
      ],
      allTasks: [
      ],
      todoTasks: [
      ],
      finishedTasks: [
      ]
    }
  },
  components: {
    Header,
    Footer,
    Display
  },
  methods: {
    addTodo () {
      if (this.task.taskContent !== '' && this.task.taskContent !== null) {
        axios.post('http://localhost:8081/core_spring/task/add_new_task', {
          taskContent: this.task.taskContent
        },
        {
          headers: {
            Authorization: window.localStorage.getItem('token')
          }
        })
          .then((response) => {
            // đặt các thao tác ở trong này, nếu đặt ngoài thì state của this nó sẽ khác
            this.task = response.data
            console.log(this.task)
            this.allTasks = [
              { ...this.task },
              ...this.allTasks
            ]
            this.todoTasks = [{ ...this.task }, ...this.todoTasks]
            if (this.inTodoList) {
              this.tasks = [...this.todoTasks]
            } else if (this.inFinishedList) {
              this.tasks = [...this.finishedTasks]
            } else {
              this.tasks = [...this.allTasks]
            }
            this.task.taskContent = ''
          })
          .catch(function (error) {
            alert(error)
          })

        // const { id, taskContent, status, beingEdited } = this.task
        // const newTask = { id, taskContent, status, beingEdited }
        // cái này là syntax :), để clone 1 object
        // console.log(newTask)
        // const objClone = { ...this.task }
        // console.log(objClone)
      }
    },
    completeTask (id, taskContent) {
      axios.put('http://localhost:8081/core_spring/task/update_task', {
        id: id,
        status: 'finished',
        taskContent: taskContent
      },
      {
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
        .then((response) => {
          console.log(response.data)
          if (response.data === 'updated successfully!') {
            let i = 0
            for (i = 0; i < this.tasks.length; i++) {
              if (this.tasks[i].id === id) {
                this.tasks[i].status = 'finished'
                this.finishedTasks = [this.tasks[i], ...this.finishedTasks]
                break
              }
            }
            for (i = 0; i < this.allTasks.length; i++) {
              if (this.allTasks[i].id === id) {
                this.allTasks[i].status = 'finished'
                break
              }
            }
            let index = 0
            for (i = 0; i < this.todoTasks.length; i++) {
              if (this.todoTasks[i].id === id) {
                index = i
                break
              }
            }
            this.todoTasks.splice(index, 1)
            if (this.inTodoList) {
              this.tasks = [...this.todoTasks]
            }
          } else {
            alert('something wrong! :<')
          }
        })
        .catch(function (error) {
          alert(error)
        })
    },
    deleteTask (id) {
      axios.delete('http://localhost:8081/core_spring/task/delete_task/' + id,
        {
          headers: {
            Authorization: window.localStorage.getItem('token')
          }
        })
        .then((response) => {
          console.log(response.data)
          if (response.data === 'deleted successfully!') {
            let index = 0
            let i = 0
            let flag = false
            for (i = 0; i < this.tasks.length; i++) {
              if (this.tasks[i].id === id) {
                index = i
                if (this.tasks[i].status === 'to do') {
                  flag = true
                }
                break
              }
            }
            this.tasks.splice(index, 1)
            for (i = 0; i < this.allTasks.length; i++) {
              if (this.allTasks[i].id === id) {
                index = i
                break
              }
            }
            this.allTasks.splice(index, 1)
            if (flag) {
              for (i = 0; i < this.todoTasks.length; i++) {
                if (this.todoTasks[i].id === id) {
                  index = i
                  break
                }
              }
              this.todoTasks.splice(index, 1)
            } else {
              for (i = 0; i < this.finishedTasks.length; i++) {
                if (this.finishedTasks[i].id === id) {
                  index = i
                  break
                }
              }
              this.finishedTasks.splice(index, 1)
            }
          } else {
            alert('something wrong :<')
          }
        })
        .catch(function (error) {
          alert(error)
        })
    },
    editTask (id) {
      let i = 0
      for (i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === id) {
          this.tasks[i].beingEdited = true
          break
        }
      }
    },
    updateTask (id, status, newContent) {
      axios.put('http://localhost:8081/core_spring/task/update_task', {
        id: id,
        status: status,
        taskContent: newContent
      },
      {
        headers: {
          Authorization: window.localStorage.getItem('token')
        }
      })
        .then((response) => {
          console.log(response.data)
          if (response.data === 'updated successfully!') {
            let i = 0
            for (i = 0; i < this.tasks.length; i++) {
              if (this.tasks[i].id === id) {
                this.tasks[i].taskContent = newContent
                this.tasks[i].beingEdited = false
                break
              }
            }
            for (i = 0; i < this.todoTasks.length; i++) {
              if (this.todoTasks[i].id === id) {
                this.todoTasks[i].taskContent = newContent
                this.todoTasks[i].beingEdited = false
                break
              }
            }
            for (i = 0; i < this.allTasks.length; i++) {
              if (this.allTasks[i].id === id) {
                this.allTasks[i].taskContent = newContent
                this.allTasks[i].beingEdited = false
                break
              }
            }
          } else {
            alert('something wrong :<')
          }
        })
        .catch(function (error) {
          alert(error)
        })
    },
    getAllTasks () {
      this.allTasks.forEach(t => {
        t.beingEdited = false
      })
      this.tasks = [...this.allTasks]
      this.inTodoList = false
      this.inFinishedList = false
    },
    getTodoTasks () {
      this.todoTasks.forEach(t => {
        t.beingEdited = false
      })
      this.tasks = [...this.todoTasks]
      this.inTodoList = true
      this.inFinishedList = false
    },
    getFinishedTasks () {
      this.tasks = [...this.finishedTasks]
      this.inTodoList = false
      this.inFinishedList = true
    },
    logOut () {
      localStorage.removeItem('token')
      this.$router.push('/my-todolist.com/auth/login')
    },
    yourAccount () {
      this.$router.push('/my-todolist/app/edit_account')
    }
  },
  mounted () {
    axios.get('http://localhost:8081/core_spring/auth/get_user_profile', {
      headers: {
        Authorization: window.localStorage.getItem('token')
      }
    })
      .then((response) => {
        console.log(response.data)
        this.user = response.data
      })
      .catch((error) => {
        console.log(error)
        this.$router.push('/my-todolist.com/auth/login')
      })

    axios.get('http://localhost:8081/core_spring/auth/get_all_task', {
      headers: {
        Authorization: window.localStorage.getItem('token')
      }
    })
      .then((response) => {
        console.log(response)
        this.allTasks = response.data
        this.tasks = [...this.allTasks]
        this.allTasks.forEach(t => {
          if (t.status === 'to do') {
            this.todoTasks = [t, ...this.todoTasks]
          } else {
            this.finishedTasks = [t, ...this.finishedTasks]
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
.home {
  background-color: rgb(212, 204, 192);
}
.but {
  margin: 10px;
}
</style>
