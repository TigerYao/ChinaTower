//
//  AppDelegate+Update.h
//  TTHD
//
//  Created by 秦传龙 on 2020/9/4.
//

#import "AppDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface AppDelegate (Update)

- (void)queryUpgrade:(BOOL)showToast;

- (UIViewController *)findVisibleViewController;

@end

NS_ASSUME_NONNULL_END
