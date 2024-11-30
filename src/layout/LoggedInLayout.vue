<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md">
      <div class="flex h-16 items-center justify-center border-b">
        <h1 class="text-xl font-bold text-indigo-600">Finance Dashboard</h1>
      </div>
      <nav class="mt-6">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="flex items-center px-6 py-2 mt-4 text-gray-700 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
          :class="{ 'bg-gray-200': $route.path === item.path }">
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 py-4 bg-white border-b">
        <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center">
          <button class="p-1 mr-4 text-gray-400 hover:text-gray-600">
            <BellIcon class="h-6 w-6" />
          </button>
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center focus:outline-none">
              <img class="h-8 w-8 rounded-full object-cover" src="https://via.placeholder.com/150" alt="User avatar" />
              <span class="ml-2 text-sm font-medium text-gray-700">{{ store.user?.username }}</span>
            </button>
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { HomeIcon, DollarSignIcon, PieChartIcon, BellIcon } from 'lucide-vue-next'

const route = useRoute();
const router = useRouter();
const store = useStore();

const showUserMenu = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Income', path: '/income', icon: DollarSignIcon },
  { name: 'Expense', path: '/expense', icon: PieChartIcon },
  { name: 'Saving Goal', path: '/saving-goal', icon: DollarSignIcon },
]

const pageTitle = computed(() => {
  const currentRoute = navItems.find(item => item.path === route.path)
  return currentRoute ? currentRoute.name : route.name;
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  store.dispatch('logout');
  router.push('/auth/login');
}
</script>
