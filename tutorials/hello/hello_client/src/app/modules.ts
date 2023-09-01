/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { HelloModule } from "./modules/hello/module";
import { ReactModule } from "./modules/react/module";

export const registerModules = (app: Application): void => {
    app.registerModule(new HelloModule());
    app.registerModule(new ReactModule());
};
