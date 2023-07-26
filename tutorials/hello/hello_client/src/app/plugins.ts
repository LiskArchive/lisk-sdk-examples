/* eslint-disable import/namespace */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { DashboardPlugin } from '@liskhq/lisk-framework-dashboard-plugin';
import { HelloInfoPlugin } from "./plugins/hello_info/hello_info_plugin";

export const registerPlugins = (app: Application): void => {
    app.registerPlugin(new HelloInfoPlugin());
    app.registerPlugin(new DashboardPlugin());
};
