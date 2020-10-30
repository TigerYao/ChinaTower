//
//  NSDate+CL.h
//  AFNetworking
//
//  Created by 秦传龙 on 2020/8/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSDate (CL)

/// 时间戳转格式化
- (NSString *)cl_timestampToFormatter:(NSString *)formatter timestamp:(NSString *)timestamp;

/// 当前时间转格式化
- (NSString *)cl_nowDateFormatter:(NSString *)formatter;

/// 时间格式化
- (NSString *)cl_formatterDate:(NSDate *)date formatter:(NSString *)formatter ;

/// 1544408230000 13位字符串
- (NSDate *)cl_timestampToDate:(NSString *)timestamp;

// 时间 -> 时间戳
- (NSTimeInterval)cl_dateToTimestamp:(NSDate *)date;

@end

NS_ASSUME_NONNULL_END
