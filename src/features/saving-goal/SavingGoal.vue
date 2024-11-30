<template>
    <div class="p-6">
        <div class="flex flex-row w-full justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Saving Goal Management</h1>
            <button @click="gotoSavingGoalReport"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                View Report
            </button>
        </div>

        <!-- Savings Goal Form -->
        <form @submit.prevent="handleSavingGoalSubmit" class="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                    Goal Name
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :class="{ 'border-red-500': v$.currentGoal.title.$error }" id="name" type="text"
                    v-model="currentGoal.title" placeholder="Enter goal name" @blur="v$.currentGoal.title.$touch()">
                <div v-if="v$.currentGoal.title.$error" class="text-red-500 text-xs italic mt-1">
                    {{ v$.currentGoal.title.$errors[0].$message }}
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="targetAmount">
                    Target Amount
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :class="{ 'border-red-500': v$.currentGoal.targetAmount.$error }" id="targetAmount" type="number"
                    step="0.01" v-model.number="currentGoal.targetAmount" placeholder="Enter target amount"
                    @blur="v$.currentGoal.targetAmount.$touch()">
                <div v-if="v$.currentGoal.targetAmount.$error" class="text-red-500 text-xs italic mt-1">
                    {{ v$.currentGoal.targetAmount.$errors[0].$message }}
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="currentAmount">
                    Current Amount
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :class="{ 'border-red-500': v$.currentGoal.currentAmount.$error }" id="currentAmount" type="number"
                    step="0.01" v-model.number="currentGoal.currentAmount" placeholder="Enter current amount"
                    @blur="v$.currentGoal.currentAmount.$touch()">
                <div v-if="v$.currentGoal.currentAmount.$error" class="text-red-500 text-xs italic mt-1">
                    {{ v$.currentGoal.currentAmount.$errors[0].$message }}
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="deadline">
                    Deadline
                </label>
                <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    :class="{ 'border-red-500': v$.currentGoal.deadline.$error }" id="deadline" type="date"
                    v-model="currentGoal.deadline" @blur="v$.currentGoal.deadline.$touch()">
                <div v-if="v$.currentGoal.deadline.$error" class="text-red-500 text-xs italic mt-1">
                    {{ v$.currentGoal.deadline.$errors[0].$message }}
                </div>
            </div>
            <div class="flex items-center justify-between">
                <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit" :disabled="v$.$invalid">
                    {{ editingIndex !== null ? 'Update' : 'Add' }} Savings Goal
                </button>
                <button v-if="editingIndex !== null"
                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" @click="cancelEdit">
                    Cancel
                </button>
            </div>
        </form>

        <!-- Savings Goals List -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-xl font-semibold mb-4">Savings Goals</h2>
            <div v-for="(goal, index) in savingsGoals" :key="index" class="mb-6 p-4 border rounded">
                <h3 class="text-lg font-semibold mb-2">{{ goal.name }}</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-sm font-medium text-gray-600">Target Amount</p>
                        <p class="text-lg">${{ goal.targetAmount.toFixed(2) }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Current Amount</p>
                        <p class="text-lg">${{ goal.currentAmount.toFixed(2) }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Remaining</p>
                        <p class="text-lg">${{ (goal.targetAmount - goal.currentAmount).toFixed(2) }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-600">Deadline</p>
                        <p class="text-lg">{{ formatDate(goal.deadline) }}</p>
                    </div>
                </div>
                <div class="mb-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-blue-600 h-2.5 rounded-full"
                            :style="{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }"></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">Progress: {{ ((goal.currentAmount / goal.targetAmount) *
                        100).toFixed(2)
                        }}%</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button @click="editGoal(index)"
                        class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                        Edit
                    </button>
                    <button @click="deleteGoal(index, goal._id)"
                        class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm">
                        Delete
                    </button>
                    <button @click="openDepositModal(index)"
                        class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm">
                        Deposit
                    </button>
                    <button @click="openWithdrawModal(index)"
                        class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-2 rounded text-sm">
                        Withdraw
                    </button>
                </div>
            </div>
        </div>

        <!-- Deposit Modal -->
        <div v-if="showDepositModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white p-5 rounded-lg shadow-xl">
                <h3 class="text-lg font-semibold mb-4">Deposit to {{ savingsGoals[selectedGoalIndex]?.name }}</h3>
                <input v-model="depositAmount" type="number" step="0.01"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    placeholder="Enter deposit amount">
                <div class="flex justify-end space-x-2">
                    <button @click="closeDepositModal"
                        class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button @click="confirmDeposit"
                        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Confirm Deposit
                    </button>
                </div>
            </div>
        </div>

        <!-- Withdraw Modal -->
        <div v-if="showWithdrawModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white p-5 rounded-lg shadow-xl">
                <h3 class="text-lg font-semibold mb-4">Withdraw from {{ savingsGoals[selectedGoalIndex]?.name }}</h3>
                <input v-model="withdrawAmount" type="number" step="0.01"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                    placeholder="Enter withdraw amount">
                <div class="flex justify-end space-x-2">
                    <button @click="closeWithdrawModal"
                        class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button @click="confirmWithdraw"
                        class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
                        Confirm Withdraw
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, numeric } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import debounce from 'lodash.debounce';

