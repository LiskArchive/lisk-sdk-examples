const { Application } = require('lisk-sdk');
const genesisBlockDevnet = require('./genesis_block_devnet.json');
const CashbackTransaction = require('./transactions/cashback_transaction');

const app = new Application(genesisBlockDevnet, {
	app: {
		label: 'my-app',
		minVersion: '0.0.0',
		version: '0.0.0',
		protocolVersion: '0.0',
	},
	modules: {
		chain: {
			forging: {
				force: true,
				delegates: [
					{
						encryptedPassphrase: 'iterations=1&salt=476d4299531718af8c88156aab0bb7d6&cipherText=663dde611776d87029ec188dc616d96d813ecabcef62ed0ad05ffe30528f5462c8d499db943ba2ded55c3b7c506815d8db1c2d4c35121e1d27e740dc41f6c405ce8ab8e3120b23f546d8b35823a30639&iv=1a83940b72adc57ec060a648&tag=b5b1e6c6e225c428a4473735bc8f1fc9&version=1',
						publicKey: '9d3058175acab969f41ad9b86f7a2926c74258670fe56b37c429c01fca9f2f0f',
					},
					{
						encryptedPassphrase: 'iterations=1&salt=fd0f3c5267f321001b30bd75839bdf98&cipherText=9a32f838bb3d9849e841455e5b4ac799ca39fcda2ff4b2f868113cba6487690546416b1e9f606df80e720a3cc12f12fe44968d6c96c3ba76fc6ef66ef5b00bcf52f808d15bf6714a4b89841f&iv=3d422f7cbe6f282f85fe6672&tag=6d07b5b1a11acb263627b783227a4196&version=1',
						publicKey: '141b16ac8d5bd150f16b1caa08f689057ca4c4434445e56661831f4e671b7c0a',
					},
					{
						encryptedPassphrase: 'iterations=1&salt=406a1a836699a0e0995a340cf8c68e89&cipherText=9b071ed3623a3a144b146d7e7ceebb28edd6da42590b339fe5a455b79beb2c25b87eb6194f73d8e57c39721295de2af7dfac972952d1b5c963cca14f4fa6cce68cb72cdae51f16131db0bcd5fa3e&iv=9d1c1763e7b5d53bf2ae230b&tag=ef84e213896a68742435dab2ea91523a&version=1',
						publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135',
					},
					{
						encryptedPassphrase: 'iterations=1&salt=6c4891b587ba61542ef4975c94a34c7d&cipherText=9ef6b1c252a7f901b889dc7bfd5a0a65d4529bb79629d3066e20c9a5835c229ee731158ee1299739aafd0634ca71c297086e83d81e16384efbc02b6ca0d5bf6d211a4ebc27c8815159&iv=5eab1ce106ac14f67d0b5295&tag=d7274cab49cc7eae9f7c55a32cc3d822&version=1',
						publicKey: '5d28e992b80172f38d3a2f9592cad740fd18d3c2e187745cd5f7badf285ed819',
					},
				],
				defaultPassword: 'elephant tree paris dragon chair galaxy',
			},
		}
	}
});

app.registerTransaction(9, CashbackTransaction);

app
	.run()
	.then(() => app.logger.info('App started...'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(1);
	});
