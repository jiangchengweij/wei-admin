<template>
	<view @tap="back">
		teststtwetet
	</view>
</template>

<script setup lang="ts">
	import { useRouter } from 'vue-router'
	const router = useRouter()
	function back() {
		router.back()
	}
</script>

<style>

</style>