export default {
    name: 'SavingGoal',
    setup() {

        const isEditingSavingGoal = ref(false);
        const savingsGoals = ref([]);
        const editingIndex = ref(null);
        const showDepositModal = ref(false);
        const showWithdrawModal = ref(false);
        const selectedGoalIndex = ref(null);
        const depositAmount = ref('');
        const withdrawAmount = ref('');
        const router = useRouter();
        const currentGoal = reactive({
            title: '',
            targetAmount: '',
            currentAmount: 0,
            status: '',
            deadline: ''
        });

        const rules = {
            currentGoal: {
                title: { required },
                targetAmount: { required, minValue: minValue(0.01), numeric },
                currentAmount: { required, minValue: minValue(0), numeric },
                deadline: { required }
            }
        }

        const v$ = useVuelidate(rules, { currentGoal })

        return {
            savingsGoals,
            editingIndex,
            currentGoal,
            isEditingSavingGoal,
            v$,
            showDepositModal,
            showWithdrawModal,
            selectedGoalIndex,
            depositAmount,
            withdrawAmount,
            router
        };
    },
    methods: {
        async fetchData() {
            try {
                const savingsGoalsResponse = await this.$axios.get('/saving-goal');
                this.savingsGoals = savingsGoalsResponse.data;
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        },
        handleSavingGoalSubmit: debounce(async function () {
            try {
                const isFormCorrect = await this.v$.currentGoal.$validate();
                if (!isFormCorrect) return

                const url = this.editingIndex !== null ? `/saving-goal/${this.currentGoal._id}` : '/saving-goal'
                const method = this.editingIndex !== null ? 'PUT' : 'POST'

                const response = await this.$axios({
                    url,
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: this.currentGoal,
                });

                if (!response.data.success) {
                    throw new Error();
                }

                const savedSavingGoal = response.data.data;

                if (this.editingIndex !== null) {
                    this.savingsGoals[this.editingIndex] = savedSavingGoal;
                } else {
                    this.savingsGoals.push(savedSavingGoal);
                }

                this.resetSavingGoalForm();
            } catch (err) {
                console.error('Error saving saving goals:', err)
            }
        }, 300),
        resetSavingGoalForm() {
            Object.assign(this.currentGoal, {
                name: '',
                targetAmount: '',
                currentAmount: 0,
                deadline: ''
            });
            this.editingIndex = null;
            this.v$.currentGoal.$reset();
        },
        editGoal(index) {
            Object.assign(this.currentGoal, { ...this.savingsGoals[index], deadline: this.savingsGoals[index].deadline.split('T')[0] });
            this.editingIndex = index;
        },
        async deleteGoal(index, id) {
            try {
                await this.$axios.delete(`/saving-goal/${id}`);
                this.savingsGoals.splice(index, 1);
            } catch (err) {
                console.error('Error deleting goal: ', err)
            }
        },
        cancelEdit() {
            this.resetSavingGoalForm()
        },
        openDepositModal(index) {
            this.selectedGoalIndex = index
            this.showDepositModal = true
        },
        closeDepositModal() {
            this.showDepositModal = false
            this.depositAmount = ''
        },
        async confirmDeposit() {
            const amount = parseFloat(this.depositAmount)
            const goal = this.savingsGoals[this.selectedGoalIndex];
            if (amount > 0) {
                if (await this.addTransaction(goal._id, amount, false)) {
                    goal.currentAmount += amount;
                }
            }
            this.closeDepositModal()
        },
        openWithdrawModal(index) {
            this.selectedGoalIndex = index
            this.showWithdrawModal = true
        },
        closeWithdrawModal() {
            this.showWithdrawModal = false
            this.withdrawAmount = ''
        },
        async confirmWithdraw() {
            const amount = parseFloat(this.withdrawAmount)
            const goal = this.savingsGoals[this.selectedGoalIndex];
            if (amount > 0 && amount <= goal.currentAmount) {
                if (await this.addTransaction(goal._id, amount, true)) {
                    goal.currentAmount -= amount
                }
            }
            this.closeWithdrawModal()
        },
        async addTransaction(id, amount, isWithdraw) {
            try {
                await this.$axios.post(`/saving-goal/${id}/transaction`, { amount, isWithdraw });
                return true;
            } catch (err) {
                console.error('Error adding transaction: ', err);
                return false;
            }
        },

        gotoSavingGoalReport() {
            this.router.push('/saving-goal/report');
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

    }
}

</script>
