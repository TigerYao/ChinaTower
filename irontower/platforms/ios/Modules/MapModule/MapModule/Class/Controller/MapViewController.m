//
//  MapViewController.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapViewController.h"
#import "NavigatorBarConfig.h"
#import "FooterView.h"
#import "MapView.h"
#import <TTHDApi/TTHDApi.h>
#import "MapSliderView.h"
#import "PrivacyAlertView.h"
#import "MapHeaderView.h"
#import <CLUIKit/CLUIKit.h>
#import "Utils.h"
#import "LocationManager.h"
#import "NetworkModel.h"
#import "StationListModel.h"
#import "StationDetailModel.h"
#import "MapTools.h"



typedef NS_ENUM(NSInteger, QRCodeType) {
    QRCodeTypePostal, // 邮政
    QRCodeTypePostalUnbind, // 邮政解绑
    QRCodeTypeExchange, // 换电
    QRCodeTypeOldBattery, // 旧电池
    QRCodeTypeFirst, // 首放
    
};

@interface MapViewController ()<MapViewDelegate>

@property (nonatomic, strong) MapView *mapView;

@property (nonatomic, strong) NavigatorBarConfig *navBarConfig;

@property (nonatomic, strong) MapSliderView *sliderView;

@property (nonatomic, strong) MapHeaderView *headerView;

@property (nonatomic, assign) BOOL isToScan;  // 是否能跳转到扫码页面

@property (nonatomic, assign) QRCodeType codeType; // 二维码类型

@property (nonatomic, copy) NSString *cabinetId; // 电柜Id，扫旧电池时需要扫码

@property (nonatomic, strong) NSTimer *batteryElectricTimer;  // 查询电池电量信息定时器

@property (nonatomic, assign) ITypeSwitchViewType switchViewType;

@end

@implementation MapViewController

- (void)didInitialize {
    [super didInitialize];
    self.isToScan = YES;
    self.switchViewType = ITypeSwitchViewTypeStation;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sqCodeResult:) name:@"NSNotificationNameSqCode" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(receiveHtml5Msg:) name:@"notificationNative" object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appLogout) name:@"AppLogout" object:nil];
    self.view.backgroundColor = [UIColor whiteColor];
    self.navigationController.navigationBar.translucent = NO;
    [self configNavBar];
    [self initializeMapView];
    [self initializeFooterView];
//    [self updateUserInfo];
    [self initializeHeaderView];
    
}


-(void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.mapView viewWillAppear:animated];
    [self createBatteryElectricTimer];
    [self privacyAlertView];
    [self.navigationController.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
    self.navigationController.navigationBar.shadowImage = [UIImage new];
    self.isToScan = YES;
    [self updateUserInfo];
    [self startQueryBatteryElectricQuantity];
}

-(void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.mapView viewWillDisappear:animated];
    [self invalidateBatteryElectricTimer];
}

- (void)createBatteryElectricTimer {
    [self invalidateBatteryElectricTimer];
    if (!self.batteryElectricTimer) {
        self.batteryElectricTimer = [NSTimer timerWithTimeInterval:60 * 3 target:self selector:@selector(startQueryBatteryElectricQuantity) userInfo:nil repeats:YES];
        [[NSRunLoop currentRunLoop] addTimer:self.batteryElectricTimer forMode:NSRunLoopCommonModes];
    }
}

- (void)invalidateBatteryElectricTimer {
    if (self.batteryElectricTimer) {
        [self.batteryElectricTimer invalidate];
        self.batteryElectricTimer = nil;
    }
}

#pragma mark --- 接受到H5端的消息
- (void)receiveHtml5Msg:(NSNotification *)noti {
    NSDictionary *params = noti.userInfo;
    if ([params[@"key"] isEqualToString:@"updateUser"]) {
        [self updateUserInfo];
    } else if ([params[@"key"] isEqualToString:@"updateAnnotation"]) {
        [self requestMsg];
    }
}



