//
//  UserInfo.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/19.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "UserInfo.h"

@implementation MapUserModel

@end

@implementation LoginInfo


- (void)setOrgType:(NSString *)orgType {
    _orgType = orgType ?: @"";
}

- (void)setProvinceId:(NSString *)provinceId {
    _provinceId = provinceId ?:@"";
}

- (void)setOrgId:(NSString *)orgId {
    _orgId = orgId ?: @"";
}

- (void)setCityId:(NSString *)cityId {
    _cityId = cityId ?:@"";
}

- (void)setDeptId:(NSString *)deptId {
    _deptId = deptId?:@"";
}

- (void)setIdCard:(NSString *)idCard {
    _idCard = idCard?:@"";
}



@end

@implementation UserInfo
static id info = nil;

+ (instancetype)shareManager {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        info = [UserInfo new];
    });
    return info;
}

- (void)initialUserInfo {
    info = [UserInfo new];
}

@end
