//
//  RouterManager.h
//  TTHD
//
//  Created by 秦传龙 on 2020/8/19.
//

#import <Foundation/Foundation.h>
#import "MainViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface RouterManager : NSObject

+ (void)goWebViewWithType:(NSString *)type params:(NSDictionary *)params;

+ (void)notificationRun:(NSDictionary *)params;

@end

NS_ASSUME_NONNULL_END
