//
//  UpdateAlertView.h
//  CLUIKit
//
//  Created by 秦传龙 on 2020/9/3.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN

@interface UpdateAlertView : UIView

@property (nonatomic, assign) BOOL force; // 是否强制
@property (nonatomic, copy) NSString *version; // 版本号
@property (nonatomic, copy) NSString *content; // 内容区域

+ (instancetype)alertViewAddTo:(UIView * _Nullable )superView appId:(NSString *)appid;
- (void)show;

@end

NS_ASSUME_NONNULL_END
