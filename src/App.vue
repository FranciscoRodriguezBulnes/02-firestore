<template>
  <div>
    <h1>App</h1>
    <nav v-if="!userStore.loadingSession">
      <router-link to="/" v-if="userStore.userData">Home</router-link> |
      <router-link to="/login" v-if="!userStore.userData">Login</router-link> |
      <router-link to="/register" v-if="!userStore.userData">Register</router-link> |
      <button @click="userStore.logoutUser" v-if="userStore.userData">Logout</button>
    </nav>
    <div v-else>
      loading user...
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import {useUserStore} from './stores/user'
const userStore = useUserStore()

// import { onMounted } from "vue";
// import { getAuth } from "firebase/auth";

// onMounted(() => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (user) {
//     console.log("UID:", user.uid);
//   } else {
//     console.log("No hay usuario autenticado todavía");
//   }
// });



</script>