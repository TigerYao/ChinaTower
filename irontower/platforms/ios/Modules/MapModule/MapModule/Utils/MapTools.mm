
//
//  MapTools.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapTools.h"
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>

static CGFloat stationLastTime = 0; // 换电站上次时间
static CGFloat stationReturn = 0; // 退电上次请求时间

@implementation MapTools

+ (BMKMapPoint *)getBMKMapPoint:(NSInteger)pointCount {
    return new BMKMapPoint[pointCount];
}

+ (void)deleteTemppoints:(BMKMapPoint *)temppoints {
    delete []temppoints;
}

+ (CLLocationDistance)distanceWithPoint:(CLLocationCoordinate2D)coordinate2D otherPoint:(CLLocationCoordinate2D)otherCoordinate2D {
    BMKMapPoint point1 = BMKMapPointForCoordinate(coordinate2D);
    BMKMapPoint point2 = BMKMapPointForCoordinate(otherCoordinate2D);
    return BMKMetersBetweenMapPoints(point1,point2);
}

+ (BOOL)getStationLastTimePass {
    NSTimeInterval second = [[NSDate date] timeIntervalSince1970];
    if (stationLastTime == 0) {  return  YES; }
    return second - stationLastTime > 60 * 10;
}

+ (void)saveStationTime {
    stationLastTime = [[NSDate date] timeIntervalSince1970];
}

+ (BOOL)getReturnStationLastTimePass {
    NSTimeInterval second = [[NSDate date] timeIntervalSince1970];
    if (stationReturn == 0) {  return  YES; }
    return second - stationReturn > 60 * 10;
}

+ (void)saveReturnStationTime {
    stationReturn = [[NSDate date] timeIntervalSince1970];
}


@end