#pragma mark --- 扫码逻辑
- (void)startOpenSqcode {
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    if ([userModel.driverType isEqualToString:@"5"]) { // 邮政扫码
        self.codeType = QRCodeTypePostal;
        if (self.mapTapHandle) {
            self.mapTapHandle(MapViewControllerTapSQCode, @{@"title": @"扫码换电"});
        }
        return;
    }
    // 实名校验
    if (![userModel.certification isEqualToString:@"1"]) {
        self.isToScan = NO;
        [Utils showAlertViewController:@"温馨提示" content:@"您尚未实名认证,是否实名认证?" cancelBtn:@"取消" okeyBtn:@"确认" okbtnHandle:^{
             [self exportOtherModule:MapViewControllerTapOnlineAuth];
        } viewController:self];
        return;
    } else if ([userModel.driverType isEqualToString:@"0"]) {
        [self cheackIfPayDeposit];
        if (self.isToScan) {
            [self checkPackageId];
        }
    } else if ([userModel.driverType isEqualToString:@"1"]) {
        // 押金担保 不校验用户押金，只校验用户服务费
        [self checkPackageId];
    
    } else if ([userModel.driverType isEqualToString:@"2"]) {
        // 服务费担保 校验用户押金不校验用户服务费
         [self cheackIfPayDeposit];
    } else if ([userModel.driverType isEqualToString:@"3"]) {
        // 全额(押金/服务费)担保 用户扫码不校验押金和服务费
    }
    
    if (self.isToScan) {
        if ([UserInfo shareManager].hasBattery) {
            self.codeType = QRCodeTypeExchange;
            if (self.mapTapHandle) {
                self.mapTapHandle(MapViewControllerTapSQCode, @{@"title": @"扫码换电"});
            }
        } else {
             self.codeType = QRCodeTypeFirst;
            // 首放标识查询
            [self queryFirstTakeFlag];
        }
    }
}

#pragma mark --- 扫码后回调字符串
- (void)sqCodeResult:(NSNotification *)notification {
    NSString *result = notification.object;
    switch (self.codeType) {
        case QRCodeTypePostal:
            [self openPostalBattery:result]; // 邮政
            break;
        case QRCodeTypeExchange:
        case QRCodeTypeFirst:
            [self qrcodeReq:result];
            break;
        case QRCodeTypeOldBattery:
            [self qrcodeReqOldBattery:result];
            break;
        case QRCodeTypePostalUnbind:
            [self qrcodeReqPostalUnbind:result];
            break;
        
        default:
            break;
    }
}

/// 邮政解绑
- (void)qrcodeReqPostalUnbind:(NSString *)code {
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] getPostalBatteryUnbound:@{
        @"batteryId": code,
        @"driverId":[UserInfo shareManager].userModel.driverId
    }];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [self.batteryElectricTimer setFireDate:[NSDate distantPast]];
        if (model && model[@"description"]) {
            [MBProgressHUD cl_showTextAddedTo:self.view text: model[@"description"]];
        }
    } failure:nil];
}

/// 打开邮政柜子
- (void)openPostalBattery:(NSString *)code {
    self.codeType = QRCodeTypePostal;
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] initWithGetPostalBatteryBinding:code];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:self.view animated:YES];
        [self startQueryBatteryElectricQuantity];
        if (model && model[@"description"]) {
            [MBProgressHUD cl_showTextAddedTo:self.view text: model[@"description"]];
        }
    } failure:nil];
}

/// 扫码网络解析
- (void)qrcodeReq:(NSString *)code {
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    NSString *sqcode = [Utils getQrcodeStr:code];
    if (sqcode) {
        // 发起网络请求
        ExcCenterApi *excApi = [[ExcCenterApi alloc] exchangePowerBusiness:@{
            @"batteryMarking": @"0",
            @"batteryVolts": userModel.batteryVolts?:@"",
            @"cabinetId": sqcode
        }];
        [excApi startRequestWithCompletionBlockWithSuccess:^(NSDictionary * _Nonnull model, YTKBaseRequest * _Nonnull request) {
            NSString *code = model[@"code"];
            NSString *msg = model[@"msg"];
            if ([code isEqualToString:@"1"]) {
                if ([msg isEqualToString:@"扫机柜成功请扫电池"]) {
                    //旧电池逻辑
                    [self oldBatteryOpenQrcode:sqcode];
                } else {
                    [MBProgressHUD cl_showSuccessHUDAddedTo:self.view text:msg];
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                        // 查询电池信息
                        [self startQueryBatteryElectricQuantity];
                    });
                }
            } else if ([UserInfo shareManager].hasBattery && [code isEqualToString:@"2"]) {
                [MBProgressHUD cl_showSuccessHUDAddedTo:self.view text:msg];
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    // 查询电池信息
                    [self startQueryBatteryElectricQuantity];
                });
            } else {
                [MBProgressHUD cl_showFailHUDAddedTo:self.view text:msg];
            }
            
        } failure:^(NSError * _Nonnull error, YTKBaseRequest * _Nonnull request) {
            [MBProgressHUD cl_showFailHUDAddedTo:self.view text:error.localizedDescription];
        }];
    }
}

