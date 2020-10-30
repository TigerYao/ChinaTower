/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

//
//  AppDelegate.m
//  铁塔换电
//
//  Created by ___FULLUSERNAME___ on ___DATE___.
//  Copyright ___ORGANIZATIONNAME___ ___YEAR___. All rights reserved.
//
#import "CordovaViewController.h"
#import "AppDelegate.h"
#import "MainViewController.h"
#import "ScanViewController.h"
#import <WXApi.h>
#import <AlipaySDK/AlipaySDK.h>
#import "MediaPlayer.h"
#import "Utils.h"
#import "JEAuthorityTool.h"
#import<CoreTelephony/CTCellularData.h>
#import "AppDelegate+Update.h"
#import "CLWkWebView.h"
#import "RouterManager.h"

#import <JPUSHService.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <CLUIKit/CLUIKit.h>

static BOOL firstRun = YES;


@interface AppDelegate ()<JPUSHRegisterDelegate, WXApiDelegate>

@property (nonatomic, strong) NSTimer *timer;

@end

@implementation AppDelegate



- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"showSplash"];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:[CordovaViewController shareInstance]];
    [nav setNavigationBarHidden:YES];
    self.viewController = nav;

//   [WXApi registerApp:WXKey];
    [WXApi registerApp:WXKey universalLink:@"https://powerexchangeAPP.chinatowercom.cn:8081/2020/"];
    [WXApi startLogByLevel:WXLogLevelDetail logBlock:^(NSString * _Nonnull log) {
        NSLog(@"ad：%@", log);
    }];
    
    //notice: 3.0.0 及以后版本注册可以这样写，也可以继续用之前的注册方式
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
      // 可以添加自定义 categories
      // NSSet<UNNotificationCategory *> *categories for iOS10 or later
      // NSSet<UIUserNotificationCategory *> *categories for iOS8 and iOS9
    }
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    // notice: 2.1.5 版本的 SDK 新增的注册方法，改成可上报 IDFA，如果没有使用 IDFA 直接传 nil
    [JPUSHService setupWithOption:launchOptions appKey:JPushKey
                          channel:@"AppStore"
                 apsForProduction:true
            advertisingIdentifier:nil];
    
    [application setApplicationIconBadgeNumber:0];
    [JPUSHService resetBadge];
    //1.获取网络权限 根绝权限进行人机交互
    [self networkStatus:application didFinishLaunchingWithOptions:launchOptions];
    
    [self queryUpgrade:NO];
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
    
}

/*
 CTCellularData在iOS9之前是私有类，权限设置是iOS10开始的，所以App Store审核没有问题
 获取网络权限状态
 */
- (void)networkStatus:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    //2.根据权限执行相应的交互
    CTCellularData *cellularData = [[CTCellularData alloc] init];
    
    /*
     此函数会在网络权限改变时再次调用
     */
    cellularData.cellularDataRestrictionDidUpdateNotifier = ^(CTCellularDataRestrictedState state) {
        switch (state) {
            case kCTCellularDataRestricted:
                
                NSLog(@"Restricted");
                //2.1权限关闭的情况下 再次请求网络数据会弹出设置网络提示
                [self getAppInfo];
                break;
            case kCTCellularDataNotRestricted:
                
                NSLog(@"NotRestricted");
                //2.2已经开启网络权限 监听网络状态
//                [self addReachabilityManager:application didFinishLaunchingWithOptions:launchOptions];
//                [self getInfo_application:application didFinishLaunchingWithOptions:launchOptions];
                break;
            case kCTCellularDataRestrictedStateUnknown:
                
                NSLog(@"Unknown");
                //2.3未知情况 （还没有遇到推测是有网络但是连接不正常的情况下）
//                [self getAppInfo];
                break;
                
            default:
                break;
        }
    };
}

- (void)getAppInfo {
    CGFloat systemVersion =  [[[UIDevice currentDevice] systemVersion] floatValue];
    if (systemVersion >= 8.0 && systemVersion < 10.0) {  // iOS8.0 和 iOS9.0
        NSURL * url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url];
        }
        
    }else if (systemVersion >= 10.0) {  // iOS10.0及以后
        NSURL * url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            if (@available(iOS 10.0, *)) {
                [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:^(BOOL success) {
                }];
            }
        }
    }

}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
    BOOL isSuccess = [WXApi handleOpenUniversalLink:userActivity delegate:self];
    return isSuccess;
}


- (void)application:(UIApplication *)application
didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

  /// Required - 注册 DeviceToken
  [JPUSHService registerDeviceToken:deviceToken];

}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    [JPUSHService resetBadge];
    [application setApplicationIconBadgeNumber:0];
//    BOOL isOpen = [Utils isLocationServiceOpen];
//    if (!isOpen) {
//        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"温馨提示" message:@"当前位置信息被禁用，请在设置中打开定位信息" preferredStyle:UIAlertControllerStyleAlert];
//        [alertController addAction:[UIAlertAction actionWithTitle:@"去设置" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
//            [Utils openLocationSetting];
//        }]];
//
//        [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault handler:nil]];
//        [self.window.rootViewController presentViewController:alertController animated:YES completion:nil];
//    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {

}



- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  //Optional
  NSLog(@"did Fail To Register For Remote Notifications With Error: %@", error);
}

