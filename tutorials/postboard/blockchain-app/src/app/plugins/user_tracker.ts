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
import { UserTrackerAcitons } from './actions';



// eslint-disable-next-line
const packageJSON = require('../package.json');

export class UserTrackerPlugin extends BasePlugin {
	private _pluginDB!: db.KVStore;
    private _action!: UserTrackerAcitons;

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get alias(): string {
		return 'userTracker';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			author: packageJSON.author,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			version: packageJSON.version,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			name: packageJSON.name,
            exportPath: __filename,
		};
	}

	public get defaults(): object {
		return {};
	}

	public get events(): EventsDefinition {
		return [];
	}

	public get actions(): ActionsDefinition {
		return {
            createUserList: this._action.createUserList.bind(this._action),
            deleteUserList: this._action.deleteUserList.bind(this._action),
            getUserListByID: this._action.getUserListByID.bind(this._action),
            getUserListsByAddress: this._action.getUserListsByAddress.bind(this._action),
        };
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async load(_channel: BaseChannel): Promise<void> {
        const dbPath = path.join(this.options.dataPath, 'tracker.db');
        this._pluginDB = new db.KVStore(dbPath);
        this._action = new UserTrackerAcitons(this._pluginDB);
	}

	public async unload(): Promise<void> {
		await this._pluginDB.close();
	}
}