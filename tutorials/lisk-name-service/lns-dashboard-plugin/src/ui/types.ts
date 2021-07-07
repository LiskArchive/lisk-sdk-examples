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

export interface AppConfig {
	applicationUrl: string;
}

export interface User {
	address: string;
	lisk32Address: string;
	publicKey: string;
	name?: string;
}

export interface Account {
	address: Buffer;
	lns: {
		ownNodes: Buffer[];
		reverseLookup: Buffer;
	};
}

export interface LNSNodeJSON {
	ownerAddress: string;
	name: string;
	ttl: number;
	expiry: number;
	records: LNSNodeRecordJSON[];
	createdAt: number;
	updatedAt: number;
}

export interface LNSNodeRecordJSON {
	type: number;
	label: string;
	value: string;
}

export interface Transaction<T = Record<string, unknown>> {
	id: string;
	senderPublicKey: string;
	moduleID: number;
	assetID: number;
	fee: string;
	asset: T;
}

export interface Block {
	header: {
		id: string;
		generatorPublicKey: string;
		height: number;
		timestamp: number;
		version: number;
	};
	payload: Transaction[];
}
