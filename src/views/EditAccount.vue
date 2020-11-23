<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col sm="6" offset="3">
          <b-jumbotron>
            <h3> Your account </h3>
            <br>
            <b-form @submit.prevent="handleSubmit">
              <b-row>
              <b-col sm="4">
                <label label-for="input-1"> Your username: </label>
              </b-col>
              <b-col sm="8">
                <b-form-input
                  id="input-1"
                  v-model="curAccount.userName"
                  required
                  disabled
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
                  v-model="curAccount.password"
                  required
                  placeholder="Enter your password"
                  type="password"
                ></b-form-input>
              </b-col>
              </b-row>
              <br>
              <b-row>
              <b-col sm="4">
                <label label-for="input-3"> Confirm your password: </label>
              </b-col>
              <b-col sm="8">
                <b-form-input
                  id="input-3"
                  v-model="confirmPassword"
                  required
                  placeholder="Enter your password"
                  type="password"
                ></b-form-input>
              </b-col>
              </b-row>
              <br>
              <b-button type="submit" variant="primary">Update</b-button>
            </b-form>
            <i :hidden="!warnning" :style="{ color: 'red' }"> your password does not match!</i>
          </b-jumbotron>
          <b-button variant="link" @click="todoTask"> <i> back to your to do tasks </i> </b-button>
        </b-col>
      </b-row>
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
  name: 'NewAccount',
  data () {
    return {
      curAccount: {
        userName: '',
        password: '',
        id: ''
      },
      confirmPassword: '',
      warnning: false,
      output: ''
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    handleSubmit () {
      if (this.curAccount.password !== this.confirmPassword) {
        this.warnning = true
      } else {
        this.warnning = false
      }
      if (!this.warnning) {
        axios.put('http://localhost:8081/core_spring/auth/update_user', {
          userName: this.curAccount.userName,
          password: this.curAccount.password,
          id: this.curAccount.id
        },
        {
          headers: {
            Authorization: window.localStorage.getItem('token')
          }
        })
          .then((response) => {
            if (response.data === 'updated successfully') {
              alert(response.data + ', please login again')
              localStorage.removeItem('token')
              this.$router.push('/my-todolist.com/auth/login')
            } else {
              alert('something wrong! :<')
            }
          })
          .catch(function (error) {
            alert(error)
          })
      }
    },
    todoTask () {
      this.$router.push('/my-todolist/app/todo_tasks')
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
        this.curAccount = response.data
      })
      .catch((error) => {
        alert(error)
        this.$router.push('/my-todolist.com/auth/login')
      })
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
