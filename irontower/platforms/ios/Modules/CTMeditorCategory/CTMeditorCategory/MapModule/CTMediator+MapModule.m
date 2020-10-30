//
//  CTMediator+MapModule.m
//  CTMeditorCategory
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "CTMediator+MapModule.h"

@implementation CTMediator (MapModule)

//- (UIViewController *)Action_mapViewControllerWithParams:(NSDictionary *)params;

- (UIViewController *)mapModule_MapViewControllerWithParams:(NSDictionary * _Nullable )params {
    return [self performTarget:@"MapModule" action:@"mapViewControllerWithParams" params:params shouldCacheTarget:NO];
}

- (void)mapModule_initiazeBaiDuMap {
//    [self performTarget:@"MapModule" action:@"checkLocationPermisionWithParams" params:@{} shouldCacheTarget:NO];
    [self performTarget:@"MapModule" action:@"initiazeBaiDuMapWithParams" params:@{} shouldCacheTarget:NO];
}

- (void)mapModule_checkLocationPermision {
    [self performTarget:@"MapModule" action:@"checkLocationPermisionWithParams" params:@{} shouldCacheTarget:NO];
}

- (CLLocation *)mapModule_actionBMKCoordTransFromBD09ToGCJ02:(NSDictionary * _Nullable)params {
    return [self performTarget:@"MapModule" action:@"BMKCoordTransFromBD09ToGCJ02" params:params shouldCacheTarget:NO];
}

@end
