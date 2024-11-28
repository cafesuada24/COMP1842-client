<template>
     <!-- <div class="min-h-screen bg-gray-50">
        <aside class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div class="p-6">
                <div class="flex items-center gap-2 text-xl font-semibold text-indigo-600">
                    <ActivityIcon class="h-6 w-6" />
                    <span>Finance</span>
                </div>
            </div>

            <nav class="px-4 py-2">
                <button v-for="(item, index) in menuItems" :key="index"
                    class="mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-gray-600 hover:bg-gray-100"
                    :class="{ 'bg-gray-100': item.active }" @click="handleRedirect(item)">
                    <component :is="item.icon" class="h-5 w-5" />
                    <span>{{ item.name }}</span>
                </button>
            </nav>
        </aside> -->

        <!-- Main Content -->
        <main class="p-6">
            <!-- Header -->
            <!-- <header class="mb-8 flex items-center justify-between">
                <div class="relative w-96">
                    <SearchIcon class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search here..."
                        class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none">
                </div>
                <div class="flex items-center gap-4">
                    <button class="relative rounded-full p-2 hover:bg-gray-100">
                        <BellIcon class="h-6 w-6 text-gray-600" />
                        <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <button class="relative rounded-full p-2 hover:bg-gray-100">
                        <MessageCircleIcon class="h-6 w-6 text-gray-600" />
                        <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                </div>
            </header> -->

            <!-- Metric Cards -->
            <div class="mb-8 grid grid-cols-4 gap-6">
                <div v-for="(metric, index) in metrics" :key="index" class="rounded-xl p-6 text-white"
                    :class="metric.bgClass">
                    <h3 class="mb-4 text-lg font-medium">{{ metric.title }}</h3>
                    <div class="mb-2 text-3xl font-bold">${{ metric.value.toLocaleString() }}</div>
                    <div class="text-sm opacity-90">{{ metric.sub }} {{ metric.subValue }}</div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-12 gap-6">
                <!-- AP and AR Balance Chart -->
                <div class="col-span-8 rounded-xl bg-white p-6 shadow-sm">
                    <div class="mb-6 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-medium text-gray-800">AP and AR Balance</h3>
                            <p class="text-sm text-gray-500">Avg. $5,309</p>
                        </div>
                        <div class="flex gap-4">
                            <select class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                                <option>Monthly</option>
                            </select>
                            <select class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                                <option>Last Year</option>
                            </select>
                        </div>
                    </div>
                    <!-- Chart placeholder -->
                    <div class="h-64 w-full bg-gray-50"></div>
                </div>

                <!-- Budget Charts -->
                <div class="col-span-2 rounded-xl bg-white p-6 shadow-sm">
                    <h3 class="mb-4 text-lg font-medium text-gray-800">% of Income Budget</h3>
                    <div class="relative mb-4 h-40 w-40 mx-auto">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-800">48%</div>
                                <div class="text-sm text-gray-500">Profit</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <div class="text-gray-600">Balance</div>
                        <div class="font-medium text-gray-800">$18,570</div>
                    </div>
                    <a href="#" class="mt-4 block text-center text-sm text-blue-600">View Full Report</a>
                </div>

                <div class="col-span-2 rounded-xl bg-white p-6 shadow-sm">
                    <h3 class="mb-4 text-lg font-medium text-gray-800">% of Expenses Budget</h3>
                    <div class="relative mb-4 h-40 w-40 mx-auto">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-800">67%</div>
                                <div class="text-sm text-gray-500">Profit</div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                        <div class="text-gray-600">Balance</div>
                        <div class="font-medium text-gray-800">$18,570</div>
                    </div>
                    <a href="#" class="mt-4 block text-center text-sm text-blue-600">View Full Report</a>
                </div>
            </div>
        </main>
        <!-- </div> -->
</template>


<script>

export default {
    // eslint-disable-next-line
    name: "Dashboard",
    setup() {

    },
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
            metrics: [
                {
                    title: 'Total Income',
                    value: 0,
                    sub: 'Count',
                    subValue: 0,
                    bgClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500'
                },
                {
                    title: 'Total Expences',
                    value: 0,
                    sub: 'Count',
                    subValue: 0,
                    bgClass: 'bg-gradient-to-r from-blue-500 to-blue-400'
                },
                {
                    title: 'Balance',
                    value: 0,
                    sub: '',
                    subValue: null,
                    bgClass: 'bg-gradient-to-r from-purple-600 to-purple-500'
                },
                {
                    title: 'Active Saving Goal',
                    value: 0,
                    sub: '',
                    subValue: null,
                    bgClass: 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                },
            ]
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
                const response = await this.$axios.get(`/dashboard`);
                this.dashboardData = response.data.dashboardData;
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
        }
    },
    async created() {
        await this.fetchDashboardData();
    },
};
</script>

