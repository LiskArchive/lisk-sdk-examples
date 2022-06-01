/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { PinModule } from "./modules/pin/pin_module";
import { PostModule } from "./modules/post/post_module";

// @ts-expect-error Unused variable error happens here until at least one module is registered
export const registerModules = (app: Application): void => {
    app.registerModule(PostModule);
};
