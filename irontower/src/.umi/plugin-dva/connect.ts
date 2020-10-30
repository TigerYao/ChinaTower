// @ts-nocheck
import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/aboutUs';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/addressManagement';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefund';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundCell';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/applyRefundList';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/batterySetting';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/batteryTracking';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/cabinetDoorInfo';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/carManage';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/common';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/coupon';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/couponsDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/couponsView';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/deposit';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/depositType';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/eleCabinetDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/exchangeEleDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/exchangeEleList';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/feedBack';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/forgetPassword';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/ImagePreview';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/index';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/InvateHistory';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/list';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/login';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/messageDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyName';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyPhone';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/modifyPW';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myBattery';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myCard';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrder';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrderDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myOrg';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myPoints';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/myWallet';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/news';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/newsCard';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/noNews';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/operationGuide';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/packageList';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/personalNews';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/pointsDesc';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/pointsExchange';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/powerStation';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/protocol';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/qrCodeInvate';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/realNameAuth';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/refundApply';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/refundDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/register';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/registerCode';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/rentCarDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/rentCarList';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/resetPassword';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/resetSuccess';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/searchAddress';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/serviceNetworkDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/setPassword';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/settings';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/setup';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/systemMessage';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/tradingDetail';
export * from '/Users/qinchuanlong/Movies/ZXRC/铁塔换电APP/chinaTower/irontower/src/models/userAgreement';

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ImmerReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    [key: string]: any;
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<P extends { [K in keyof P]?: string } = {}, S = LocationState> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S>;
  history: History;
  route: IRoute;
}

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<T = {}, U = {}> = React.ForwardRefRenderFunction<any, T & ConnectProps<U>>;
