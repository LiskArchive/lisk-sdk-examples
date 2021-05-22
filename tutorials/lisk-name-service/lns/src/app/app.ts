import { Application, PartialApplicationConfig, utils } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {
	// PATCH genesis block for LSN module
	const updatedGenesisBlock = utils.objects.mergeDeep({}, genesisBlock);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	updatedGenesisBlock.header.asset.accounts = updatedGenesisBlock.header.asset.accounts.map(a =>
		utils.objects.mergeDeep({}, a, {
			lns: {
				ownNodes: [],
				reverseLookup: '',
			},
		}),
	);

	const app = Application.defaultApplication(updatedGenesisBlock, config);

	registerModules(app);
	registerPlugins(app);

	return app;
};
