<template>
	<view @tap="back">
		teststtwetet
	</view>
</template>

<script setup lang="ts">
	import { useRouter } from '@/router'
	const router = useRouter()
	function back() {
		router.navigateBack()
	}
</script>

<style>

</style>
