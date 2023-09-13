/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
// import { PinModule } from "./modules/pin/pin_module";
import { PostModule } from './modules/post/post_module';

export const registerModules = (app: Application): void => {
	app.registerModule(new PostModule());
};
