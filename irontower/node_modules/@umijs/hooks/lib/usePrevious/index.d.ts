export declare type compareFunction<T> = (prev: T | undefined, next: T) => boolean;
declare const _default: <T>(state: T, compare?: compareFunction<T> | undefined) => T | undefined;
export default _default;
