declare module 'eth-ens-namehash' {
	export function hash(domain: string): string;
	export function normalize(input: string): string;
}
