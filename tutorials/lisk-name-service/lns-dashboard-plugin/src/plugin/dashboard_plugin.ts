/*
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

import {
	ActionsDefinition,
	BaseChannel,
	BasePlugin,
	EventsDefinition,
	PluginInfo,
	PluginOptionsWithAppConfig,
	SchemaWithDefault,
} from 'lisk-sdk';
import * as express from 'express';
import { join } from 'path';
import { Server } from 'http';

// eslint-disable-next-line
const packageJSON = require('../../package.json');

const configSchema = {
	$id: '#/plugins/lns-dashboard/config',
	type: 'object',
	properties: {
		applicationUrl: {
			type: 'string',
			format: 'uri',
			description: 'URL to connect',
		},
		port: {
			type: 'integer',
			minimum: 1,
			maximum: 65535,
		},
		host: {
			type: 'string',
			format: 'ip',
		},
	},
	required: [],
	default: {
		applicationUrl: 'ws://localhost:8080/ws',
		port: 4005,
		host: '127.0.0.1',
	},
};

interface LNSDashboardPluginOptions extends PluginOptionsWithAppConfig {
	applicationUrl: string;
	port: number;
	host: string;
}

export class LNSDashboardPlugin extends BasePlugin<LNSDashboardPluginOptions> {
	private _server!: Server;

	public static get alias(): string {
		return 'LnsDashboard';
	}

	public static get info(): PluginInfo {
		return {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			author: packageJSON.author,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			version: packageJSON.version,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			name: packageJSON.name,
		};
	}

	public get defaults(): SchemaWithDefault {
		return configSchema;
	}

	public get events(): EventsDefinition {
		return [];
	}

	public get actions(): ActionsDefinition {
		return {};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async load(_channel: BaseChannel): Promise<void> {
		const config = {
			applicationUrl: this.options.applicationUrl,
		};
		const app = express();
		app.use(express.static(join(__dirname, '../../build')));
		app.get('/api/config.json', (_req, res) => res.json(config));
		this._server = app.listen(this.options.port, this.options.host);
	}

	public async unload(): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			this._server.close(err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
}
