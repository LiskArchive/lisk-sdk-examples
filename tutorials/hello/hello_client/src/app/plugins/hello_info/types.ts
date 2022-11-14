export interface HelloInfoPluginConfig {
    enablePlugin: boolean;
}

export interface Event {
    senderAddress: Buffer;
    message: string;
    height: number;
}

export interface Counter {
    counter: number;
}

export interface Height {
    height: number;
}