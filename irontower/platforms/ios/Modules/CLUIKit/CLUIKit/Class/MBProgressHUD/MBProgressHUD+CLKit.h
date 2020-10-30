//
//  MBProgressHUD+CLKit.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/20.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <MBProgressHUD/MBProgressHUD.h>

NS_ASSUME_NONNULL_BEGIN

@interface MBProgressHUD (CLKit)

/// loading弹出框 需手动关闭
+ (instancetype)cl_showLoadingAddedTo:(UIView *)view;

/// loading弹出框 可设置文字 需手动关闭
+ (instancetype)cl_showLoadingAddedTo:(UIView *)view text:(NSString *)text;

/// toast弹出框
+ (instancetype)cl_showTextAddedTo:(UIView *)view text:(NSString *)text;

/// 失败弹出框
+ (instancetype)cl_showFailHUDAddedTo:(UIView *)view;

/// 警告弹出框
+ (instancetype)cl_showWarnHUDAddedTo:(UIView *)view;

/// 警告弹出框 可设置文字
+ (instancetype)cl_showWarnHUDAddedTo:(UIView *)view text:(NSString *)text;

/// 失败弹出框  可设置文字
+ (instancetype)cl_showFailHUDAddedTo:(UIView *)view text:(NSString *)text;

/// 成功弹出框
+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view;

/// 成功弹出框  可设置文字
+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view text:(NSString *)text;

/// 成功弹出框  可设置文字 以及弹出时间
+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view text:(NSString *)text delay:(NSTimeInterval)delay;

@end

NS_ASSUME_NONNULL_END
