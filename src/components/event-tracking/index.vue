<script lang="ts">
export default {
	name: "EventTrackingTpl",
};
</script>
<script setup lang="ts">
import { onMounted } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { EventTracking } from "../../js/event-tracking";

type Props = {
	environment: string;
	projectName: string;
	route: RouteLocationNormalizedLoaded;
	globalExtra: any;
};

const props = withDefaults(defineProps<Props>(), {});

onMounted(() => {
	const eventTracking = new EventTracking({
		environment: props.environment,
		projectName: props.projectName,
		modulesName: <string>props.route.meta.modCode,
		pageName: <string>props.route.meta.pgCode,
		urlPath: props.route.path,
		globalExtra: props.globalExtra,
	});
	document.body.addEventListener(
		"click",
		(e: Event) => {
			if (e !== null && e.target instanceof HTMLElement) {
				if (findProperty(e.target))
					eventTracking.report({
						action: "event",
						eventName: <string>(<HTMLElement["dataset"]>{ ...findProperty(e.target) })["et"],
					});
			}
		},
		true
	);
});

const findProperty = (e: HTMLElement): HTMLElement["dataset"] | undefined => {
	if (e.dataset.hasOwnProperty("et")) {
		return e.dataset;
	} else if (e.localName !== "body") {
		return findProperty(<HTMLElement>e.parentElement);
	}
	return;
};
</script>

<template></template>
