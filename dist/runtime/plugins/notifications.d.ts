import { Message } from '../../types/notifications';
import type { Context } from '@nuxt/types';
export declare class Notification {
    context: Context;
    constructor(context: Context);
    call(message: Message): void;
}
