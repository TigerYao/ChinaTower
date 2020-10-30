//
//  BasicCenterApi.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "HDBaseRequest.h"

NS_ASSUME_NONNULL_BEGIN

@interface BasicCenterApi : HDBaseRequest

/// 退出登录
- (instancetype)initWithUserLoginOut;
/// 获取分享参数
- (instancetype)initWithGetAppShareLink;

/// 用户是否升级
- (instancetype)queryUpgrade;

/// 获取用户隐私协议
- (instancetype)getPrivacyPolicyAgreement;

@end

NS_ASSUME_NONNULL_END
