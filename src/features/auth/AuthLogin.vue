<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "AuthLogin",
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
      try {
        await store.dispatch("login", { email: email.value, password: password.value });
        router.push("/"); // Redirect to dashboard after login
      } catch (error) {
        console.error("Login failed:", error);
      }
    };

    return { email, password, handleLogin };
  },
};
</script>
