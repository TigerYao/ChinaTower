//
//  LocationManager.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface LocationManager : NSObject

+ (instancetype)sharedManager;

- (void)checkLocationPermision;

@property (nonatomic, weak) UIViewController *viewcontroller;

// 开始单次定位
- (void)startSingleLocation:(void(^)(BMKLocation * _Nullable heading))completionBlock;

- (void)startHeading:(void(^)(CLHeading * _Nullable location))completionBlock;

@end

NS_ASSUME_NONNULL_END
