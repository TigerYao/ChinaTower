//
//  MapTools.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface MapTools : NSObject

+ (BMKMapPoint *)getBMKMapPoint:(NSInteger)pointCount;

+ (void)deleteTemppoints:(BMKMapPoint *)temppoints;

+ (CLLocationDistance)distanceWithPoint:(CLLocationCoordinate2D)coordinate2D otherPoint:(CLLocationCoordinate2D)otherCoordinate2D;

+ (BOOL)getStationLastTimePass;
+ (void)saveStationTime;


+ (BOOL)getReturnStationLastTimePass;
+ (void)saveReturnStationTime;


@end

NS_ASSUME_NONNULL_END
