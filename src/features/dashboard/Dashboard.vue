<template>
  <div class="dashboard-container">
    <!-- Left Panel -->
    <aside class="left-panel">
      <nav>
        <ul>
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/income">Income</router-link></li>
          <li><router-link to="/expenses">Expenses</router-link></li>
          <li><router-link to="/saving-goals">Saving Goals</router-link></li>
          <li><router-link to="/settings">Settings</router-link></li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <h1>Dashboard</h1>
      <div class="summary-cards">
        <div class="card">
          <h2>Balance</h2>
          <p>{{ dashboardData.balance }}</p>
        </div>
        <div class="card">
          <h2>Total Income</h2>
          <p>{{ dashboardData.income.totalAmount }}</p>
        </div>
        <div class="card">
          <h2>Total Expenses</h2>
          <p>{{ dashboardData.expense.totalAmount }}</p>
        </div>
        <div class="card">
          <h2>Income Count</h2>
          <p>{{ dashboardData.income.count }}</p>
        </div>
        <div class="card">
          <h2>Expense Count</h2>
          <p>{{ dashboardData.expense.count }}</p>
        </div>
        <div class="card">
          <h2>Active Saving Goals</h2>
          <p>{{ dashboardData.activeSavingGoal }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line
  name: "Dashboard",
  data() {
    return {
      dashboardData: {
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
      },
    };
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await this.$axios.get(`/dashboard`);
        this.dashboardData = response.data.dashboardData;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
  },
  created() {
    this.fetchDashboardData();
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.left-panel {
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.left-panel nav ul {
  list-style: none;
  padding: 0;
}

.left-panel nav ul li {
  margin: 15px 0;
}

.left-panel nav ul li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

.summary-cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 200px;
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
}

.card h2 {
  margin-bottom: 10px;
}

.card p {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}
</style>
