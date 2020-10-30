//
//  ApiConstant.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "ApiConstant.h"

@implementation ApiConstant

+ (NSString *)selectUserInfo {
    return @"/user/bussiness/personal/selectUserInfo";
}

+ (NSString *)selectRangeStationList {
    return @"/queryexc/bussiness/station/selectRangeStationListNew";
}

+ (NSString *)selectPronvieOrCity {
    return @"/base/public/driverRegister/selectPronvieOrCity";
}

+ (NSString *)userLoginOut {
    return @"/oauth/bussiness/login/userLoginOut";
}

+ (NSString *)getAppShareLink {
    return @"/base/public/userShare/getAppShareLink";
}

+ (NSString *)getPostalBatteryBinding {
    return @"/queryexc/bussiness/postal/getPostalBatteryBinding";
}

+ (NSString *)queryBatteryElectricQuantity {
    return @"/queryexc/bussiness/cabinet/queryBatteryElectricQuantity";
}

+ (NSString *)queryFirstTakeFlag {
    return @"/exc/bussiness/process/queryFirstTakeFlag";
}

+ (NSString *)updateUserInfo {
    return @"/user/bussiness/personal/updateUserInfo";
}

// 打开电柜
+ (NSString *)exchangePowerBusiness {
    return @"/exc/bussiness/process/exchangePowerBusiness";
}

+ (NSString *)queryNetworkInfoList {
    return @"/queryexc/bussiness/queryNetworkInfoList";
}

+ (NSString *)selectRangeReturnStationList {
    return @"/queryexc/bussiness/station/selectRangeReturnStationListNew";
}

+ (NSString *)queryCabinetAndBatteryInfo {
    return @"/queryexc/bussiness/cabinet/queryCabinetAndBatteryInfo";
}

+ (NSString *)queryReturnCabinetInfo {
    return @"/queryexc/bussiness/cabinet/queryReturnCabinetListInfo";
}

+ (NSString *)getPostalBatteryUnbound {
    return @"/queryexc/bussiness/postal/getPostalBatteryUnbound";
}

+ (NSString *)queryUpgrade {
    return @"/base/public/UpgradeAction/queryUpgrade";
}

+ (NSString *)getAgreement {
    return @"/base/public/userAgreement/getAgreement";
}



@end
