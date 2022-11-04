/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { HealloModule } from "./modules/heallo/module";
import { HelloModule } from "./modules/hello/module";

export const registerModules = (app: Application): void => {
    app.registerModule(new HelloModule());
    app.registerModule(new HealloModule());
};
