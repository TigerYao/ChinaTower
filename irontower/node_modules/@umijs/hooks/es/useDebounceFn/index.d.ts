import { DependencyList } from 'react';
export interface ReturnValue<T extends any[]> {
    run: (...args: T) => void;
    cancel: () => void;
}
declare function useDebounceFn<T extends any[]>(fn: (...args: T) => any, wait: number): ReturnValue<T>;
declare function useDebounceFn<T extends any[]>(fn: (...args: T) => any, deps: DependencyList, wait: number): ReturnValue<T>;
export default useDebounceFn;
