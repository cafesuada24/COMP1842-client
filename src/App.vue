<template>
    <LoggedInLayout v-if="store.getters.isAuthenticated">
        <router-view></router-view>
    </LoggedInLayout>
    <router-view v-else></router-view>
</template>

<script setup>
import LoggedInLayout from '@/layout/LoggedInLayout.vue';
import { useStore } from 'vuex';

const store = useStore();
</script>
