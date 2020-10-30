//
//  AppDelegate+Update.m
//  TTHD
//
//  Created by 秦传龙 on 2020/9/4.
//

#import "AppDelegate+Update.h"
#import <CLUIKit/CLUIKit.h>
#import <TTHDApi/TTHDApi.h>
#import <QCLFoundation/QCLFoundation.h>
#import "Utils.h"
#import "AppDelegate.h"


@implementation AppDelegate (Update)

- (void)queryUpgrade:(BOOL)showToast {
    UIWindow *window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    if ([UIApplication sharedApplication].keyWindow) {
        window = [UIApplication sharedApplication].keyWindow;
    }
    [MBProgressHUD cl_showLoadingAddedTo:window text:@"正在检查更新..."];
    BasicCenterApi *centerApi = [[BasicCenterApi alloc] queryUpgrade];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(NSDictionary * _Nonnull model, YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:window animated:YES];

        [Utils getAppNetVersion:^(NSString * _Nonnull version) {
          // 获取appstore版本号
            NSLog(@"%@",version);
            
            BOOL isUpdate = [self compareVersion:version appVersion:[UIDevice appVersion]];
            [UserInfo shareManager].isUpdate = isUpdate;
            if (isUpdate) {
                [self showUpdateView:model];
            } else {
                if (showToast) {
                    [MBProgressHUD cl_showTextAddedTo:window text:@"您目前版本为最新版本"];
                }
            }
        }];
        
    } failure:^(NSError * _Nonnull error, YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:window animated:YES];
        [MBProgressHUD cl_showFailHUDAddedTo:window text:@"检查更新失败"];
    }];
}


- (BOOL)compareVersion:(NSString *)appStoreVersion appVersion:(NSString *)appVersion {
    NSMutableArray *appStoreVersionList = [[appStoreVersion componentsSeparatedByString:@"."] mutableCopy];
    NSMutableArray *appVersionList = [[appVersion componentsSeparatedByString:@"."] mutableCopy];
    // 位数不同，就补位
    if (appStoreVersionList.count > appVersionList.count) {
        for (int i = 0; i < appStoreVersionList.count - appVersionList.count; i++) {
            [appVersionList addObject:@"0"];
        }
    } else {
        for (int i = 0; i < appStoreVersionList.count - appVersionList.count; i++) {
            [appStoreVersionList addObject:@"0"];
        }
    }
    NSUInteger count = appStoreVersionList.count;
    for (int i = 0; i < count; i++) {
        NSInteger appstoreNumber = [appStoreVersionList[i] integerValue];
        NSInteger appVersionNumber = [appVersionList[i] integerValue];
        if (appstoreNumber > appVersionNumber ) {
            // 需要更新
            return YES;
        }
    }
    
    return NO;
}

- (void)showUpdateView:(NSDictionary *)model {
    UIWindow *window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    [window makeKeyAndVisible];
    UpdateAlertView *alertView = [UpdateAlertView alertViewAddTo:window appId:APPID];
    alertView.version = [NSString stringWithFormat:@"V%@", model[@"appVersion"]];
    alertView.content = model[@"upgradeDescribe"];
    alertView.force = [model[@"isForceUpgrade"] isEqual:@"1"];
    [alertView show];
}

- (UIViewController *)getRootViewController{

    UIWindow* window = [[[UIApplication sharedApplication] delegate] window];
    NSAssert(window, @"The window is empty");
    return window.rootViewController;
}

- (UIViewController *)findVisibleViewController {
    
    UIViewController* currentViewController = [self getRootViewController];
    BOOL runLoopFind = YES;
    while (runLoopFind) {
        if (currentViewController.presentedViewController) {
            currentViewController = currentViewController.presentedViewController;
        } else {
            if ([currentViewController isKindOfClass:[UINavigationController class]]) {
                currentViewController = ((UINavigationController *)currentViewController).visibleViewController;
            } else if ([currentViewController isKindOfClass:[UITabBarController class]]) {
                currentViewController = ((UITabBarController* )currentViewController).selectedViewController;
            } else {
                break;
            }
        }
    }
    
    return currentViewController;
}


@end
