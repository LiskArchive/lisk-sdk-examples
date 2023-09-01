import { CHAIN_ID_LENGTH } from 'lisk-sdk';;
import { TokenID } from './types';

const TOKEN_ID_LENGTH = 8;

export const splitTokenID = (tokenID: TokenID): [Buffer, Buffer] => {
	if (tokenID.length !== TOKEN_ID_LENGTH) {
		throw new Error(`Token ID must have length ${TOKEN_ID_LENGTH}`);
	}
	const chainID = tokenID.slice(0, CHAIN_ID_LENGTH);
	const localID = tokenID.slice(CHAIN_ID_LENGTH);

	return [chainID, localID];
};