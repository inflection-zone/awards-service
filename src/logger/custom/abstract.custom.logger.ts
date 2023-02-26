import { AbstrctLogger } from '../abstract.logger';
import fs from 'fs';

///////////////////////////////////////////////////////////////////////

export abstract class AbstrctCustomLogger extends AbstrctLogger {

    _useConsole = true;

    _stream = fs.createWriteStream(this._logFile, {
        'flags'    : 'a',
        'encoding' : null,
        'mode'     : 0o666
    });

    constructor() {
        super();
    }

}
