/// <reference types="react" />
import * as React from 'react';
import './style/index.less';
import ViewerProps from './ViewerProps';
export interface Point {
    x: number;
    y: number;
}
export interface ViewerCoreState {
    activeIndex: number;
    width: number;
    height: number;
    top: number;
    left: number;
    scale: number;
    imageWidth: number;
    imageHeight: number;
    touch: boolean;
    swiperDistance: number;
    touchStartTime: number;
    startScale: number;
    startX: number;
    startY: number;
    moveX: number;
    moveY: number;
    zoomCenterX: number;
    zoomCenterY: number;
    touchDistance: number;
    pinchScale: number;
    multiTouch: boolean;
}
export default class ViewerCore extends React.Component<ViewerProps, Partial<ViewerCoreState>> {
    static defaultProps: {
        visible: boolean;
        onClose: () => void;
        images: any[];
        activeIndex: number;
        zIndex: number;
    };
    prefixCls: string;
    containerWidth: number;
    containerHeight: number;
    text1: string;
    text2: string;
    constructor(props: any);
    handleBodyTouchmove: (e: any) => void;
    handleTouchStart(e: any): void;
    handleTouchMove(e: any): void;
    handleTouchEnd(e: any): void;
    resetImage(): void;
    getImageCenterXY(): {
        x: number;
        y: number;
    };
    getImgDefaultSize(imgWidth: any, imgHeight: any): {
        width: number;
        height: number;
        left: number;
        top: number;
    };
    getDistance(startPoint: Point, endPoint: Point): number;
    loadImg(activeIndex: any, firstLoad?: boolean): void;
    handleZoom(targetX: any, targetY: any, scale: any, pinchScale: any): void;
    componentDidMount(): void;
    startVisible: (activeIndex: any) => void;
    close: () => void;
    componentWillReceiveProps(nextProps: ViewerProps): void;
    render(): JSX.Element;
}
