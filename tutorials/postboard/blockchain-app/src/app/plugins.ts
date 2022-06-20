/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { DashboardPlugin } from '@liskhq/lisk-framework-dashboard-plugin';
import { UserTrackerPlugin } from './plugins/user_tracker';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(DashboardPlugin);
	app.registerPlugin(UserTrackerPlugin);
};
