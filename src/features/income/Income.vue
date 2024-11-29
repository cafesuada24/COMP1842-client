<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-8 text-gray-800">Income Management</h1>

        <!-- Income Summary -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg mb-8 text-white">
            <h2 class="text-2xl font-semibold mb-4">Income Summary</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                    <p class="text-sm uppercase">Total Income</p>
                    <p class="text-2xl font-bold">${{ totalIncome.toFixed(2) }}</p>
                </div>
                <div class="bg-white bg-opacity-20 p-4 rounded-lg">
                    <p class="text-sm uppercase">Number of Entries</p>
                    <p class="text-2xl font-bold">{{ incomes.length }}</p>
                </div>
                <!--
        <div class="bg-white bg-opacity-20 p-4 rounded-lg">
          <p class="text-sm uppercase">Average Income</p>
          <p class="text-2xl font-bold">${{ averageIncome.toFixed(2) }}</p>
        </div>
        -->
            </div>
        </div>

        <!-- Income Entry Form -->
        <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">{{ isEditingIncome ? 'Edit Income' : 'Add New Income'
                }}</h2>
            <form @submit.prevent="incomeSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input type="number" id="amount" v-model="currentIncome.amount"
                            :class="{ 'border-red-500': v$.currentIncome.amount.$error }"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            placeholder="Enter amount" step="0.01">
                        <p v-if="v$.currentIncome.amount.$error" class="mt-1 text-sm text-red-600">
                            {{ v$.currentIncome.amount.$errors[0].$message }}
                        </p>
                    </div>
                    <div>
                        <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="category" v-model="currentIncome.category._id"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                            <option disabled>Select a category</option>
                            <option v-for="category in categories" :key="category._id" :value="category._id">{{
                                category.name }}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" id="description" v-model="currentIncome.description"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Enter description">
                </div>
                <div>
                    <button type="submit"
                        class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                        {{ isEditingIncome ? 'Update Income' : 'Add Income' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Category Management -->
        <div class="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">Manage Categories</h2>
            <div class="space-y-4">
                <div v-for="category in categories" :key="category._id"
                    class="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span class="font-medium text-gray-700">{{ category.name }}</span>
                    <div>
                        <button @click="editCategory(category)"
                            class="text-blue-600 hover:text-blue-800 mr-2 transition duration-150 ease-in-out">Edit</button>
                        <button @click="deleteCategory(category._id)"
                            class="text-red-600 hover:text-red-800 transition duration-150 ease-in-out">Delete</button>
                    </div>
                </div>
                <form @submit.prevent="categorySubmit" class="mt-6">
                    <div class="flex items-center">
                        <input type="text" v-model="currentCategory.name"
                            :placeholder="isEditingCategory ? 'Edit category name' : 'New category name'"
                            :class="{ 'border-red-500': v$.currentCategory.$error }"
                            class="flex-grow rounded-l-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <button type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out">
                            {{ isEditingCategory ? 'Update' : 'Add' }} Category
                        </button>
                    </div>
                    <p v-if="v$.currentCategory.$error" class="mt-1 text-sm text-red-600">
                        {{ v$.currentCategory.$errors[0].$message }}
                    </p>
                </form>
            </div>
        </div>

        <!-- Income List -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-semibold mb-6 text-gray-800">Income List</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="income in incomes" :key="income._id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{
                                income.amount.toFixed(2) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ income.description }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ income.category?.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new
                                Date(income.date).toLocaleDateString() }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button @click="editIncome(income)"
                                    class="text-indigo-600 hover:text-indigo-900 mr-2 transition duration-150 ease-in-out">Edit</button>
                                <button @click="deleteIncome(income._id)"
                                    class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div class="fixed bottom-5 right-5 z-50">
            <transition-group name="fade">
                <!-- eslint-disable-next-line -->
                <div v-for="(toast, index) in toasts" :key="toast.id" class="mb-2 p-4 rounded-md shadow-lg text-white"
                    :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'">
                    {{ toast.message }}
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>

import { ref, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue, numeric } from '@vuelidate/validators'
import debounce from 'lodash.debounce'

export default {
    // eslint-disable-next-line
    name: "Income",
    setup() {

        const categories = ref([]);
        const incomes = ref([]);
        const isEditingIncome = ref(false);
        const isEditingCategory = ref(false);
        const showAddCategory = ref(false);
        const error = ref('');
        const loading = ref(false);

        const currentIncome = reactive({
            _id: null,
            amount: 0,
            category: {
                _id: null,
                name: null
            },
            description: '',
            date: new Date().toISOString().split('T')[0],
        });

        const currentCategory = reactive({
            _id: null,
            name: null,
        });


        const rules = {
            currentIncome: {
                amount: { required, numeric, minValue: minValue(0.01) },
            },
            currentCategory: {
                name: { required }
            }

        };

        const v$ = useVuelidate(rules, { currentIncome, currentCategory });


        return {
            categories,
            incomes,
            currentIncome,
            currentCategory,
            isEditingIncome,
            isEditingCategory,
            showAddCategory,
            error,
            loading,
            v$
        };

    },
    methods: {
        async fetchData() {
            try {
                const [incomesResponse, categoriesResponse] = await Promise.all([
                    this.$axios.get('/income'),
                    this.$axios.get('/income/category')
                ]);


                this.incomes = incomesResponse.data;
                this.categories = categoriesResponse.data.data;
            } catch (err) {
                this.error = 'An error occurred while fetching data. Please try again later.';
                console.error('Error fetching data:', err);
            } finally {
                this.loading = false;
            }
        },
        resetIncomeForm() {
            Object.assign(this.currentIncome, { _id: null, amount: 0, category: {}, description: '', date: new Date().toISOString().split('T')[0] })
            this.isEditingIncome = false
            this.v$.currentIncome.$reset()
        },
        editIncome(income) {
            Object.assign(this.currentIncome, { ...income, category: income.category ?? {}})
            this.isEditingIncome = true;
        },

        incomeSubmit: debounce(async function () {
            try {
                const result = await this.v$.currentIncome.$validate()
                if (!result) {
                    return
                }

                const url = this.isEditingIncome ? `/income/${this.currentIncome._id}` : '/income'
                const method = this.isEditingIncome ? 'PUT' : 'POST'

                const response = await this.$axios({
                    url: url,
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.currentIncome,
                });

                if (!response.data.success) {
                    throw new Error();
                }

                const savedIncome = response.data.data;
                if (this.isEditingIncome) {
                    const index = this.incomes.findIndex((x) => x._id == savedIncome._id);
                    this.incomes[index] = savedIncome;
                } else {
                    this.incomes.push(savedIncome);
                }

                this.resetIncomeForm()
            } catch (err) {
                this.error = 'An error occurred while saving the income. Please try again.'
                console.error('Error saving income:', err)

            }
        }, 300),

        async deleteIncome(id) {
            try {
                await this.$axios.delete(`/income/${id}`);
                this.incomes = this.incomes.filter(income => income._id !== id)
            } catch (err) {
                this.error = 'An error occurred while deleting the income. Please try again.'
                console.error('Error deleting income:', err)
            }
        },

        async addCategory() {
            if (this.currentCategory && !this.categories.some(cat => cat.name === this.currentCategory)) {
                try {
                    const response = await this.$axios.post('/income/category',
                        { name: this.currentCategory }
                    );

                    const savedCategory = response.data.data;
                    this.categories.push(savedCategory);
                    this.currentIncome.category = savedCategory.category;
                    this.currentCategory = '';
                    this.showAddCategory = false;
                } catch (err) {
                    this.error = 'An error occurred while adding the category. Please try again.'
                    console.error('Error adding category:', err)
                }
            }
        },

        categorySubmit: debounce(async function () {
            try {
                const result = await this.v$.currentCategory.$validate()
                if (!result) {
                    return
                }

                const url = this.isEditingCategory ? `/income/category/${this.currentCategory._id}` : '/income/category'
                const method = this.isEditingCategory ? 'PUT' : 'POST'

                const response = await this.$axios({
                    url: url,
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.currentCategory,
                });
                if (!response.data.success) {
                    throw new Error();
                }
                const savedCategory = response.data.data;
                if (this.isEditingCategory) {
                    const index = this.categories.findIndex(x => x._id == savedCategory._id);
                    if (index !== -1) {
                        this.categories[index] = savedCategory;
                    }
                } else {
                    this.categories.push(savedCategory);
                }
                this.resetCategoryForm();
            } catch(error) {
                this.error = 'An error occurred while saving the category. Please try again.';
                console.error('Error saving category:', error)
            }

        }, 300),
        editCategory(category) {
            Object.assign(this.currentCategory, category)
            this.isEditingCategory = true;
        },
        async deleteCategory(id) {
            try {
                await this.$axios.delete(`/income/category/${id}`);
                this.categories = this.categories.filter(cat => cat._id !== id);
            } catch (err) {
                this.error = 'An error occurred while deleting the category. Please try again.'
                console.error('Error deleting category:', err)
            }
        },
        resetCategoryForm() {
            Object.assign(this.currentCategory, { _id: null, name: null });
            this.isEditingCategory = false;
            this.v$.currentCategory.$reset();
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return new Date(dateString).toLocaleDateString(undefined, options)
        },

    },


    async created() {
        await this.fetchData();
    },
    computed: {
        totalIncome() {
            return this.incomes.reduce((sum, income) => sum + income.amount, 0)
        }
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
