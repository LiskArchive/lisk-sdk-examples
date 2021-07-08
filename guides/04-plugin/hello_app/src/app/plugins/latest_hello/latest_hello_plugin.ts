import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';

 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
 export class LatestHelloPlugin extends BasePlugin {
	// private _channel!: BaseChannel;

	public static get alias(): string {
		return 'latestHello';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'mona',
			version: '0.1.0',
			name: 'latestHello',
		};
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
            $id: '/plugins/plugin-latestHello/config',
            type: 'object',
            properties: {
                enable: {
                    type: 'boolean',
                },
            },
            required: [ 'enable'],
            default: {
                enable: true,
            },
        }
	}

	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public get actions(): ActionsDefinition {
		return {
            getLatestHello: () => this._hello,
		};
	}

    public async load(_: BaseChannel): Promise<void> {
	    if (this.options.enable) {
            this._logger.info('Plugin enabled: LatestHello');
            _.subscribe('hello:newHello', (info) => {
                this._hello = info;
            });
        } else {
            this._logger.info('Plugin disabled: LatestHello');
        }
	}

	public async unload(): Promise<void> {}
}
