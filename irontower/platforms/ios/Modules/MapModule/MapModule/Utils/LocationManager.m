//
//  LocationManager.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "LocationManager.h"

@interface LocationManager ()<BMKLocationAuthDelegate, BMKLocationManagerDelegate>

@property (nonatomic, strong) BMKLocationManager *locationManager;

@property (nonatomic, copy) void(^completionBlock)(BMKLocation * _Nullable location);

@property (nonatomic, copy) void(^completionHeadingBlock)(CLHeading * _Nullable heading);


@end


@implementation LocationManager

+ (instancetype)sharedManager {
    static id sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self checkLocationPermision];
        _locationManager = [[BMKLocationManager alloc] init];
        //设置delegate
        _locationManager.delegate = self;
        //设置返回位置的坐标系类型
        _locationManager.coordinateType = BMKLocationCoordinateTypeBMK09LL;
        //设置距离过滤参数
        _locationManager.distanceFilter = kCLLocationAccuracyBestForNavigation;
        //设置预期精度参数
        _locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        //设置应用位置类型
        _locationManager.activityType = CLActivityTypeAutomotiveNavigation;
        //设置是否自动停止位置更新
        _locationManager.pausesLocationUpdatesAutomatically = NO;
        _locationManager.allowsBackgroundLocationUpdates = NO;// YES的话是可以进行后台定位的，但需要项目配置，否则会报错，具体参考开发文档
        _locationManager.locationTimeout = 10;
        _locationManager.reGeocodeTimeout = 10;
    }
    return self;
}

- (void)checkLocationPermision {
    [[BMKLocationAuth sharedInstance] checkPermisionWithKey:BAIDU_AK authDelegate:self];
}



- (void)startHeading:(void(^)(CLHeading * _Nullable heading))completionBlock {

    self.completionHeadingBlock = completionBlock;
    [self.locationManager startUpdatingHeading];
}

- (void)startSingleLocation:(void(^)(BMKLocation * _Nullable location))completionBlock {

    if (kCLAuthorizationStatusDenied != [CLLocationManager authorizationStatus]) {
        self.completionBlock = completionBlock;
        [_locationManager startUpdatingLocation];
    } else {
        
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"打开定位开关" message:@"定位服务未开启,请进入系统【设置】-【隐私】-【定位服务】中打开开关，并允许百度地图使用定位服务" preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction *action1 = [UIAlertAction actionWithTitle:@"去设置" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            NSURL * url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
            if([[UIApplication sharedApplication] canOpenURL:url]) {
                [[UIApplication sharedApplication] openURL:url];
            }
        }];
        UIAlertAction *action = [UIAlertAction actionWithTitle:@"我知道了" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:action1];
        [alertController addAction:action];
        if (self.viewcontroller) {
            [self.viewcontroller presentViewController:alertController animated:YES completion:nil];
        }
        
    }
    
    
}
- (void)BMKLocationManager:(BMKLocationManager * _Nonnull)manager didUpdateLocation:(BMKLocation * _Nullable)location orError:(NSError * _Nullable)error{
    
    NSLog(@"当前经纬度：%lf - %lf -- %@", location.location.coordinate.longitude, location.location.coordinate.latitude, error);
    [manager stopUpdatingLocation];
    if (self.completionBlock) {
        self.completionBlock(location);
    }
}

- (void)BMKLocationManager:(BMKLocationManager * _Nonnull)manager doRequestAlwaysAuthorization:(CLLocationManager * _Nonnull)locationManager {
    NSLog(@"%@", locationManager);
}

/**
* @brief 该方法为BMKLocationManager提供设备朝向的回调方法。
* @param manager 提供该定位结果的BMKLocationManager类的实例
* @param heading 设备的朝向结果
*/
- (void)BMKLocationManager:(BMKLocationManager * _Nonnull)manager
didUpdateHeading:(CLHeading * _Nullable)heading{
    [self.locationManager stopUpdatingHeading];
    if (self.completionHeadingBlock) {
        self.completionHeadingBlock(heading);
    }
}

/**
 *  @brief 当定位发生错误时，会调用代理的此方法。
 *  @param manager 定位 BMKLocationManager 类。
 *  @param error 返回的错误，参考 CLError 。
 */
- (void)BMKLocationManager:(BMKLocationManager * _Nonnull)manager didFailWithError:(NSError * _Nullable)error {
    NSLog(@"%@", error);
}

/**
 *  @brief 定位权限状态改变时回调函数
 *  @param manager 定位 BMKLocationManager 类。
 *  @param status 定位权限状态。
 */
- (void)BMKLocationManager:(BMKLocationManager * _Nonnull)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    NSLog(@"%ld", status);
}

@end