/// 扫描旧电池打开扫码
- (void)oldBatteryOpenQrcode:(NSString *)cabinetId {
    self.codeType = QRCodeTypeOldBattery;
    self.cabinetId = cabinetId;
    if (self.mapTapHandle) {
        self.mapTapHandle(MapViewControllerTapSQCode, @{@"title": @"扫码换电"});
    }
}

/// 扫描旧电池
- (void)qrcodeReqOldBattery:(NSString *)text {
    NSString *sqcode = [Utils getQrcodeStr:text];
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    
    if (sqcode) {
        ExcCenterApi *excApi = [[ExcCenterApi alloc] exchangePowerBusiness:@{
            @"batteryVolts": userModel.batteryVolts?:@"",
            @"cabinetId": self.cabinetId?:@"",
            @"batteryId": sqcode
        }];
        
        [excApi startRequestWithCompletionBlockWithSuccess:^(NSDictionary * _Nonnull model, YTKBaseRequest * _Nonnull request) {
            NSString *code = model[@"code"];
            NSString *msg = model[@"msg"];
            
            if ([code isEqualToString:@"1"]) {
                [MBProgressHUD cl_showSuccessHUDAddedTo:self.view text:msg];
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    // 查询电池信息
                    [self startQueryBatteryElectricQuantity];
                });
            } else {
                [MBProgressHUD cl_showFailHUDAddedTo:self.view text:msg];
            }
        } failure:nil];
    }
}

/// 查询电池电量信息
- (void)startQueryBatteryElectricQuantity {
    LoginInfo *userModel = [UserInfo shareManager].userInfo;
    // 未实名
    if (![userModel.certification isEqualToString:@"1"]) {
        return;
    }
    [self queryBatteryElectricQuantity];
}


/**
*  校验押金
*/
- (void)cheackIfPayDeposit {
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    NSString *ifPayDeposit = userModel.ifPayDeposit;
    if ([ifPayDeposit isEqualToString:@"0"]) {
        self.isToScan = NO;
       [Utils showAlertViewController:@"温馨提示" content:@"您尚未缴纳押金,是否前往缴纳?" cancelBtn:@"取消" okeyBtn:@"确认" okbtnHandle:^{
            [self exportOtherModule:MapViewControllerTapMyWallet];
        } viewController:self];
    }
}

/**
* 校验服务费
*/
- (void)checkPackageId {
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    NSInteger availableDays = userModel.availableDays;
    
    if (!availableDays || availableDays <= 0) {
        self.isToScan = NO;
        [Utils showAlertViewController:@"温馨提示" content:@"您尚未缴费,是否前往缴费?" cancelBtn:@"取消" okeyBtn:@"确认" okbtnHandle:^{
            [self exportOtherModule:MapViewControllerTapMyWallet];
        } viewController:self];
    }
}

#pragma mark --- 退出登录
- (void)requestLoginout {
    BasicCenterApi *basicApi = [[BasicCenterApi alloc] initWithUserLoginOut];
    [basicApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [[UserInfo shareManager] initialUserInfo];
        [self appLogout];
    } failure:^(NSError * _Nonnull error, YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:self.view animated:YES];
    }];
}

- (void)appLogout {
     [self exportOtherModule:MapViewControllerTapLoginout];
}


