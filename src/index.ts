import type { App, Component } from "vue";
import * as components from "./components";
import { EventTracking, type Type } from "./js/event-tracking";

const obj: { [key: string]: Component } = components;

export const Odyssey = {
	install: (app: App) => {
		for (const i in obj) {
			app.component(i, obj[i]);
		}
	},
};

export { EventTracking, type Type };
