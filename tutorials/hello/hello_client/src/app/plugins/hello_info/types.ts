export interface HelloInfoPluginConfig {
    enablePlugin: boolean;
}

export interface Address {
    byteAddress: Buffer;
    lskAddress: string;
}

export interface Counter {
    counter: number;
}