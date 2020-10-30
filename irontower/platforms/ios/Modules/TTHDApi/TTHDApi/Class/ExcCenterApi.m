//
//  ExcCenterApi.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "ExcCenterApi.h"
#import "UserInfo.h"

@implementation ExcCenterApi

- (instancetype)initWithGetPostalBatteryBinding:(NSString *)code {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.getPostalBatteryBinding params:@{@"driverId": [UserInfo shareManager].userModel.driverId, @"batteryId": code}];
}

- (instancetype)initWithQueryBatteryElectricQuantity {
    
    NSMutableDictionary *params = [@{@"driverId": [UserInfo shareManager].userInfo.driverId} mutableCopy];
    NSString *batteryId = [UserInfo shareManager].userModel.batteryId;
    if (batteryId.length > 0) {
        [params setValue:batteryId forKey:@"batteryId"];
    }
    return [super initWithPOSTNoLoadingUrl:ApiConstant.queryBatteryElectricQuantity params:params];
}

- (instancetype)initWithQueryFirstTakeFlag {
     return [super initWithPOSTShowLoadingUrl:ApiConstant.queryFirstTakeFlag params:
            @{
                @"cityId": [UserInfo shareManager].userModel.cityId,
                @"driverId": [UserInfo shareManager].userModel.driverId
            }];
}

- (instancetype)exchangePowerBusiness:(NSDictionary *)params {
    MapUserModel *userInfo = [UserInfo shareManager].userModel;
    NSMutableDictionary *dictOptions = [NSMutableDictionary dictionaryWithDictionary:params];
    [dictOptions setValue:userInfo.driverId forKey:@"driverId"];
    [dictOptions setValue:userInfo.provinceId forKey:@"provinceId"];
    [dictOptions setValue:userInfo.cityId forKey:@"cityId"];
    [dictOptions setValue:userInfo.deptId forKey:@"deptId"];
    [dictOptions setValue:userInfo.orgId forKey:@"orgId"];
    [dictOptions setValue:userInfo.orgType forKey:@"orgType"];
    return [super initWithPOSTShowLoadingUrl:ApiConstant.exchangePowerBusiness params:dictOptions];
}

- (instancetype)selectRangeStationList:(NSDictionary *)params {
    MapUserModel *userInfo = [UserInfo shareManager].userModel;
    NSMutableDictionary *dictOptions = [NSMutableDictionary dictionaryWithDictionary:params];
    [dictOptions setValue:userInfo.cityId forKey:@"cityId"];
    [dictOptions setValue:userInfo.deptId forKey:@"deptId"];
    [dictOptions setValue:userInfo.provinceId forKey:@"provinceId"];
    [dictOptions setValue:userInfo.orgId forKey:@"orgId"];
    [dictOptions setValue:userInfo.orgType forKey:@"orgType"];
    return [super initWithPOSTNoLoadingUrl:ApiConstant.selectRangeStationList params:dictOptions];
}

- (instancetype)queryNetworkInfoList:(NSDictionary *)params {
    MapUserModel *userInfo = [UserInfo shareManager].userModel;
       NSMutableDictionary *dictOptions = [NSMutableDictionary dictionaryWithDictionary:params];
    [dictOptions setValue:userInfo.cityId forKey:@"cityId"];
    [dictOptions setValue:userInfo.deptId forKey:@"deptId"];
    [dictOptions setValue:userInfo.provinceId forKey:@"provinceId"];
    return [super initWithPOSTNoLoadingUrl:ApiConstant.queryNetworkInfoList params:dictOptions];
}

- (instancetype)selectRangeReturnStationList:(NSDictionary *)params {
    MapUserModel *userInfo = [UserInfo shareManager].userModel;
    NSMutableDictionary *dictOptions = [NSMutableDictionary dictionaryWithDictionary:params];
    [dictOptions setValue:userInfo.cityId forKey:@"cityId"];
    [dictOptions setValue:userInfo.deptId forKey:@"deptId"];
    [dictOptions setValue:userInfo.provinceId forKey:@"provinceId"];
    [dictOptions setValue:userInfo.orgId forKey:@"orgId"];
    [dictOptions setValue:userInfo.orgType forKey:@"orgType"];
    return [super initWithPOSTNoLoadingUrl:ApiConstant.selectRangeReturnStationList params:dictOptions];
}

- (instancetype)queryCabinetAndBatteryInfo:(NSDictionary *)params {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.queryCabinetAndBatteryInfo params:params];
}

- (instancetype)queryReturnCabinetInfo:(NSDictionary *)params {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.queryReturnCabinetInfo params:params];
}

- (instancetype)getPostalBatteryUnbound:(NSDictionary *)params {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.getPostalBatteryUnbound params:params];
}

@end
