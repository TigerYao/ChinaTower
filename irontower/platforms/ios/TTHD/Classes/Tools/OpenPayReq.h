//
//  WxPayReq.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface OpenPayReq : NSObject

+ (void)doAPPayWithOrderString:(NSString *)orderString widthCallBack:(void(^)(NSDictionary *dict))callback ;

+ (void)doAPAuthWithOrderString:(NSString *)authInfoStr widthCallBack:(void(^)(NSDictionary *dict))callback;

+ (void)wxPayWithOrder:(NSString *)order;

@end

NS_ASSUME_NONNULL_END
