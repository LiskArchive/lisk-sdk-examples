import { Application, ForgerPlugin, HTTPAPIPlugin } from 'lisk-sdk';
import { LNSDashboardPlugin } from 'lns-dashboard-plugin';
import { DashboardPlugin } from "@liskhq/lisk-framework-dashboard-plugin";
import { FaucetPlugin } from "@liskhq/lisk-framework-faucet-plugin";

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(HTTPAPIPlugin);
	app.registerPlugin(ForgerPlugin);
    app.registerPlugin(DashboardPlugin);
    app.registerPlugin(FaucetPlugin);
	app.registerPlugin(LNSDashboardPlugin);

	app.overridePluginOptions(LNSDashboardPlugin.alias, {
		applicationUrl: `ws://localhost:${app.config.rpc.port}/ws`,
		port: 8000,
	});
};
