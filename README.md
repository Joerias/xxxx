# AegisEventTracking 插件说明

实现项目内的埋点部署和对应埋点捕获功能。

#### 安装

```javascript
npm i aegis-event-tracking
```

#### 全局配置

1. main.ts 引入对应插件

```javascript
// 引入
import EventTracking from "aegis-event-tracking";

// 全局挂载
app.use(EventTracking).mount("#app");
```

2. App.vue 中使用，实现 div 元素 data-et 的自动捕获

```javascript
// 配置对应的参数
const ENV = import.meta.env.MODE;
const PROJECT_NAME = 'PROJECT_NAME'
const route = useRoute();
// 如果有全局默认参数的，需要配置如下
const extraInfo: any = {};
extraInfo.jdgsInfo = {
  courtName: userStore.courtName,
  caseNumber: userStore.caseNumber,
  causeName: userStore.caseTypeName,
  judgeName: userStore.caseJudge
};

// 全局引用模板
  <EventTrackingTpl
      :environment="ENV"
      :projectName="PROJECT_NAME"
      :route="route"
      :globalExtra="extraInfo" />
```

3. 路由守卫中引用，实现页面进入离开的捕获

```javascript
// 引入方法
import {
  EventTracking,
  type EventTrackingOptsType,
  type StayTimeActionValue
} from 'aegis-event-tracking';

import router from './index'; // 引入本地路由表
const ENV = import.meta.env.MODE;

// 通配new实例参数
const etParamsGenerate = (router: RouteLocationNormalizedLoaded): EventTrackingOptsType => {
  return {
    environment: ENV,
    projectName: PROJECT_NAME,
    modulesName: <string>router.meta.modCode,
    pageName: <string>router.meta.pgCode,
    urlPath: router.fullPath
  };
};

// 通配report方法参数，extraInfo参数为可选
const etParamsReport = (action: StayTimeActionValue, eventName: string) => ({
  action,
  eventName,
  extraInfo: {
    jdgsInfo: {
      courtName: useUserStore().courtName,
      caseNumber: useUserStore().caseNumber,
      causeName: useUserStore().caseTypeName,
      judgeName: useUserStore().caseJudge
    }
  }
});

// 实现进入离开的监听
router.beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const eventTracking = new EventTracking(etParamsGenerate(from));
    if (!(from.meta.modCode && from.meta.pgCode) || !from.href) return;
    eventTracking.report(etParamsReport('leave', 'LEAVE'));
}
router.afterEach((to: RouteLocationNormalizedLoaded) => {
  if (!(to.meta.modCode && to.meta.pgCode)) return;
  const eventTracking = new EventTracking(etParamsGenerate(to));
  eventTracking.report(etParamsReport('enter', 'INIT'));
});
```

4. 拦截器中的引用，实现接口请求自动上报

```javascript
// 引入资源
import { EventTracking, type ReportOptsType } from 'aegis-event-tracking';
import router from '@/router';

// 初始化数据
const ENV = import.meta.env.MODE;
const eventTracking = new EventTracking({
  environment: ENV,
  projectName: PROJECT_NAME,
  modulesName: 'PUBLIC_MODULE',
  pageName: 'PUBLIC_PAGE'
});
const etParamsGenerate = (router: any, response: any) => {
  return {
    action: 'api',
    eventName: 'API',
    urlPath: router.currentRoute.value.fullPath,
    apiUrl: response.config.url,
    extraInfo: {
      requestInfo: response.config,
      responseInfo: {
        status: response.status,
        code: response.data.code,
        msg: response.data.msg
      }
    }
  };
};

// 调用方法
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, headers } = response;
    eventTracking.report(etParamsGenerate(router, response));
  },
  (error: AxiosError) => {
    const { response, message } = error;
    eventTracking.report(etParamsGenerate(router, response));
  }
```

#### 业务使用

1. 自动捕获方式

```javascript
<div data-et="DOWNLOAD">下载</div>
```

2. 自定义扩展

```javascript
<div @click="handleEventTrackingClick">click me</div>

// 引入方法
import { EventTracking, type EventTrackingOptsType } from 'aegis-event-tracking';

// 初始化
const ENV = import.meta.env.MODE;
const route = useRoute();
const eventTracking = new EventTracking({
  environment: ENV,
  projectName: "APP",
  modulesName: <string>route.meta.modCode,
  pageName: <string>route.meta.pgCode,
  urlPath: route.path,
});

const handleEventTrackingClick = () => {
  eventTracking.report({ action: "event", eventName: "CUSTOM", extraInfo: { name: "joe", gender: "male" } });
};
```
