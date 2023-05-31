export interface EventTrackingOptsType {
	environment: string;
	projectName: string;
	modulesName: string;
	pageName: string;
	urlPath?: string;
	version?: string;
	ip?: string;
	region?: string;
	userId?: string;
	globalExtra?: any;
}

interface ReportOptsType<T> {
	action: ActionValue;
	eventName?: string;
	urlPath?: string;
	apiUrl?: string;
	extraInfo?: T;
}

type ActionValue = "enter" | "leave" | "event" | "api";
export type StayTimeActionValue = "enter" | "leave";

interface SaveOptsType<T> {
	eventId: string;
	stayTime: number | undefined;
	urlPath?: string;
	apiUrl?: string;
	extraInfo?: T;
}

export class EventTracking {
	environment: string;
	projectName: string;
	modulesName: string;
	pageName: string;
	urlPath: string;
	version: string;
	ip: string;
	region: string;
	userId: string;
	globalExtra: any;

	/**
	 * @description 基本入参
	 * @param environment 当前项目编译环境
	 * @param projectName 埋点命名的第一个字段
	 * @param modulesName 埋点命名的第二个字段
	 * @param pageName 埋点命名的第三个字段
	 * @param urlPath 当前页面的路由
	 * @param version 当前项目版本
	 * @param ip 当前访客ip地址
	 * @param region 当前访客地区信息
	 * @param userId 当前访客设备指纹
	 * @return void
	 */
	constructor(opts: EventTrackingOptsType) {
		this.environment = opts.environment;
		this.projectName = opts.projectName;
		this.modulesName = opts.modulesName;
		this.pageName = opts.pageName;
		this.urlPath = opts.urlPath ?? "";
		this.version = opts.version ?? "1.0";
		this.ip = opts.ip ?? <string>sessionStorage.getItem("ip");
		this.region = opts.region ?? <string>sessionStorage.getItem("region");
		this.userId = opts.userId ?? <string>sessionStorage.getItem("fingerprint");
		this.globalExtra = opts.globalExtra;
	}

	/**
	 * @description 计算单页面停留时长
	 * @param type 触发函数类型：enter/leave
	 * @return undefined|number
	 */
	stayTime(type: "enter" | "leave") {
		let millisecond = undefined;
		const timestamp = new Date().getTime();
		if (type === "enter") {
			sessionStorage.setItem("eventTrackingStayTime", timestamp + "");
		} else if (type === "leave") {
			if (sessionStorage.getItem("eventTrackingStayTime")) {
				millisecond = timestamp - Number(sessionStorage.getItem("eventTrackingStayTime"));
			}
		}
		return millisecond;
	}

	/**
	 * @description 报告埋点事件
	 * @param action 事件类型：enter/leave/event/api
	 * @param eventName 埋点命名的第四个字段（projectName-modulesName-pageName-eventName）在api事件类型下为请求接口的状态
	 * @param urlPath 请求接口时上报的当前url地址
	 * @param apiUrl 请求接口的地址
	 * @param extraInfo 扩展字段，针对自定义上传内容传入{}
	 * @return void
	 */
	report<T>(opts: ReportOptsType<T>) {
		let extraInfoObj: any = null;
		if (!!this.globalExtra && !!opts.extraInfo) {
			extraInfoObj = { ...this.globalExtra };
			for (const i in opts.extraInfo) {
				extraInfoObj[i] = opts.extraInfo[i];
			}
		} else if (!!this.globalExtra && !opts.extraInfo) {
			extraInfoObj = this.globalExtra;
		} else if (!this.globalExtra && !!opts.extraInfo) {
			extraInfoObj = opts.extraInfo;
		}
		this.save({
			eventId: `${this.projectName}.${this.modulesName}.${this.pageName}.${opts.eventName}`,
			stayTime: this.stayTime(<"enter" | "leave">opts.action),
			...(opts.urlPath ? { urlPath: opts.urlPath } : {}),
			...(opts.apiUrl ? { apiUrl: opts.apiUrl } : {}),
			...(extraInfoObj ? { extraInfo: extraInfoObj } : {}),
		});
	}

	/**
	 * @description 报告埋点事件
	 * @return void
	 */
	private save<T>(opts: SaveOptsType<T>) {
		const log = {
			environment: this.environment,
			version: this.version,
			ip: this.ip,
			cityName: this.region,
			userId: this.userId,
			eventId: opts.eventId,
			pageStayTime: opts.stayTime,
			pageUrl: this.urlPath || opts.urlPath,
			apiUrl: opts.apiUrl,
			extraInfo: JSON.stringify(opts.extraInfo),
		};
		let args = "";
		for (const i in log) {
			if (log[i as keyof typeof log]) {
				args += `${i}=${encodeURIComponent(<string | number | boolean>log[i as keyof typeof log])}&`;
			}
		}
		args = args.slice(0, -1);
		const img = new Image(1, 1);
		img.src = `http://t-datalog.aegis-info.com/public/aegis/point/1.gif?${args}`;
	}
}
