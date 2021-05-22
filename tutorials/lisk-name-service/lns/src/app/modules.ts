import { Application } from 'lisk-sdk';
import { LnsModule } from './modules/lns/lns_module';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const registerModules = (_app: Application): void => {
	_app.registerModule(LnsModule);
};
