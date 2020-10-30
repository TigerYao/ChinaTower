//
//  Utils.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/24.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Utils : NSObject

+ (NSString *)getStationType;

+ (NSString *)getQrcodeStr:(NSString *)text;

+ (void)showAlertViewController:(NSString *)title content:(NSString *)content cancelBtn:(NSString *)cancenBtn okeyBtn:(NSString *)okeyBtn okbtnHandle:(void(^)(void))ok viewController:(UIViewController *)viewController;

//其他返回更新字段
+ (NSDictionary *)needUpdateUserInfo:(NSDictionary *)model;
@end

NS_ASSUME_NONNULL_END
