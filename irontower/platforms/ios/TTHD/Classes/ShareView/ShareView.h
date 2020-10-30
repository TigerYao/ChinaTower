//
//  ShareView.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/25.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ShareView : NSObject

+ (instancetype)shareManager;

- (void)shareToPlatformWithParams:(NSDictionary *)dict;

@end

NS_ASSUME_NONNULL_END
