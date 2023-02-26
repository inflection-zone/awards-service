import { AbstrctLogger } from '../abstract.logger';
import BunyanPrettyStream from 'bunyan-prettystream';

///////////////////////////////////////////////////////////////////////

export abstract class AbstrctBunyanLogger extends AbstrctLogger {

    _consolePrettyStream = new BunyanPrettyStream();

    constructor() {
        super();

        this._consolePrettyStream.pipe(process.stdout);
    }

}
