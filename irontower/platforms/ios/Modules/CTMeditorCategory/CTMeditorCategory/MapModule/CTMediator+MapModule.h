//
//  CTMediator+MapModule.h
//  CTMeditorCategory
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <CTMediator/CTMediator.h>
#import <CoreLocation/CoreLocation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CTMediator (MapModule)

- (UIViewController *)mapModule_MapViewControllerWithParams:(NSDictionary * _Nullable )params;
// 初始化百度地图
- (void)mapModule_initiazeBaiDuMap;
// 初始化定位权限
- (void)mapModule_checkLocationPermision;

- (CLLocation *)mapModule_actionBMKCoordTransFromBD09ToGCJ02:(NSDictionary * _Nullable)params;

@end

NS_ASSUME_NONNULL_END
