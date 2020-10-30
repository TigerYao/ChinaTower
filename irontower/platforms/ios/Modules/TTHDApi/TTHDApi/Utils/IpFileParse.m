//
//  IpFileParse.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/10/10.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "IpFileParse.h"

@implementation IpFileParse

+ (NSString *)getIp {
    
    NSString *resultIp = @"";
    
    NSString *path = [[NSBundle mainBundle] pathForResource:@"www/baseurl.js" ofType:nil];
    NSString *text = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
    NSMutableArray *ips = [[text componentsSeparatedByString:@"\n"] mutableCopy];
    [ips removeObject:@""];
    if (ips.count == 0) {
        return resultIp;
    }
    
    for (int i = 0; i < ips.count; i ++) {
        NSString *ip = ips[i];
        ip = [ip stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
        if(![ip hasPrefix:@"//"]) {
            resultIp = ip;
        }
    }
    
    resultIp = [resultIp stringByReplacingOccurrencesOfString:@"'" withString:@"\""];
    NSMutableArray *resultIps = [[resultIp componentsSeparatedByString:@"\""] mutableCopy];
    [resultIps removeObject:@""];
    
    for (int i = 0; i < resultIps.count; i++) {
        resultIp = resultIps[i];
        resultIp = [resultIp stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
        if ([resultIp hasPrefix:@"http://"] || [resultIp hasPrefix:@"https://"]) {
            return resultIp;
        }
    }
    return  resultIp;
}


@end
