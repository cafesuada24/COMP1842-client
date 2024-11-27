<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-6 text-2xl font-bold">Income Management</h1>

    <!-- Total Income Summary -->
    <div class="mb-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg bg-white p-4 shadow-md">
        <h2 class="mb-2 text-lg font-semibold text-gray-700">Total Income</h2>
        <p class="text-3xl font-bold text-indigo-600">${{ totalIncome.toFixed(2) }}</p>
      </div>
      <div class="rounded-lg bg-white p-4 shadow-md">
        <h2 class="mb-2 text-lg font-semibold text-gray-700">Total Entries</h2>
        <p class="text-3xl font-bold text-indigo-600">{{ incomes.length }}</p>
      </div>
    </div>

    <!-- Add/Edit Income Form -->
    <form @submit.prevent="handleSubmit" class="mb-8 rounded-lg bg-white p-6 shadow-md">
      <h2 class="mb-4 text-xl font-semibold">{{ isEditing ? 'Edit' : 'Add' }} Income</h2>
      <div class="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label for="amount" class="mb-2 block text-sm font-medium text-gray-700">Amount</label>
          <input id="amount" v-model.number="currentIncome.amount" type="number" step="0.01" required
            class="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label for="category" class="mb-2 block text-sm font-medium text-gray-700">Category</label>
          <div class="flex">
            <select id="category" v-model="currentIncome.category" required
              class="w-full rounded-l-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <button type="button" @click="showAddCategory = true"
              class="rounded-r-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              +
            </button>
          </div>
        </div>
      </div>
      <div class="mb-4">
        <label for="description" class="mb-2 block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" v-model="currentIncome.description" rows="3"
          class="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
      </div>
      <div class="flex justify-end">
        <button type="submit"
          class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          {{ isEditing ? 'Update' : 'Add' }} Income
        </button>
      </div>
    </form>

    <!-- Add Category Modal -->
    <div v-if="showAddCategory" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Add New Category</h3>
                <div class="mt-2">
                  <input v-model="newCategory" type="text" placeholder="Enter new category"
                    class="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button" @click="addCategory"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
              Add
            </button>
            <button type="button" @click="showAddCategory = false"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Income List -->
    <div class="overflow-x-auto rounded-lg bg-white shadow-md">
      <table class="w-full table-auto">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="income in incomes" :key="income.id">
            <td class="whitespace-nowrap px-6 py-4">${{ income.amount.toFixed(2) }}</td>
            <td class="whitespace-nowrap px-6 py-4">{{ income.category }}</td>
            <td class="px-6 py-4">{{ income.description }}</td>
            <td class="whitespace-nowrap px-6 py-4">
              <button @click="editIncome(income)" class="mr-2 text-indigo-600 hover:text-indigo-900 focus:outline-none">
                Edit
              </button>
              <button @click="deleteIncome(income.id)" class="text-red-600 hover:text-red-900 focus:outline-none">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const incomes = ref([
  { id: 1, amount: 5000, category: 'Salary', description: 'Monthly salary' },
  { id: 2, amount: 1000, category: 'Freelance', description: 'Web development project' },
])

const currentIncome = reactive({
  id: null,
  amount: 0,
  category: '',
  description: '',
})

const isEditing = ref(false)
const showAddCategory = ref(false)
const newCategory = ref('')

const categories = ref(['Salary', 'Freelance', 'Investments', 'Other'])

const totalIncome = computed(() => {
  return incomes.value.reduce((sum, income) => sum + income.amount, 0)
})

const handleSubmit = () => {
  if (isEditing.value) {
    const index = incomes.value.findIndex(income => income.id === currentIncome.id)
    if (index !== -1) {
      incomes.value[index] = { ...currentIncome }
    }
  } else {
    const newId = Math.max(0, ...incomes.value.map(i => i.id)) + 1
    incomes.value.push({ ...currentIncome, id: newId })
  }
  resetForm()
}

const editIncome = (income) => {
  Object.assign(currentIncome, income)
  isEditing.value = true
}

const deleteIncome = (id) => {
  incomes.value = incomes.value.filter(income => income.id !== id)
}

const resetForm = () => {
  Object.assign(currentIncome, { id: null, amount: 0, category: '', description: '' })
  isEditing.value = false
}

const addCategory = () => {
  if (newCategory.value && !categories.value.includes(newCategory.value)) {
    categories.value.push(newCategory.value)
    currentIncome.category = newCategory.value
    newCategory.value = ''
    showAddCategory.value = false
  }
}
</script>
<script>
export default {
  // eslint-disable-next-line
  name: "Income"
}
</script>
