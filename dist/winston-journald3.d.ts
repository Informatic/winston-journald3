import TransportStream from 'winston-transport';
import { SyslogPrority, Journald } from 'sd-journald';
export interface Options extends TransportStream.TransportStreamOptions {
    identifier?: string;
    messageAsFinalizingFormat?: boolean;
}
export default class WinstonJournald extends TransportStream {
    journald: Journald;
    messageAsFinalizingFormat: boolean;
    constructor(options: Options);
    log(info: any, next: () => void): void;
    close(): void;
    static toString(value: any): string;
    static toPriority(level: string): SyslogPrority;
}
