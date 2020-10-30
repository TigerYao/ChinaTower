//
//  RouterManager.m
//  TTHD
//
//  Created by 秦传龙 on 2020/8/19.
//

#import "RouterManager.h"
#import "MainViewController.h"
#import "CordovaViewController.h"
#import "AppDelegate.h"
#import <WebKit/WebKit.h>
#import "ShareView.h"
#import "ScanViewController.h"
#import "CLWebViewController.h"
#import "AppDelegate+Update.h"

NSString *const MapViewControllerTapMessage = @"MapViewControllerTapMessage";
NSString *const MapViewControllerTapBattery = @"MapViewControllerTapBattery";
NSString *const MapViewControllerTapMyOrder = @"MapViewControllerTapMyOrder";
NSString *const MapViewControllerTapSetting = @"MapViewControllerTapSetting";
NSString *const MapViewControllerTapMyWallet = @"MapViewControllerTapMyWallet";
NSString *const MapViewControllerTapApplyRefundList = @"MapViewControllerTapApplyRefundList";
NSString *const MapViewControllerTapExchangeEleList = @"MapViewControllerTapExchangeEleList";
NSString *const MapViewControllerTapCarManage = @"MapViewControllerTapCarManage";
NSString *const MapViewControllerTapFeedBack = @"MapViewControllerTapFeedBack";
NSString *const MapViewControllerTapQrCodeInvate = @"MapViewControllerTapQrCodeInvate";
NSString *const MapViewControllerTapShare = @"MapViewControllerTapShare";
NSString *const MapViewControllerTapTel = @"MapViewControllerTapTel";
NSString *const MapViewControllerTapPersonal = @"MapViewControllerTapPersonal";
NSString *const MapViewControllerTapLoginout = @"MapViewControllerTapLoginout";
NSString *const MapViewControllerTapSQCode = @"MapViewControllerTapSQCode";
NSString *const MapViewControllerTapOnlineCustom = @"MapViewControllerTapOnlineCustom";
NSString *const MapViewControllerTapOnlineAuth = @"MapViewControllerTapOnlineAuth";
NSString *const MapViewControllerTapPackageList  = @"MapViewControllerTapPackageList";
NSString *const MapViewControllertapServiceNetworkDetail = @"MapViewControllertapServiceNetworkDetail";
NSString *const MapViewControllertapServiceEleCabinetDetail = @"MapViewControllertapServiceEleCabinetDetail";
NSString *const MapViewControllerTapCheckUpdate = @"MapViewControllerTapCheckUpdate";


@implementation RouterManager

