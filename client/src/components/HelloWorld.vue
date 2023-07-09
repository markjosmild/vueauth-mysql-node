<script setup>
import { ref } from 'vue'
import axios from 'axios'

defineProps({
  msg: String,
})

const errMessage = ref('')

const inputs = ref({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const login = ref({
  username: '',
  password: ''
})

const isLogin = ref(false)

const handleRegister = async () => {
  await axios.post('http://localhost:8000/api/users/register', inputs.value).then((res) => {
    alert(res.data)
    inputs.value.username = '';
    inputs.value.email = '';
    inputs.value.password = '';
    inputs.value.firstName = '';
    inputs.value.lastName = '';
    isLogin.value = !isLogin.value;
  }).catch((error) => {
    errMessage.value = error.response.data
  })
}

const handleLogin = async () => {
  await axios.post('http://localhost:8000/api/users/login', login.value).then((res) => {
    alert(res.data)
    localStorage.setItem('username', login.value.username)
    login.value.username = '';
    login.value.password = '';
    window.location.href = 'http://localhost:5173/#/';
  }).catch((err) => errMessage.value = err.response.data)
}

const handleForm = () => {
  isLogin.value = !isLogin.value;
  errMessage.value = '';
}

</script>

<template>
  <h1>{{ msg }}</h1>
  <form v-if="!isLogin">
    <h2>Registration</h2>
    <input type="text" placeholder="username" v-model="inputs.username" />
    <input type="email" placeholder="email" v-model="inputs.email" />
    <input type="password" placeholder="password" v-model="inputs.password" />
    <input type="text" placeholder="first name" v-model="inputs.firstName" />
    <input type="text" placeholder="last name" v-model="inputs.lastName" />
    <span class="error">{{ errMessage && errMessage }}</span>
    <input type="submit" @click.prevent="handleRegister" value="Register" />
  </form>
  <form v-else-if="isLogin">
    <h2>Login</h2>
    <input type="text" placeholder="username" v-model="login.username" />
    <input type="password" placeholder="password" v-model="login.password" />
    <span class="error">{{ errMessage && errMessage }}</span>
    <input type="submit" @click.prevent="handleLogin" value="Log in" />
  </form>
  <p>{{ isLogin ? 'No account?' : 'Already have an account?' }}
    <button @click.prevent="handleForm" style="
    background: none;
    color: chartreuse;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
	  outline: inherit;">{{ isLogin ? 'Sign up' : 'Sign in' }}
    </button> instead.
  </p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.error {
  color: red;
}
</style>
