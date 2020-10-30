//
//  BasicCenterApi.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "BasicCenterApi.h"
#import "UserInfo.h"

@implementation BasicCenterApi

- (instancetype)initWithUserLoginOut {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.userLoginOut params:@{
        @"phone": [UserInfo shareManager].userInfo.phoneNumber,
        @"userId": [UserInfo shareManager].userInfo.driverId,
        @"driverId": [UserInfo shareManager].userInfo.driverId
    }];
}

- (instancetype)initWithGetAppShareLink {
    return [super initWithUrl:ApiConstant.getAppShareLink params:@{} method:YTKRequestMethodGET hud:YES];
}

- (instancetype)queryUpgrade {
    return [super initWithPOSTNoLoadingUrl:ApiConstant.queryUpgrade params:@{
        @"appCode": @"exchange_ios"
    }];
}

- (instancetype)getPrivacyPolicyAgreement {
    return [super initWithPOSTShowLoadingUrl:ApiConstant.getAgreement params:@{
        @"type": @"privacyPolicy_agreement"
    }];
}

@end
