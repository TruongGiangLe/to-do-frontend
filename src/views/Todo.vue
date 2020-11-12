<template>
    <div class="home">
      <Header/>
      <b-container>
        <b-row>
          <b-col sm="6" offset="3">
            <b-jumbotron>
              <b-form>
                <b-form-group id="input-group">
                  <b-row>
                    <b-col sm="12">
                      <b-form-textarea
                        id="textarea-large"
                        size="lg"
                        v-model="task.content"
                        placeholder="to do task..."
                        @keyup.enter="addTodo"
                      ></b-form-textarea>
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
      </b-container>
      <Footer/>
    </div>
</template>
<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Display from '@/components/Display.vue'

export default {
  data () {
    return {
      inTodoList: false,
      inFinishedList: false,
      task: {
        id: 0,
        content: '',
        status: 'to do',
        beingEdited: false
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
      const { id, content, status, beingEdited } = this.task
      this.task.id++
      const newTask = { id, content, status, beingEdited }
      // cái này là syntax :), để clone 1 object
      this.allTasks = [
        newTask,
        ...this.allTasks
      ]
      this.todoTasks = [newTask, ...this.todoTasks]
      if (this.inTodoList) {
        this.tasks = [...this.todoTasks]
      } else if (this.inFinishedList) {
        this.tasks = [...this.finishedTasks]
      } else {
        this.tasks = [...this.allTasks]
      }
      this.task.content = ''
    },
    completeTask (id) {
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
    },
    deleteTask (id) {
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
    updateTask (id, newContent) {
      let i = 0
      for (i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === id) {
          this.tasks[i].content = newContent
          this.tasks[i].beingEdited = false
          break
        }
      }
      for (i = 0; i < this.todoTasks.length; i++) {
        if (this.todoTasks[i].id === id) {
          this.todoTasks[i].content = newContent
          this.todoTasks[i].beingEdited = false
          break
        }
      }
      for (i = 0; i < this.allTasks.length; i++) {
        if (this.allTasks[i].id === id) {
          this.allTasks[i].content = newContent
          this.allTasks[i].beingEdited = false
          break
        }
      }
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
    }
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
