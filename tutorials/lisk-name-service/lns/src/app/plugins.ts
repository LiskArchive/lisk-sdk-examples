import { Application, ForgerPlugin, HTTPAPIPlugin } from 'lisk-sdk';
import { LNSDashboardPlugin } from 'lns-dashboard-plugin';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(HTTPAPIPlugin);
	app.registerPlugin(ForgerPlugin);
	app.registerPlugin(LNSDashboardPlugin);

	app.overridePluginOptions(LNSDashboardPlugin.alias, {
		applicationUrl: `ws://localhost:${app.config.rpc.port}/ws`,
		port: 8000,
	});
};
