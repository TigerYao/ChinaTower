import { MutableRefObject } from 'react';
interface Position {
    left: number;
    top: number;
}
declare type Target = HTMLElement | Document;
declare type Arg = Target | (() => Target) | null;
declare function useScroll<T extends Target = HTMLElement>(): [Position, MutableRefObject<T>];
declare function useScroll<T extends Target = HTMLElement>(arg: Arg): [Position];
export default useScroll;
