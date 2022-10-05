/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { HelloModule } from "./modules/hello/module";

// @ts-expect-error app will have typescript error for unsued variable
export const registerModules = (app: Application): void => {

    app.registerModule(new HelloModule());
};
