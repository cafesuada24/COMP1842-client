<template>
    <div class="p-6">
        <h1 class="text-2xl font-semibold mb-6">Expense Report</h1>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <canvas ref="expenseChart"></canvas>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'ExpenseReport',
    setup() {
        const expenseChart = ref(null);
        const categories = ref([]);
        const expenses = ref([]);
        const isDataReady = ref(false);


        return { expenseChart, expenses, categories, isDataReady };
    },

    methods: {
        async fetchData() {
            try {
                const [expensesResponse, categoriesResponse] = await Promise.all([
                    this.$axios.get('/expense'),
                    this.$axios.get('/expense/category')
                ]);

                this.expenses = expensesResponse.data;
                this.categories = categoriesResponse.data.data;
            } catch (err) {
                this.error = 'An error occurred while fetching data. Please try again later.';
                console.error('Error fetching data:', err);
            } finally {
                this.loading = false;
            }
        },
        getCalculatedData() {
            const result = {'Other': 0};
            for (const cat of this.categories) {
                result[cat.name] = 0;
            }

            for (const expense of this.expenses) {
                result[expense.category?.name ?? 'Other'] += expense.amount;
            }

            return result;
        }
    },
    mounted() {
        this.$watch(
            () => this.isDataReady,
            () => {
                const ctx = this.expenseChart.getContext('2d');
                const data = this.getCalculatedData();
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(data),
                        datasets: [{
                            data: Object.values(data),
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            title: {
                                display: true,
                                text: 'Monthly Expenses'
                            }
                        }
                    }
                });
            });
    },
    async created() {
        await this.fetchData();
        this.isDataReady = true;
    }
}
</script>
