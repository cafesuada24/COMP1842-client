<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Goal Report</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <canvas ref="goalChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'GoalReport',
  setup() {
    const goalChart = ref(null);
    const savingsGoals = ref([]);
    const isDataReady = ref(false);

    return { goalChart, savingsGoals, isDataReady };
  },
  methods: {
    async fetchData() {
      try {
        const savingsGoalsResponse = await this.$axios.get('/saving-goal');
        this.savingsGoals = savingsGoalsResponse.data;
        this.isDataReady = true;
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  },
  async mounted() {
    this.$watch(
      () => this.isDataReady,
      () => {
        const ctx = this.goalChart.getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.savingsGoals.map(x => x.title),
            datasets: [
              {
                label: 'Current Amount',
                data: this.savingsGoals.map(x => x.currentAmount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Target Amount',
                data: this.savingsGoals.map(x => x.targetAmount),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount ($)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Savings Goals'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Savings Goals Progress'
              }
            }
          }
        });
      })},
  async created() {
    await this.fetchData();
  }
}
</script>
