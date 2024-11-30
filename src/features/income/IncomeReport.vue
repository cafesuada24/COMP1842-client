<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Income Report</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <canvas ref="incomeChart"></canvas>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'IncomeReport',
  setup() {
    const incomeChart = ref(null);
    const isDataReady = ref(false);
    const incomes = ref([]);

    return { incomeChart, isDataReady, incomes };
  },

  methods: {
    async fetchData() {
      try {
        const [incomesResponse] = await Promise.all([
          this.$axios.get('/income'),
        ]);

        this.incomes = incomesResponse.data;
      } catch (err) {
        this.error = 'An error occurred while fetching data. Please try again later.';
        console.error('Error fetching data:', err);
      }
    },
    getCalculatedData() {
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
          const month = months[parsedDate.getMonth()]; // Get month name
          monthlyTotals[month] += amount; // Add the amount to the corresponding month
        }
      });

      return monthlyTotals;
    }
  },

  mounted() {
    this.$watch(
      () => this.isDataReady,
      () => {
        const ctx = this.incomeChart.getContext('2d');
        const data = this.getCalculatedData();
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(data),
            datasets: [{
              label: 'Income',
              data: Object.values(data),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
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
                  text: 'Month'
                }
              }
            }
          }
        });
      }
    )
  },
  async created() {
    await this.fetchData();
    this.isDataReady = true;
  }

}
</script>
