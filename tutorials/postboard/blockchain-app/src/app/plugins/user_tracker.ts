/*
 * Copyright © 2022 Lisk Foundation
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
import * as path from 'path';
import {
	ActionsDefinition,
	BasePlugin,
	BaseChannel,
	EventsDefinition,
	PluginInfo,
	db,
} from 'lisk-sdk';
import { UserTrackerActions } from './actions';

export class UserTrackerPlugin extends BasePlugin {
	private _pluginDB!: db.KVStore;
	private _action!: UserTrackerActions;

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get alias(): string {
		return 'userTracker';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'LiskHQ',
			version: '0.1.0',
			name: 'userTracker',
			exportPath: __filename,
		};
	}

	public get defaults(): Record<string, unknown> {
		return {};
	}

	public get events(): EventsDefinition {
		return [];
	}

	public get actions(): ActionsDefinition {
		return {
			createUserList: async params => this._action.createUserList(params),
			deleteUserList: async params => this._action.deleteUserList(params),
			getUserListByID: async params => this._action.getUserListByID(params),
			getUserListsByAddress: async params => this._action.getUserListsByAddress(params),
		};
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async load(_channel: BaseChannel): Promise<void> {
		const dbPath = path.join(this.options.dataPath, 'tracker.db');
		this._pluginDB = new db.KVStore(dbPath);
		this._action = new UserTrackerActions(this._pluginDB);
	}

	public async unload(): Promise<void> {
		await this._pluginDB.close();
	}
}
