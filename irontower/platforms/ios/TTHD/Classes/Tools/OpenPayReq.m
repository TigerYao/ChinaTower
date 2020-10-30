//
//  WxPayReq.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/26.
//

#import "OpenPayReq.h"
#import <AlipaySDK/AlipaySDK.h>
#import <WXApi.h>

@implementation OpenPayReq

+ (void)doAPPayWithOrderString:(NSString *)orderString widthCallBack:(void(^)(NSDictionary *dict))callback {
   // NOTE: 调用支付结果开始支付
   [[AlipaySDK defaultService] payOrder:orderString fromScheme:@"eleTower" callback:^(NSDictionary *resultDic) {
       NSLog(@"reslut = %@",resultDic);
       if (callback) {
           callback(resultDic);
       }
   }];
}

+ (void)doAPAuthWithOrderString:(NSString *)authInfoStr  widthCallBack:(void(^)(NSDictionary *dict))callback {
    [[AlipaySDK defaultService] auth_V2WithInfo:authInfoStr
                                        fromScheme:@"eleTower"
                                          callback:^(NSDictionary *resultDic) {
        if (callback) {
            callback(resultDic);
        }
    }];
}


+ (void)wxPayWithOrder:(NSString *)order {
    
    
    NSData *data = [order dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    //调起微信支付
   PayReq* req             = [[PayReq alloc] init];
   req.partnerId           = [dict objectForKey:@"partnerId"];
   req.prepayId            = [dict objectForKey:@"prepayId"];
   req.nonceStr            = [dict objectForKey:@"nonceStr"];
   req.timeStamp           = (UInt32)[[dict objectForKey:@"timeStamp"] integerValue];
   req.package             = @"Sign=WXPay";
   req.sign                = [dict objectForKey:@"sign"];
   [WXApi sendReq:req completion:nil];
    
}


@end
