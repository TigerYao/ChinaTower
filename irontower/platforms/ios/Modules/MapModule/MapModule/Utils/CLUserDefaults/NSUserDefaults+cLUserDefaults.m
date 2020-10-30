//
//  NSUserDefaults+cLUserDefaults.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "NSUserDefaults+cLUserDefaults.h"
#import <TTHDApi/TTHDApi.h>

static NSString *AgreementProtocolKey = @"AgreementProtocolKey";

@implementation NSUserDefaults (cLUserDefaults)

+ (void)cl_agreement {
    NSString *key = [AgreementProtocolKey stringByAppendingString:[UserInfo shareManager].userInfo.driverId];
    [[NSUserDefaults standardUserDefaults] setValue:@(YES) forKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (void)cl_noAgreement {
    NSString *key = [AgreementProtocolKey stringByAppendingString:[UserInfo shareManager].userInfo.driverId];
    [[NSUserDefaults standardUserDefaults] setValue:@(NO) forKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (BOOL)cl_getAgreement {
    NSString *key = [AgreementProtocolKey stringByAppendingString:[UserInfo shareManager].userInfo.driverId];
    return [[[NSUserDefaults standardUserDefaults] valueForKey:key] boolValue];
}

@end
