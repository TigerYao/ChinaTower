//
//  UserCenterApi.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "HDBaseRequest.h"

NS_ASSUME_NONNULL_BEGIN

@interface UserCenterApi : HDBaseRequest

/// 查询用户信息
- (instancetype)initWithSelectUserInfo;

/// 更新用户信息
- (instancetype)initWithUpdateUserInfoNews:(NSDictionary *)params;

@end

NS_ASSUME_NONNULL_END