+ (void)goWebViewWithType:(NSString *)type params:(NSDictionary *)params {
    if ([type isEqualToString:MapViewControllerTapMessage]) {
        [self goWebViewWithRouterName:@"/news/news"];
    } else if ([type isEqualToString:MapViewControllerTapBattery]) {
        [self goWebViewWithRouterName:@"/myBattery"];
    } else if ([type isEqualToString:MapViewControllerTapMyOrder]) {
        [self goWebViewWithRouterName:@"/myOrder"];
    } else if ([type isEqualToString:MapViewControllerTapSetting]) {
        [self goWebViewWithRouterName:@"/personalCenter/setup"];
    } else if ([type isEqualToString:MapViewControllerTapMyWallet]) {
        [self goWebViewWithRouterName:@"/myWallet"];
    } else if ([type isEqualToString:MapViewControllerTapApplyRefundList]) {
        [self goWebViewWithRouterName:@"/myWallet/applyRefundList"];
    } else if ([type isEqualToString:MapViewControllerTapExchangeEleList]) {
        [self goWebViewWithRouterName:@"/exchangeEleList"];
    } else if ([type isEqualToString:MapViewControllerTapCarManage]) {
        [self goWebViewWithRouterName:@"/carManage"];
    } else if ([type isEqualToString:MapViewControllerTapFeedBack]) {
        [self goWebViewWithRouterName:@"/personalCenter/feedBack"];
    } else if ([type isEqualToString:MapViewControllerTapQrCodeInvate]) {
        [self goWebViewWithRouterName:@"/personalCenter/qrCodeInvate"];
    }else if ([type isEqualToString:MapViewControllertapServiceNetworkDetail]) {
        NSString *routerName = [NSString stringWithFormat:@"/serviceNetworkDetail?nodeId=%@&item=%@&type=%@&native=1",params[@"nodeId"],params[@"item"], params[@"type"]];
        [self goWebViewWithRouterName:[routerName stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];

    }else if ([type isEqualToString:MapViewControllertapServiceEleCabinetDetail]) {
        NSString *routerName = [NSString stringWithFormat:@"/eleCabinetDetail?cabinetId=%@&item=%@&type=%@&native=1",params[@"cabinetId"],params[@"item"], params[@"type"]];
        [self goWebViewWithRouterName:[routerName stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
        
    } else if ([type isEqualToString:MapViewControllerTapShare]) {
        // 分享
        [[ShareView shareManager] shareToPlatformWithParams:params];
        
    } else if ([type isEqualToString:MapViewControllerTapTel]) {
        // 拨打电话
        
    } else if ([type isEqualToString:MapViewControllerTapLoginout]) {
        [AppDelegate saveFirstRun:NO];
        CordovaViewController *cordovaVC = [CordovaViewController new];
        cordovaVC.isClearAllLocalstorget = YES;
        [cordovaVC removeClearItem];
        NSString *startPage = @"index.html";
        cordovaVC.startPage = startPage;
        NSURL *url = [cordovaVC appUrl];
        [cordovaVC reloadWebView:url];
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:cordovaVC];
        [AppDelegate shareAppDelegate].window.rootViewController = nav;
    } else if ([type isEqualToString:MapViewControllerTapPersonal]) {
        [self goWebViewWithRouterName:@"/personalCenter/personalNews"];
    } else if ([type isEqualToString:MapViewControllerTapOnlineAuth]) {
        [self goWebViewWithRouterName:@"/realNameAuth?native=1"];
    } else if ([type isEqualToString:MapViewControllerTapPackageList]) {
        [self goWebViewWithRouterName:@"/myWallet/packageList"];
    } else if ([type isEqualToString:MapViewControllerTapSQCode]) {
        UINavigationController *mapVC = (UINavigationController *)[AppDelegate shareAppDelegate].window.rootViewController;
        ScanViewController *scanVC = [ScanViewController new];
        scanVC.title = params[@"title"];
        scanVC.result = ^(NSString *qrStr) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"NSNotificationNameSqCode" object:qrStr];
        };
        [mapVC pushViewController:scanVC animated:YES];
    }
    else if ([type isEqualToString:MapViewControllerTapOnlineCustom]) {
        UINavigationController *mapVC = (UINavigationController *)[AppDelegate shareAppDelegate].window.rootViewController;
        CLWebViewController *webVC = [CLWebViewController new];
        if (params[@"url"] ) {
           webVC.url = params[@"url"] ?: @"";
        } else if (params[@"html"]) {
            webVC.html = params[@"html"] ?: @"";
        }
       
        webVC.title =params[@"title"] ?: @"";
        [mapVC pushViewController:webVC animated:YES];
    } else if ([type isEqualToString:MapViewControllerTapCheckUpdate]) {
        [[AppDelegate shareAppDelegate] queryUpgrade:YES];
    }
}

+ (void)goWebViewWithRouterName:(NSString *)routerName {
    UINavigationController *mapVC = (UINavigationController *)[AppDelegate shareAppDelegate].window.rootViewController;
    CordovaViewController *mainVC = [CordovaViewController  shareInstance];
    [mainVC hidenSplashScreen];
    NSString *startPage = [@"index.html/#" stringByAppendingString:routerName];
    mainVC.startPage = startPage;

    NSURL *url = [mainVC appUrl];
    [mainVC reloadWebView:url];
    if ([startPage containsString:@"/serviceNetworkDetail"] || [startPage containsString:@"/eleCabinetDetail"]) {
        [mainVC.webView performSelector:@selector(reload)];
    }
    
    
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.02 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [mapVC pushViewController:mainVC animated:YES];
    });
    
    
}

+ (void)notificationRun:(NSDictionary *)userInfo {
    NSString *payload = [NSString stringWithFormat:@"%@", userInfo[@"type"]];
    NSString *noticeId = userInfo[@"noticeId"];
    
    if ([payload isEqualToString:@"0"] || [payload isEqualToString:@"1"]) {
        [self goWebViewWithRouterName:@"/myWallet/tradingDetail?native=1"];
    } else if ([payload isEqualToString:@"3"] || [payload isEqualToString:@"4"]) {
        [self goWebViewWithRouterName:@"/myWallet?native=1"];
    } else if ([payload isEqualToString:@"501"]) {
        [self goWebViewWithRouterName:[NSString stringWithFormat:@"/news/messageDetail?native=1&newsType=0&title=通知公告&type=501&noticeId=%@", noticeId]];
    } else if ([payload isEqualToString:@"502"]) {
        [self goWebViewWithRouterName:[NSString stringWithFormat:@"/news/messageDetail?native=1&newsType=2&title=活动消息&type=502&noticeId=%@", noticeId]];
    }
}

@end
