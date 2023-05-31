import type { App, Component } from "vue";
import * as components from "./components";
import { EventTracking } from "./js/event-tracking";
import type { EventTrackingOptsType, ActionValue, StayTimeActionValue, ReportOptsType } from "./js/event-tracking";

const obj: { [key: string]: Component } = components;

export const AegisEventTracking = {
	install: (app: App) => {
		for (const i in obj) {
			app.component(i, obj[i]);
		}
	},
};

export { EventTracking };
export type { EventTrackingOptsType, ActionValue, StayTimeActionValue, ReportOptsType };
