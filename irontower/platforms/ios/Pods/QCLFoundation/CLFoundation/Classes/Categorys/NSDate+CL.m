//
//  NSDate+CL.m
//  AFNetworking
//
//  Created by 秦传龙 on 2020/8/21.
//

#import "NSDate+CL.h"

@implementation NSDate (CL)

- (NSString *)cl_timestampToFormatter:(NSString *)formatter timestamp:(NSString *)timestamp {
    return [self cl_formatterDate:[self cl_timestampToDate:timestamp] formatter:formatter];
}

- (NSString *)cl_nowDateFormatter:(NSString *)formatter {
    return [self cl_formatterDate:[NSDate date] formatter:formatter];
}

- (NSString *)cl_formatterDate:(NSDate *)date formatter:(NSString *)formatter {
    NSDateFormatter *form = [[NSDateFormatter alloc] init];
    [form setDateFormat:formatter];
    return [form stringFromDate:date];
}

/// 1544408230000
- (NSDate *)cl_timestampToDate:(NSString *)timestamp {
    if (timestamp) {
        return nil;
    }
    NSTimeInterval interval = [timestamp doubleValue] / 1000.0;
    return [NSDate dateWithTimeIntervalSince1970:interval];
}

- (NSTimeInterval)cl_dateToTimestamp:(NSDate *)date {
    return [date timeIntervalSince1970] * 1000;
}


@end