#pragma mark --- 获取个人信息
- (void)updateUserInfo {
    UserCenterApi *centerApi = [[UserCenterApi alloc] initWithSelectUserInfo];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(NSDictionary *  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"TTHDNotificationNameUpdateUserInfo" object:model];
        // 1. App每次更新校验 phoneOs appVersion 两个字段是否相同，不通情况则更新
        NSDictionary *params = [Utils needUpdateUserInfo:model];
        if (params.allKeys.count > 0) {
            [self updateUserInfoNews:params openScan:NO];
        }
        [UserInfo shareManager].userModel = [MapUserModel mj_objectWithKeyValues:model];
        [self updateAllViews];
       
    } failure:nil];
}

#pragma mark ---- SelectRangeStationList 查询范围内站点列表
- (void)selectRangeStationList:(CLLocationCoordinate2D )coordinate {
    
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] selectRangeStationList:@{
        @"stationLatitude": [NSString stringWithFormat:@"%lf", coordinate.latitude],
        @"stationLongitude": [NSString stringWithFormat:@"%lf", coordinate.longitude],
        @"stationStatus": @"1",
        @"stationType": [Utils getStationType]
    }];
    [centerApi setModelName:@"StationListModel"];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [MapTools saveStationTime];
        [self.mapView addStationPointData:model];
    } failure:nil];
}

- (void)queryReturnStationList:(CLLocationCoordinate2D )coordinate {
    
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] selectRangeReturnStationList:@{
        @"stationLatitude": [NSString stringWithFormat:@"%lf", coordinate.latitude],
        @"stationLongitude": [NSString stringWithFormat:@"%lf", coordinate.longitude],
        @"stationStatus": @"1",
        @"stationType": [Utils getStationType]
    }];
    [centerApi setModelName:@"StationListModel"];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(NSArray * _Nonnull modellist, YTKBaseRequest * _Nonnull request) {
        
//       转化一下字段名称和换电站一样
        NSMutableArray *resultArr = [NSMutableArray new];
        for (int i = 0; i < modellist.count; i++) {
            StationListModel *model = modellist[i];
            for (int j = 0; j < model.bsCabinetResponseList.count; j++) {
                BsCabinetResponseListInfo *info = model.bsCabinetResponseList[j];
                info.fullCount = info.emptyCabinCount;
            }
            
            [resultArr addObject:model];
        }
        
        [self.mapView addStationPointData:resultArr];
        [MapTools saveReturnStationTime];
    } failure:nil];
    
    
}

- (void)queryServiceNetworkList {
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] queryNetworkInfoList:@{
        @"nodeType": @"1"
    }];
    [centerApi setModelName:@"NetworkModel"];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(NetworkModel *_Nonnull model, YTKBaseRequest * _Nonnull request) {
        [self.mapView addNetworkPointData:model.bsNetworkInfoList];
    } failure:nil];
}


#pragma mark --- 查询电池电量信息
- (void)queryBatteryElectricQuantity {
    
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] initWithQueryBatteryElectricQuantity];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull batteryInfo, YTKBaseRequest * _Nonnull request) {
        if (![batteryInfo isKindOfClass:[NSNull class]]) {
            // 如果没电池就不要再查了
            [self.batteryElectricTimer setFireDate:[NSDate distantFuture]];
            self.navBarConfig.batteryView.hidden = NO;
            [self.navBarConfig.batteryView setPercent:[batteryInfo[@"currentCapacity"] doubleValue]];
            self.navBarConfig.batteryView.isoutLine = ([batteryInfo[@"onlineStatus"] isEqualToString:@"0"] || !batteryInfo[@"onlineStatus"]);
            [UserInfo shareManager].batteryInfo = batteryInfo;
        } else {
            self.navBarConfig.batteryView.hidden = YES;
             [UserInfo shareManager].batteryInfo = nil;
        }
    } failure:nil];
}

