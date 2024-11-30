<template>
  <!-- Main Content -->
  <main class="p-6">
    <!-- Metric Cards -->
    <div class="mb-8 grid grid-cols-4 gap-6">
      <div v-for="(metric, index) in metrics" :key="index" class="rounded-xl p-6 text-white" :class="metric.bgClass">
        <h3 class="mb-4 text-lg font-medium">{{ metric.title }}</h3>
        <div class="mb-2 text-3xl font-bold">{{metric.prefix}}{{ metric.value.toLocaleString() }}</div>
        <div class="text-sm opacity-90">{{ metric.sub }} {{ metric.subValue }}</div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- AP and AR Balance Chart -->
      <div class="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-medium text-gray-800">Monthly Balance ($)</h3>
            <p class="text-sm text-purple-500">Avg. {{ balance.avg }}$</p>
          </div>
        </div>
        <canvas ref="apArChart"></canvas>
      </div>

      <!-- Budget Progress Charts -->
      <div class="grid grid-rows-1 gap-6">
        <!-- Expenses Budget -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-lg font-medium text-gray-800 mb-4">% of Completion of Goals</h3>
          <div class="relative">
            <canvas ref="goalChart"></canvas>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p class="text-2xl font-bold">{{ goal.percentComplete }}%</p>
              <p class="text-sm text-gray-500">Completed</p>
            </div>
          </div>
          <div class="mt-4 flex justify-between items-center text-sm">
            <div>
              <p class="text-gray-600">Fail or Incompleted</p>
              <p class="font-medium">{{ goal.failOrIncompleteCount }}</p>
            </div>
            <div>
              <p class="text-cyan-600">Completed</p>
              <p class="font-medium">{{ goal.completeCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <!-- </div> -->
</template>


<script>
import { ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
  // eslint-disable-next-line
  name: "Dashboard",
  setup() {
    const timeframe = ref('monthly')
    const compareWith = ref('lastYear')
    const apArChart = ref(null)
    const incomeChart = ref(null)
    const goalChart = ref(null)
    const isDataReady = ref(false);
    const incomes = ref([]);
    const expenses = ref([]);
    const goals = ref([]);
    const balance = ref({ avg: 0 });
    const goal = ref({
      percentComplete: 0,
      completeCount: 0,
      failOrIncompleteCount: 0,
    });
    const dashboardData = ref({
      balance: 0,
      activeSavingGoal: 0,
      income: {
        count: 0,
        totalAmount: 0
      },
      expense: {
        count: 0,
        totalAmount: 0
      }
    });
    const metrics = ref([
      {
        title: 'Total Income',
        prefix: '$',
        value: 0,
        sub: 'Count',
        subValue: 0,
        bgClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500'
      },
      {
        title: 'Total Expences',
        prefix: '$',
        value: 0,
        sub: 'Count',
        subValue: 0,
        bgClass: 'bg-gradient-to-r from-blue-500 to-blue-400'
      },
      {
        title: 'Balance',
        prefix: '$',
        value: 0,
        sub: '',
        subValue: null,
        bgClass: 'bg-gradient-to-r from-purple-600 to-purple-500'
      },
      {
        title: 'Active Savings Goals',
        prefix: '',
        value: 0,
        sub: '',
        subValue: null,
        bgClass: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
      },
    ]
    );

    return {
      timeframe,
      compareWith,
      apArChart,
      incomeChart,
      goalChart,
      isDataReady,
      incomes,
      expenses,
      dashboardData,
      metrics,
      goals,
      goal,
      balance,
    };
  },
  methods: {
    syncMetrics() {
      this.metrics[0].value = this.dashboardData.income.totalAmount;
      this.metrics[0].subValue = this.dashboardData.income.count;
      this.metrics[1].value = this.dashboardData.expense.totalAmount;
      this.metrics[1].subValue = this.dashboardData.expense.count;
      this.metrics[2].value = this.dashboardData.balance;
      this.metrics[3].value = this.dashboardData.activeSavingGoal;
      return this.metrics;
    },
    async fetchDashboardData() {
      try {
        const [dashboardResponse, incomeResponse, expenseResponse, goalResponse] = await Promise.all([
          this.$axios.get(`/dashboard`),
          this.$axios.get(`/income`),
          this.$axios.get(`/expense`),
          this.$axios.get('/saving-goal'),
        ]);
        this.dashboardData = dashboardResponse.data.dashboardData;
        this.incomes = incomeResponse.data;
        this.expenses = expenseResponse.data;
        this.goals = goalResponse.data;
        this.syncMetrics();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    handleRedirect(item) {
      console.log(item.url);
      if (item.url) {
        this.$router.push(item.url);
      }
    },
    getBalanceData() {
      const currentYear = new Date().getFullYear();
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const monthlyTotals = months.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {});

      this.incomes.forEach(({ amount, date }) => {
        const parsedDate = new Date(date);

        if (parsedDate.getFullYear() === currentYear) {
          const month = months[parsedDate.getMonth()];
          monthlyTotals[month] += amount;
        }
      });

      this.expenses.forEach(({ amount, date }) => {
        const parsedDate = new Date(date);

        if (parsedDate.getFullYear() === currentYear) {
          const month = months[parsedDate.getMonth()];
          monthlyTotals[month] -= amount;
        }
      });
      this.balance.avg = Object.keys(monthlyTotals).reduce(
        (prev, curr) => prev + monthlyTotals[curr], 0) / months.length;

      return monthlyTotals;
    },
    calcGoalData() {
      const completedGoals = this.goals.reduce((sum, cur) => sum + cur.status === 'achieved' ? 0 : 1, 0);
      this.goal.percentComplete = completedGoals / this.goals.length * 100;
      this.goal.completeCount = completedGoals;
      this.goal.failOrIncompleteCount = this.goals.length - completedGoals;
    }
  },
  async mounted() {
    this.$watch(
      () => this.isDataReady,
      () => {
        const balanceData = this.getBalanceData();
        this.calcGoalData();
        new Chart(this.apArChart, {
          type: 'bar',
          data: {
            labels: Object.keys(balanceData),
            datasets: [
              {
                type: 'bar',
                label: 'Balance',
                data: Object.values(balanceData),
                backgroundColor: 'rgba(147, 197, 253, 0.5)',
                borderColor: 'rgba(147, 197, 253, 1)',
                borderWidth: 1
              },
              {
                type: 'line',
                label: 'Trend',
                data: Object.values(balanceData),
                borderColor: 'rgba(147, 197, 253, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })

        new Chart(this.goalChart, {
          type: 'doughnut',
          data: {
            labels: ['Achieved', 'Failed or Incompleted'],
            datasets: [{
              data: [this.goal.percentComplete, 100 - this.goal.percentComplete],
              backgroundColor: [
                'rgba(6, 182, 212, 0.6)',
                'rgba(229, 231, 235, 0.5)'
              ],
              borderWidth: 0
            }]
          },
          options: {
            cutout: '75%',
            plugins: {
              legend: {
                display: false
              }
            }
          }
        })
      }
    );
  },
  async created() {
    await this.fetchDashboardData();
    this.isDataReady = true;
  },
};
</script>
