<script setup lang="ts">
// 本地调试
import EventTrackingTpl from "../components/event-tracking/index.vue";
import { EventTracking } from "../js/event-tracking";
import { useRoute } from "vue-router";

const route = useRoute();
const ENV = import.meta.env.MODE;
const globalExtra = {
	var1: 1,
	var2: "2",
};
const eventTracking = new EventTracking({
	environment: ENV,
	projectName: "APP",
	modulesName: "<string>route.meta.modCode",
	pageName: "<string>route.meta.pgCode",
	urlPath: "route.path",
	globalExtra: { name: "alex", id: 1 },
});

const handleEventTrackingClick = (type: number) => {
	if (type === 1) {
		eventTracking.report({ action: "event", eventName: "CUSTOM", extraInfo: { name: "joe", gender: "male" } });
	} else {
		eventTracking.report({ action: "api", eventName: "API", apiUrl: "http://www.baidu.com/" });
	}
};
</script>

<template>
	<div @click="handleEventTrackingClick(1)">click me</div>
	<div @click="handleEventTrackingClick(2)">test api</div>
	<div data-et="ORIGIN">origin element</div>
	<EventTrackingTpl :environment="ENV" projectName="AI" :route="route" :globalExtra="globalExtra" />
</template>
