<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col sm="6" offset="3">
          <b-jumbotron>
            <h3> Enter your account to login! </h3>
            <br>
            <b-form @submit.prevent="handleSubmit">
              <b-row>
              <b-col sm="4">
                <label label-for="input-1"> Your username: </label>
              </b-col>
              <b-col sm="8">
                <b-form-input
                  id="input-1"
                  v-model="loginData.username"
                  required
                  placeholder="Enter your account"
                ></b-form-input>
              </b-col>
              </b-row>
              <br>
              <b-row>
              <b-col sm="4">
                <label label-for="input-2"> Your password: </label>
              </b-col>
              <b-col sm="8">
                <b-form-input
                  id="input-2"
                  v-model="loginData.password"
                  required
                  placeholder="Enter your password"
                  type="password"
                ></b-form-input>
              </b-col>
              </b-row>
              <br>
              <b-button type="submit" variant="primary">Login</b-button>
            </b-form>
          </b-jumbotron>
        </b-col>
      </b-row>
      <b-button variant="link" class="button" @click="createNewAccount">create a new account</b-button>
    </b-container>
  <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

export default {
  name: 'Home',
  inject: ['test'],
  data () {
    return {
      loginData: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    handleSubmit () {
      axios.post('http://localhost:8081/core_spring/login', {
        userName: this.loginData.username,
        password: this.loginData.password
      })
        .then((response) => {
          if (response.data.length <= 28) {
            alert(response.data)
          } else {
            window.localStorage.setItem('token', response.data)
            this.$router.push('/my-todolist/app/todo_tasks')
          }
        })
        .catch(function (error) {
          alert(error)
        })
    },
    createNewAccount () {
      this.$router.push('/my-todolist.com/auth/registration')
    }
  }
}
</script>
<style scoped>
.home {
  background-color: rgb(212, 204, 192);
  height: 100% !important;
}
.loginForm {
  padding: 20px;
}
</style>
