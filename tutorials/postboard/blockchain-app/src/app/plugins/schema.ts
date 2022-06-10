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

export interface CreateUserListRequest {
	topic: string;
	addresses: string[];
}

export const createUserListRequest = {
	$id: '/lisk/userTracker/createUserListRequest',
	type: 'object',
	required: ['topic', 'addresses'],
	properties: {
		topic: {
			type: 'string',
		},
		addresses: {
			type: 'array',
			items: {
				type: 'string',
				format: 'hex',
			},
		},
	},
};

export interface DeleteUserListRequest {
	topic: string;
}

export const deleteUserListRequest = {
	$id: '/lisk/userTracker/deleteUserListRequest',
	type: 'object',
	required: ['topic'],
	properties: {
		topic: {
			type: 'string',
		},
	},
};

export interface GetUserListByTopicRequest {
	topic: string;
}

export const getUserListByTopicRequest = {
	$id: '/lisk/userTracker/getUserListByTopicRequest',
	type: 'object',
	required: ['topic'],
	properties: {
		topic: {
			type: 'string',
		},
	},
};

export interface GetUserListByAddressRequest {
	address: string;
}

export const getUserListsByAddressRequest = {
	$id: '/lisk/userTracker/getUserListsByAddressRequest',
	type: 'object',
	required: ['address'],
	properties: {
		address: {
			type: 'string',
			format: 'hex',
		},
	},
};

export const addressIndexPluginStore = {
	$id: '/lisk/userTracker/addressIndexPluginStore',
	type: 'object',
	required: ['topics'],
	properties: {
		topics: {
			fieldNumber: 1,
			type: 'array',
			items: {
				dataType: 'string',
			},
		},
	},
};

export const topicIndexPluginStore = {
	$id: '/lisk/userTracker/topicIndexPluginStore',
	type: 'object',
	required: ['addresses'],
	properties: {
		addresses: {
			fieldNumber: 1,
			type: 'array',
			items: {
				dataType: 'bytes',
			},
		},
	},
};
