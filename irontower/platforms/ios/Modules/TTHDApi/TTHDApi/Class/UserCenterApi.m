//
//  UserCenterApi.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "UserCenterApi.h"
#import "UserInfo.h"

@implementation UserCenterApi

- (instancetype)initWithSelectUserInfo {
    return [super initWithPOSTNoLoadingUrl:ApiConstant.selectUserInfo params:@{@"driverId": [UserInfo shareManager].userInfo.driverId}];
}

- (instancetype)initWithUpdateUserInfoNews:(NSDictionary *)params {
    NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithDictionary:params];
    [dict setValue:[UserInfo shareManager].userInfo.driverId forKey:@"driverId"];
    return [super initWithPOSTNoLoadingUrl:ApiConstant.updateUserInfo params:dict];
}

@end
