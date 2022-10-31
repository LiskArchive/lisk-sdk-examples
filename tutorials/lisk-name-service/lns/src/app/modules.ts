import { Application } from 'lisk-sdk';
import { LnsModule } from "./modules/lns/module";

export const registerModules = (app: Application): void => {
    app.registerModule(new LnsModule());
};
