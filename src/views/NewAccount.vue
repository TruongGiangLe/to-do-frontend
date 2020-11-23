<template>
  <div class="home">
    <Header/>
    <b-container>
      <b-row>
        <b-col sm="6" offset="3">
          <b-jumbotron>
            <h3> create your account </h3>
            <br>
            <b-form @submit.prevent="handleSubmit">
              <b-row>
              <b-col sm="4">
                <label label-for="input-1"> Your username: </label>
              </b-col>
              <b-col sm="8">
                <b-form-input
                  id="input-1"
                  v-model="newAccount.userName"
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
                  v-model="newAccount.password"
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
              <b-button type="submit" variant="primary">Create</b-button>
            </b-form>
            <i :hidden="!warnning" :style="{ color: 'red' }"> your password does not match!</i>
          </b-jumbotron>
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
      newAccount: {
        userName: '',
        password: ''
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
      if (this.newAccount.password !== this.confirmPassword) {
        this.warnning = true
      } else {
        this.warnning = false
      }
      if (!this.warnning) {
        axios.post('http://localhost:8081/core_spring/create_user', {
          userName: this.newAccount.userName,
          password: this.newAccount.password
        })
          .then((response) => {
            alert(response.data)
            if (response.data === 'created successfully!') {
              this.$router.push('/auth/login')
            } else {
              alert('something wrong! :<')
            }
          })
          .catch(function (error) {
            alert(error)
          })
      }
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