#pragma mark --- 首放标识查询
- (void)queryFirstTakeFlag {
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] initWithQueryFirstTakeFlag];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(NSDictionary * _Nonnull res, YTKBaseRequest * _Nonnull request) {
        
        if (res && [res[@"ifPermitTake"] isEqualToString:@"0"]) {
            
            if ([res[@"firstTakeFlag"] isEqualToString:@"1"]) {
                // 弹出用户选择
                [self showActionViewController];
            } else {
                self.codeType = QRCodeTypeFirst;
                if (self.mapTapHandle) {
                    self.mapTapHandle(MapViewControllerTapSQCode, @{@"title": @"扫码换电"});
                }
            }
        } else {
            [Utils showAlertViewController:@"温馨提示" content:@"本地市暂不支持首放功能，如有疑问，请咨询客服10096。" cancelBtn:@"" okeyBtn:@"确认" okbtnHandle:nil viewController:self];
        }
        
    } failure:nil];
}

// 更新用户信息
- (void)updateUserInfoNews:(NSDictionary *)params openScan:(BOOL)openScan{
    UserCenterApi *centerApi = [[UserCenterApi alloc] initWithUpdateUserInfoNews:params];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        
        if (openScan) {
            
            if ([params.allKeys containsObject:@"batteryVolts"]) {
                MapUserModel *userModel = [UserInfo shareManager].userModel;
                userModel.batteryVolts = params[@"batteryVolts"];
            }
            
            self.codeType = QRCodeTypeFirst;
            if (self.mapTapHandle) {
                self.mapTapHandle(MapViewControllerTapSQCode, @{@"title": @"扫码换电"});
            }
        }
        
    } failure:nil];
}

- (void)queryCabinetAndBatteryInfo:(StationListModel *)model {
    
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] queryCabinetAndBatteryInfo:@{@"stationId":model.stationId}];
    [centerApi setModelName:@"StationDetailModel"];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull detailModel, YTKBaseRequest * _Nonnull request) {
        [self.mapView addPolylineViewsShowPopView:detailModel model:model];
    } failure:nil];
    
}

- (void)queryReturnCabinetInfo:(StationListModel *)model {
    ExcCenterApi *centerApi = [[ExcCenterApi alloc] queryReturnCabinetInfo:@{@"stationId":model.stationId}];
      [centerApi setModelName:@"StationDetailModel"];
      [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull detailModel, YTKBaseRequest * _Nonnull request) {
          [self.mapView addPolylineViewsShowPopView:detailModel model:model];
      } failure:nil];
}

- (void)queryUpgrade {
    if (self.mapTapHandle) {
        self.mapTapHandle(MapViewControllerTapCheckUpdate, @{});
    }
    
//    NSDictionary *model = [UserInfo shareManager].updateModel;
//    if (model) {
//        if ([UserInfo shareManager].isUpdate) {
//            [self showUpdateView:model];
//        } else {
//            [MBProgressHUD cl_showTextAddedTo:nil text:@"您目前版本为最新版本"];
//        }
//    } else {
//        BasicCenterApi *centerApi = [[BasicCenterApi alloc] queryUpgrade];
//        [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
//            BOOL isUpdate = [self compareVersion:model[@"appVersion"] appVersion:[UIDevice appVersion]];
//            [UserInfo shareManager].isUpdate = isUpdate;
//            if (isUpdate) {
//                [self showUpdateView:model];
//            }
//        } failure:nil];
//    }
    
}

- (BOOL)compareVersion:(NSString *)appStoreVersion appVersion:(NSString *)appVersion {
    NSMutableArray *appStoreVersionList = [[appStoreVersion componentsSeparatedByString:@"."] mutableCopy];
    NSMutableArray *appVersionList = [[appVersion componentsSeparatedByString:@"."] mutableCopy];
    // 位数不同，就补位
    if (appStoreVersionList.count > appVersionList.count) {
        for (int i = 0; i < appStoreVersionList.count - appVersionList.count; i++) {
            [appVersionList addObject:@"0"];
        }
    } else {
        for (int i = 0; i < appStoreVersionList.count - appVersionList.count; i++) {
            [appStoreVersionList addObject:@"0"];
        }
    }
    NSUInteger count = appStoreVersionList.count;
    for (int i = 0; i < count; i++) {
        NSInteger appstoreNumber = [appStoreVersionList[i] integerValue];
        NSInteger appVersionNumber = [appVersionList[i] integerValue];
        if (appstoreNumber > appVersionNumber ) {
            // 需要更新
            return YES;
        }
    }
    
    return NO;
}

