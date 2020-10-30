//
//  Target_MapModule.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "Target_MapModule.h"
#import "MapViewController.h"
#import "LocationManager.h"
#import <MJExtension/MJExtension.h>
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>

@implementation Target_MapModule

- (UIViewController *)Action_mapViewControllerWithParams:(NSDictionary *)params {
    MapViewController *mapVC = [MapViewController new];
    if (params[@"mapTapHandle"]) {
        mapVC.mapTapHandle = params[@"mapTapHandle"];
    }
    if (params[@"sqTapHandle"]) {
        mapVC.sqTapHandle = params[@"sqTapHandle"];
    }
    
    [UserInfo shareManager].userInfo = [LoginInfo mj_objectWithKeyValues:params];
    return mapVC;
}

- (void)Action_initiazeBaiDuMapWithParams:(NSDictionary *)params {
    BMKMapManager *mapManager = [[BMKMapManager alloc] init];
    // 如果要关注网络及授权验证事件，请设定generalDelegate参数
    BOOL ret = [mapManager start:BAIDU_AK generalDelegate:nil];
    if (!ret) {
        NSLog(@"百度地图AK初始化失败");
    }
}

- (void)Action_checkLocationPermisionWithParams:(NSDictionary *)params {
    [[LocationManager sharedManager] checkLocationPermision];
}

- (CLLocation *)Action_BMKCoordTransFromBD09ToGCJ02:(NSDictionary *)location {
    CLLocation *bd09 = location[@"location"];
    CLLocationCoordinate2D coordinate2D = BMKCoordTrans(bd09.coordinate, BMK_COORDTYPE_BD09LL, BMK_COORDTYPE_COMMON);
    return [[CLLocation alloc] initWithLatitude:coordinate2D.latitude longitude:coordinate2D.longitude];
}


@end
