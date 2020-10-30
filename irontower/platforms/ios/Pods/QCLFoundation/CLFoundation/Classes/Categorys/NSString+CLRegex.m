//
//  NSString+CLRegex.m
//  AFNetworking
//
//  Created by 秦传龙 on 2020/8/21.
//

#import "NSString+CLRegex.h"

@implementation NSString (CLRegex)

- (BOOL)phoneNumber {
    return [self regularExpression:@"^1[3-9]\\d{9}$"];
}

- (BOOL)password {
    return [self regularExpression:@"^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$"];
}

- (BOOL)telphone {
     return [self regularExpression:@"^(0[0-9]{2})\\d{8}$|^(0[0-9]{3}(\\d{7,8}))$"];
}

- (BOOL)idCard {
    return [self regularExpression:@"^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$"];
}

- (BOOL)email {
    return [self regularExpression:@"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"];
}
- (BOOL)chinaMobile {
    return [self regularExpression:@"^1(3[4-9]|4[7]|5[0-27-9]|7[28]|8[2-478])\\d{8}$)|(^1705\\d{7}$"];
}

- (BOOL)chinaUnicom {
    return [self regularExpression:@"^1(3[0-2]|4[5]|5[56]|7[156]|8[56])\\d{8}$)|(^1709\\d{7}$"];
}

- (BOOL)chinaTelecom {
    return [self regularExpression:@"^1(33|49|53|7[37]|8[019])\\d{8}$)|(^1700\\d{7}$"];
}

- (BOOL)url {
    return [self regularExpression:@"http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?"];
}

- (BOOL)regularExpression:(NSString *)regex {
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", regex];
    return [predicate evaluateWithObject:self];
}

@end
