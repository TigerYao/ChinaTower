//
//  Target_MapModule.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface Target_MapModule : NSObject

- (UIViewController *)Action_mapViewControllerWithParams:(NSDictionary *)params;

- (void)Action_initiazeBaiDuMapWithParams:(NSDictionary *)params;

- (void)Action_checkLocationPermisionWithParams:(NSDictionary *)params;

//把百度坐标转化为国家通用坐标
- (CLLocation *)Action_BMKCoordTransFromBD09ToGCJ02:(NSDictionary *)location;
@end

NS_ASSUME_NONNULL_END
