<template>
  <div>
    <b-form>
        <b-card>
            <b-card-text>
              <h4 :class="{'title': check()}" @dblclick="editTask" :hidden="task.beingEdited"> {{ task.content }} </h4>
              <b-input :hidden="!task.beingEdited" :value="task.content" @keyup.enter="updateTask" v-model="newContent"></b-input>
            </b-card-text>
            <b-button variant="outline-success" class="button" @click="completeTask" :disabled="task.status === 'finished' || task.beingEdited">Completed</b-button>
            <b-button variant="outline-danger" class="button" @click="deleteTask" :disabled="task.beingEdited">Delete</b-button>
        </b-card>
    </b-form>
  </div>
</template>

<script>
export default {
  props: ['task'],
  data () {
    return {
      newContent: ''
    }
  },
  methods: {
    completeTask () {
      this.$emit('completetask', this.task.id)
    },
    deleteTask () {
      this.$emit('deletetask', this.task.id)
    },
    editTask () {
      if (this.task.status === 'to do') {
        this.newContent = this.task.content
        this.$emit('edittask', this.task.id)
      }
    },
    updateTask () {
      this.$emit('updatetask', this.task.id, this.newContent)
    },
    check () {
      return this.task.status === 'finished'
    }
  }
}
</script>

<style scoped>
.button {
  margin: 5px;
}
.title {
  text-decoration-line: line-through;
}
</style>
