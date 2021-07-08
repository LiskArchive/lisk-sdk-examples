/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { LatestHelloPlugin } from "./plugins/latest_hello/latest_hello_plugin";
import { DashboardPlugin } from "@liskhq/lisk-framework-dashboard-plugin";

// @ts-expect-error Unused variable error happens here until at least one module is registered
export const registerPlugins = (app: Application): void => {

    app.registerPlugin(LatestHelloPlugin);
    app.registerPlugin(DashboardPlugin);
};
