import { RefObject } from 'react';
export declare type KeyPredicate = (event: KeyboardEvent) => boolean;
export declare type keyType = KeyboardEvent['keyCode'] | KeyboardEvent['key'];
export declare type KeyFilter = keyType | Array<keyType> | ((event: KeyboardEvent) => boolean);
export declare type EventHandler = (event: KeyboardEvent) => void;
export declare type keyEvent = 'keydown' | 'keyup';
export declare type RefType = HTMLElement | (() => HTMLElement | null);
export declare type EventOption = {
    events?: Array<keyEvent>;
    target?: Window | RefType;
};
declare function useKeyPress<T extends HTMLElement = HTMLInputElement>(keyFilter: KeyFilter, eventHandler?: EventHandler, option?: EventOption): RefObject<T>;
export default useKeyPress;
