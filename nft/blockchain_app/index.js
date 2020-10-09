const {
	Application,
	utils,
	HTTPAPIPlugin,
	configDevnet,
	genesisBlockDevnet,
} = require('lisk-sdk');

const { NFTModule } = require('./nft_module');
const { NFTAPIPlugin } = require('./nft_api_plugin');

// Update genesis block to contains NFT module attributes
genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts.map(
	(a) =>
		utils.objects.mergeDeep({}, a, {
			nft: {
				ownNFTs: [],
			},
		}),
);

const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'nft-app',
	genesisConfig: { communityIdentifier: 'NFT' },
	logger: {
		consoleLogLevel: 'info',
	},
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app.registerModule(NFTModule);

app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(NFTAPIPlugin);

app
	.run()
	.then(() => console.info('App started....'))
	.catch(console.error);
