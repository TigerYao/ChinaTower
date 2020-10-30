declare const useBoolean: (defaultValue?: boolean) => {
    state: boolean;
    toggle: (value?: boolean | undefined) => void;
    setTrue: () => void;
    setFalse: () => void;
};
export default useBoolean;
