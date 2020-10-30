/// <reference types="react" />
import * as React from 'react';
export interface ViewerCanvasProps {
    prefixCls: string;
    imgSrc: string;
    visible: boolean;
    width: number;
    height: number;
    top: number;
    left: number;
    zIndex: number;
    touch: boolean;
    translateX: number;
}
export default class ViewerCanvas extends React.Component<ViewerCanvasProps, any> {
    constructor();
    render(): JSX.Element;
}
