//
//  SliderModel.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/19.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NSString *MapViewControllerTapType NS_TYPED_ENUM;


NS_ASSUME_NONNULL_BEGIN

@interface SliderModel : NSObject

@property (nonatomic, copy) NSString *icon;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, copy) NSString *routerName;
@property (nonatomic, copy) NSString *type;
@property (nonatomic, copy) MapViewControllerTapType tapType;
@property (nonatomic, assign) BOOL showRight;

@end


CA_EXTERN MapViewControllerTapType const MapViewControllerTapMessage; // 点击消息
CA_EXTERN MapViewControllerTapType const MapViewControllerTapBattery; // 点击电池
CA_EXTERN MapViewControllerTapType const MapViewControllerTapMyOrder; // 点击我的订单
CA_EXTERN MapViewControllerTapType const MapViewControllerTapSetting; // 点击设置
CA_EXTERN MapViewControllerTapType const MapViewControllerTapMyWallet;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapApplyRefundList;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapExchangeEleList;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapCarManage;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapFeedBack;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapQrCodeInvate;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapShare;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapTel;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapLoginout;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapPersonal;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapSQCode;  // 扫码
CA_EXTERN MapViewControllerTapType const MapViewControllerTapOnlineCustom; // 在线客服
CA_EXTERN MapViewControllerTapType const MapViewControllerTapOnlineAuth; // 去实名
CA_EXTERN MapViewControllerTapType const MapViewControllerTapPackageList;
CA_EXTERN MapViewControllerTapType const MapViewControllertapServiceNetworkDetail;
CA_EXTERN MapViewControllerTapType const MapViewControllertapServiceEleCabinetDetail;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapPrivacy;
CA_EXTERN MapViewControllerTapType const MapViewControllerTapCheckUpdate;


NS_ASSUME_NONNULL_END
