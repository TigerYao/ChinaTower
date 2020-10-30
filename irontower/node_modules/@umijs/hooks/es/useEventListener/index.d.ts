import { MutableRefObject } from 'react';
declare type Target = HTMLElement | Window;
declare type Dom = Target | (() => Target) | null;
declare function useEventListener<T extends Target = HTMLElement>(eventName: string, handler: Function, options?: {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}): MutableRefObject<T>;
declare function useEventListener<T extends Target = HTMLElement>(eventName: string, handler: Function, options?: {
    dom: Dom;
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}): void;
export default useEventListener;
