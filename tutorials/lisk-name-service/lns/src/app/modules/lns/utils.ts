import { LNSNode } from './data';

export const isExpired = (node: LNSNode): boolean => {
	const currentTime = Math.ceil(new Date().getTime() / 1000);

	return currentTime > node.expiry;
};

export const isTTLPassed = (node: LNSNode): boolean => {
	const currentTime = Math.ceil(new Date().getTime() / 1000);
	const validUpdateTime = node.updatedAt + node.ttl;

	return currentTime > validUpdateTime;
};