- (void)showUpdateView:(NSDictionary *)model {
    UIWindow *window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    [window makeKeyAndVisible];
    UpdateAlertView *alertView = [UpdateAlertView alertViewAddTo:window appId:@"1514351725"];
    alertView.version = [NSString stringWithFormat:@"V%@", model[@"appVersion"]];
    alertView.content = model[@"upgradeDescribe"];
    alertView.force = [model[@"isForceUpgrade"] isEqual:@"1"];
    [alertView show];
}



- (void)updateAllViews {
    [self.navBarConfig updateNavigatorBar];
    [self.sliderView updateSliderView];
    [self updateHeaderView];
}

- (void)privacyAlertView {
    if (![NSUserDefaults cl_getAgreement]) {
        PrivacyAlertView *alertView = [[PrivacyAlertView alloc] initWithFrame:self.view.bounds controller:self];
        [alertView show];
    }
}

- (void)configNavBar {
    __weak typeof(self) weakSelf = self;
    
    self.navBarConfig = [[NavigatorBarConfig alloc] initWithViewController:self];
    [self.navBarConfig setMsgItemClick:^(QMUIButton * _Nonnull msgItem) {
         [weakSelf exportOtherModule:MapViewControllerTapMessage];
    }];

    [self.navBarConfig setLeftItemClick:^(QMUIButton * _Nonnull leftItem) {
        MapSliderView *sliderView = [[MapSliderView alloc] initWithController:weakSelf];
        [sliderView setLogoutHandle:^{
            [weakSelf requestLoginout];
        }];
        [sliderView setTelCustomerOnLineHandle:^{
            [weakSelf mapViewTelCustomClick];
        }];
        [sliderView setPostalBatteryUnbound:^{
            weakSelf.codeType = QRCodeTypePostalUnbind;
            [weakSelf exportOtherModule:MapViewControllerTapSQCode];
        }];
        [sliderView setCheckUpdate:^{
            [weakSelf queryUpgrade];
        }];
        [sliderView open];
    }];

    [self.navBarConfig setBatteryItemClick:^() {
        [weakSelf exportOtherModule:MapViewControllerTapBattery];
    }];
}

- (void)exportOtherModule:(MapViewControllerTapType)type {
    if (self.mapTapHandle) {
        self.mapTapHandle(type, nil);
    }
}

- (void)initializeMapView {
    CGRect frame = self.view.bounds;
    frame.origin.y += NavigationContentTop;
    frame.size.height -= (NavigationContentTop +94);
    self.mapView = [[MapView alloc] initWithFrame:frame viewController:self];
    self.mapView.delegate = self;
    [self.view addSubview:self.mapView];
}

- (void)initializeFooterView {
    __weak typeof(self) weakSelf = self;
    FooterView *footerView = [[FooterView alloc] initWithHandle:^(QMUIButton * _Nonnull sender) {
        [weakSelf startOpenSqcode];
    }];
    [self.view addSubview:footerView];
    [footerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.bottom.mas_equalTo(0);
        make.height.mas_equalTo(94);
    }];
}


#pragma mark --  更新头部视图
- (void)updateHeaderView {
    MapUserModel *userModel = [UserInfo shareManager].userModel;
    if (![userModel.certification isEqualToString:@"1"]) {
        self.headerView.hidden = NO;
        self.headerView.headerViewType = MapHeaderViewTypeAuth;
        self.headerView.tipsLabel.text = @"完成身份认证，可进行换电服务";
        self.headerView.btnTitle = @"立即认证";
    } else if (userModel.packageId && userModel.availableDays < 3) {
        self.headerView.hidden = NO;
        NSString *tips = userModel.availableDays <= 0 ? @"您的月卡已到期, 请续费" : [NSString stringWithFormat:@"您的月卡套餐还剩%ld天到期",(long)userModel.availableDays];
        self.headerView.headerViewType = MapHeaderViewTypeExpire;
        self.headerView.tipsLabel.text = tips;
        self.headerView.btnTitle = @"立即续费";
    }
}