//此方法解决横屏启动APP的时候UI错乱的bug（前提是在设置里面Device orientation勾选☑️一个竖屏即可，其他的都不勾选）
-(UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window{
    return  UIInterfaceOrientationMaskAllButUpsideDown;
}

+(AppDelegate *)shareAppDelegate{
    return (AppDelegate *) [UIApplication sharedApplication].delegate;
}


#pragma mark- JPUSHRegisterDelegate

// iOS 12 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center openSettingsForNotification:(UNNotification *)notification{
  if (notification && [notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //从通知界面直接进入应用
  }else{
    //从通知设置界面进入应用
  }
}

// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler {
  // Required
  NSDictionary * userInfo = notification.request.content.userInfo;
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {

      
      if ([userInfo[@"type"] isEqualToString:@"2"]) {
//          播放电池不足
            [MediaPlayer playWithType:MediaTypeEleBeyond];
      } else if ([userInfo[@"type"]  hasPrefix:@"5"]) {
          
          if ([[self findVisibleViewController] isKindOfClass:NSClassFromString(@"MapViewController")]) {
              // 特殊处理
              [[NSUserDefaults standardUserDefaults] setValue:@{
                                @"type": userInfo[@"type"],
                                @"noticeId": userInfo[@"noticeId"]
                            } forKey:@"noticeInfo"];
          } else {
              NSData *data = [NSJSONSerialization dataWithJSONObject:@{
                  @"type": userInfo[@"type"],
                  @"noticeId": userInfo[@"noticeId"]
              } options:0 error:nil];
              CDVViewController *nav = ((UINavigationController *)self.viewController).viewControllers[0];
              [nav.webViewEngine evaluateJavaScript:[NSString stringWithFormat:@"window.pushToQueryData('%@')", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] ] completionHandler:^(id reseu, NSError *err) {}];
          }
      }
      
    [JPUSHService handleRemoteNotification:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert); // 需要执行这个方法，选择是否提醒用户，有 Badge、Sound、Alert 三种类型可以选择设置
}

// iOS 10 Support
- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  // Required
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
//       [MediaPlayer playWithType:MediaTypeEleBeyond];
      NSString *code = [NSString stringWithFormat:@"%@", userInfo[@"type"]];
//      if ([code isEqualToString:@"0"] || [code isEqualToString:@"1"]) {
//          [self openMessagePage:@"/myWallet/tradingDetail"];
//      }else if ([userInfo[@"type"] isEqualToString:@"2"]) {
//
//      } else if ([userInfo[@"type"] isEqualToString:@"4"]) {
//
//      } else if ([userInfo[@"type"] isEqualToString:@"5"]) {
//
//      }
      
      if ([[self findVisibleViewController] isKindOfClass:NSClassFromString(@"MapViewController")]) {
          [RouterManager notificationRun:userInfo];
      } else {
          [self openMessagePage:code noticeId:userInfo[@"noticeId"]];
      }
      
      
      
    [JPUSHService handleRemoteNotification:userInfo];
//      [MediaPlayer playWithType:MediaTypeEleBeyond];

  }
  completionHandler();  // 系统要求执行这个方法
}

// 静默消息didReceiveRemoteNotification
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
 
    NSLog(@"%@", userInfo);
  // Required, iOS 7 Support
  [JPUSHService handleRemoteNotification:userInfo];
    // *后台播放代码
//    NSString *code = [NSString stringWithFormat:@"%@", userInfo[@"type"]];
//    if ([code isEqualToString:@"0"] || [code isEqualToString:@"1"]) {
//        [self openMessagePage:@"/myWallet/tradingDetail"];
//    }else if ([userInfo[@"type"] isEqualToString:@"2"]) {
//        [self openMessagePage:@""];
//    }
  completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {

  // Required, For systems with less than or equal to iOS 6
  [JPUSHService handleRemoteNotification:userInfo];
}



// 仅支持iOS9以上系统,iOS8及以下系统不会回调
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{

    
    NSLog(@"%@", url);
    if ([url.host isEqualToString:@"safepay"]) {
        // 支付跳转支付宝钱包进行支付，处理支付结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:nil];
        [[AlipaySDK defaultService] processAuth_V2Result:url standbyCallback:nil];
        return YES;
    }
    
    /**
     * 微信支付回调
     */
    return [WXApi handleOpenURL:url delegate:self];
}


- (void)onResp:(BaseResp *)resp {
    NSString *strMsg = [NSString stringWithFormat:@"支付结果"];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"WXPayResult" object:nil userInfo:@{@"resp": resp}];
    switch (resp.errCode) {
        case WXSuccess:
            strMsg = @"支付结果：成功！";
            NSLog(@"支付成功－PaySuccess，retcode = %d", resp.errCode);
            break;
            
        default:
            strMsg = [NSString stringWithFormat:@"支付失败"];
            NSLog(@"错误，retcode = %d, retstr = %@", resp.errCode,resp.errStr);
            break;
    }
}


- (void)openMessagePage:(NSString *)pathName noticeId:(NSString *)noticeId {
    CDVViewController *nav = ((UINavigationController *)self.viewController).viewControllers[0];
    [nav.webViewEngine evaluateJavaScript:[NSString stringWithFormat:@"window.pushToPage('%@', '%@')", pathName, noticeId] completionHandler:^(id reseu, NSError *err) {
    }];
}


+ (BOOL)isFirstRun {
    return firstRun;
}

+ (void)saveFirstRun:(BOOL)isFirstRun {
    firstRun = isFirstRun;
}

@end
