//
//  NSString+CLRegex.h
//  AFNetworking
//
//  Created by 秦传龙 on 2020/8/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (CLRegex)

/// 手机号码
@property (nonatomic, assign, readonly) BOOL phoneNumber;

/// 6到20位 字母和数字组成
@property (nonatomic, assign, readonly) BOOL password;

///  固话
@property (nonatomic, assign, readonly) BOOL telphone;

/// 身份证号码
@property (nonatomic, assign, readonly) BOOL idCard;

/// 电子邮箱
@property (nonatomic, assign, readonly) BOOL email;

/// 移动号码
@property (nonatomic, assign, readonly) BOOL chinaMobile;

/// 电信号码
@property (nonatomic, assign, readonly) BOOL chinaUnicom;

/// 联通号码
@property (nonatomic, assign, readonly) BOOL chinaTelecom;

/// 网址
@property (nonatomic, assign, readonly) BOOL url;

@end


NS_ASSUME_NONNULL_END