- (void)initializeHeaderView {
    MapHeaderView *headerView = [[MapHeaderView alloc] initWithController:self];
    headerView.hidden = YES;
    __weak typeof(self) weakSelf = self;
    [headerView setHeaderViewBtnTap:^(MapHeaderViewType type) {
        if (type == MapHeaderViewTypeAuth) {
            [weakSelf exportOtherModule:MapViewControllerTapOnlineAuth];
        } else if (type == MapHeaderViewTypeExpire) {
            [weakSelf exportOtherModule:MapViewControllerTapPackageList];
        }
    }];
    [self.mapView addSubview:headerView];
    self.headerView = headerView;
}

#pragma mark --- 隐藏导航条
- (BOOL)preferredNavigationBarHidden {
    return NO;
}

- (void)showActionViewController {
    UIAlertController *alertViewController = [UIAlertController alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    [alertViewController addAction:[UIAlertAction actionWithTitle:@"48V" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [self updateUserInfoNews:@{
            @"batteryVolts":@"48",
            } openScan:YES];
    }]];
    [alertViewController addAction:[UIAlertAction actionWithTitle:@"60V" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        [self updateUserInfoNews:@{
            @"batteryVolts":@"60",
            } openScan:YES];
    }]];
    [alertViewController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alertViewController animated:YES completion:nil];
    
}

#pragma mark --- delegate
- (void)startSingleLocation:(BMKLocation *)location {
    [self selectRangeStationList:location.location.coordinate];
}

- (void)startRefresh {
    [self requestMsg];
}

- (void)requestMsg {
    [[LocationManager sharedManager] startSingleLocation:^(BMKLocation * _Nullable location) {
        [self.mapView setCenterCoordinate:location zoom:16];
        if (self.switchViewType == ITypeSwitchViewTypeService) {
            // 服务网点
            [self queryServiceNetworkList];
        } else if (self.switchViewType == ITypeSwitchViewTypeStation) {
            // 换站点
            [self selectRangeStationList:location.location.coordinate];
        } else if (self.switchViewType == ITypeSwitchViewTypeElectricityBack){
            // 退电指引
            [self queryReturnStationList:location.location.coordinate];
        }
    }];
}


- (void)mapView:(MapView *)view switchType:(ITypeSwitchViewType)type {
    self.switchViewType = type;
    [self requestMsg];
}

- (void)mapView:(MapView *)view centerDidChangeFinish:(CLLocationCoordinate2D)coordinate2D {
    
    switch (self.switchViewType) {
        case ITypeSwitchViewTypeStation:
        {
             [self selectRangeStationList:coordinate2D];
        }
            break;
        case ITypeSwitchViewTypeElectricityBack:
            [self queryReturnStationList:coordinate2D];
            break;
        default:
            break;
    }
}

- (void)mapViewClickStationAnnotationView:(MapView *)view model:(StationListModel *)model {
    if (self.switchViewType == ITypeSwitchViewTypeStation) {
        [self queryCabinetAndBatteryInfo:model];
    }
    if (self.switchViewType == ITypeSwitchViewTypeElectricityBack) {
        [self queryReturnCabinetInfo:model];
        
    }
}

- (void)mapViewTelCustomClick {
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    [alertController addAction:[UIAlertAction actionWithTitle:@"拨打电话" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if (@available(iOS 10.0, *)) {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel:%@",TEL_NUMBER]] options:@{} completionHandler:nil];
        } else {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel:%@",TEL_NUMBER]]];
        }
    }]];
    
    [alertController addAction:[UIAlertAction actionWithTitle:@"在线客服" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        if (self.mapTapHandle) {
            
            
            self.mapTapHandle(MapViewControllerTapOnlineCustom, @{
                @"url":[NSString stringWithFormat:@"http://im5.7x24cc.com/phone_webChat.html?accountId=N000000022137&chatId=8bd6ba4a-1b03-4813-bae4-e269b7192c57&phone=%@&nickName=%@(%@%@)", [UserInfo shareManager].userModel.phoneNumber, [UserInfo shareManager].userModel.realName, [UserInfo shareManager].userModel.provinceName, [UserInfo shareManager].userModel.cityName],
                @"title":@"客服服务"});
        }
    }]];
    
    [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alertController animated:YES completion:nil];
}


- (void)dealloc {
    [self.mapView removeFromSuperview];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    NSLog(@"内存 已释放");
}

@end
