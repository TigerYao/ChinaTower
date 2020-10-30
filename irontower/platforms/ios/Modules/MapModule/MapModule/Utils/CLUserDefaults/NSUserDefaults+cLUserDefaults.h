//
//  NSUserDefaults+cLUserDefaults.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSUserDefaults (cLUserDefaults)

/// 保存同意协议
+ (void)cl_agreement;
/// 保存不同意协议
+ (void)cl_noAgreement;
/// 获取是否同意
+ (BOOL)cl_getAgreement;

@end

NS_ASSUME_NONNULL_END
