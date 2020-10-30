import { MutableRefObject } from 'react';
export interface Options<T> {
    dom?: T | (() => T) | null;
    onEnter?: () => void;
    onLeave?: () => void;
}
declare const _default: <T extends HTMLElement = HTMLElement>(options?: Options<T> | undefined) => [boolean | undefined, (MutableRefObject<T> | undefined)?];
export default _default;
