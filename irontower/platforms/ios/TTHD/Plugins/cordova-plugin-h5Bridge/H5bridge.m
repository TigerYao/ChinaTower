/********* H5bridge.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "ScanViewController.h"
#import "OpenMapManager.h"
#import "MediaPlayer.h"
#import "ShareView.h"
#import "Utils.h"
#import "OpenPayReq.h"
#import <WXApi.h>
#import "CLWebViewController.h"
#import "AssertPhotoManager.h"
#import <JPUSHService.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif
#import <CLBaseViewController.h>
#import <StoreKit/StoreKit.h>
#import <CTMeditorCategory/CTMeditorCategory.h>
#import "RouterManager.h"
#import "AppDelegate.h"
#import "CordovaViewController.h"
#import "AppDelegate+Update.h"



@interface H5bridge : CDVPlugin<SKStoreProductViewControllerDelegate> {
    // Member5 variables go here.
    
    
}
@property (nonatomic, strong) AssertPhotoManager *assertPhoto;
@property (nonatomic, copy) NSString *callBackId;

- (void)pay:(CDVInvokedUrlCommand*)command;

- (void)scanQRCode:(CDVInvokedUrlCommand*)command;
// 开启导航功能
- (void)openMapApp:(CDVInvokedUrlCommand*)command;

// 播放音频
- (void)playMedia:(CDVInvokedUrlCommand*)command;

// 分享
- (void)share:(CDVInvokedUrlCommand*)command;

@end

@implementation H5bridge

- (void)pay:(CDVInvokedUrlCommand*)command
{
    
    self.callBackId = command.callbackId;
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    if ([dict[@"type"] isEqualToString:@"AliPay"]) {
        // 如果是阿里支付
        [OpenPayReq doAPPayWithOrderString:dict[@"orderString"] widthCallBack:^(NSDictionary * _Nonnull dict) {
            [self aliPayResult:dict];
        }];
    } else if ([dict[@"type"] isEqualToString:@"Wechat"]) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(wxPayResult:) name:@"WXPayResult" object:nil];
        
        // 微信支付
        [OpenPayReq wxPayWithOrder:dict[@"orderString"]];
    }
}

//NSString类别方法
- (NSDictionary *)dictionaryValue:(NSString *)string{
    NSError *errorJson;
    NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:[string dataUsingEncoding:NSUTF8StringEncoding] options:kNilOptions error:&errorJson];
    if (errorJson != nil) {
#ifdef DEBUG
        NSLog(@"fail to get dictioanry from JSON: %@, error: %@", self, errorJson);
#endif
    }
    return jsonDict;
}


- (void)aliPayResult:(NSDictionary *)resultDic {
    NSString *result = resultDic[@"result"];
    NSString *resultStatus = resultDic[@"resultStatus"];

    CDVPluginResult* pluginResult = nil;
    //9000 订单支付成功
    if ([resultStatus isEqualToString:@"9000"]){
        //返回json字符串
        NSString * jsonStr = [result stringByReplacingOccurrencesOfString:@"\\" withString:@""];
        NSDictionary * dict = [self dictionaryValue:jsonStr];
        //\"out_trade_no\":\"15154064685511\"
        //        NSString * out_trade_no = dict[@"alipay_trade_app_pay_response"][@"out_trade_no"];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dict];
        
    }
    else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:[resultStatus intValue]];
        //8000 正在处理中 4000  订单支付失败 6001 用户中途取消/重复操作取消 6002  网络连接出错
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callBackId];
}

- (void)wxPayResult:(NSNotification *)not {
    
    BaseResp *resp = (BaseResp *)not.userInfo[@"resp"];
    CDVPluginResult* pluginResult = nil;
    
    if (resp.errCode == WXSuccess) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"支付成功"];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:resp.errCode];
    }
    
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"WXPayResult" object:nil];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callBackId];
}


- (void)scanQRCode:(CDVInvokedUrlCommand*)command
{
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    ScanViewController *scanVC = [ScanViewController new];
    scanVC.title = dict[@"title"];
    scanVC.result = ^(NSString *qrStr) {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:qrStr];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    };
    [self.viewController.navigationController pushViewController:scanVC animated:YES];
}

// 开启导航功能
- (void)openMapApp:(CDVInvokedUrlCommand*)command {
    
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    OpenMapManager *manager = [[OpenMapManager alloc] init];
    [manager openMapAppWith: dict controller:self.viewController];
}

// 播放音频
- (void)playMedia:(CDVInvokedUrlCommand*)command {
    [MediaPlayer playWithType:MediaTypeEleBeyond];
}

// 分享
- (void)share:(CDVInvokedUrlCommand*)command {
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    [[ShareView shareManager] shareToPlatformWithParams:dict];
}

// 打开蚂蚁信用认证
- (void)openAntFi:(CDVInvokedUrlCommand*)command {
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    [OpenPayReq doAPAuthWithOrderString:dict[@"orderString"] widthCallBack:^(NSDictionary * _Nonnull dict) {
        CDVPluginResult* pluginResult = nil;
        if ([dict[@"resultStatus"] isEqualToString:@"9000"]) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:dict[@"memo"]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:[dict[@"resultStatus"] intValue]];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }];
}


// 公开方法
- (void)commonFunc:(CDVInvokedUrlCommand*)command {
    NSString* echo = [command.arguments objectAtIndex:0];
    NSData *data = [echo dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    if ([dict[@"method"] isEqualToString:@"canOpenAli"]) {
        //        是否能打开支付宝
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%d",[Utils canOpenAli]]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else if ([dict[@"method"] isEqualToString:@"canOpenWx"]) {
        //        是否能打开微信
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%d",[Utils canOpenWx]]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else if ([dict[@"method"] isEqualToString:@"openWebView"]) {
        CLWebViewController *webVC = [CLWebViewController new];
        webVC.url = dict[@"params"][@"url"] ?: @"";
        webVC.title = dict[@"params"][@"title"] ?: @"";
        [self.viewController.navigationController pushViewController:webVC animated:YES];
    } else if([dict[@"method"] isEqualToString:@"getAppDeviceModel"]) {
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[Utils getPhoneName]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else if ([dict[@"method"] isEqualToString:@"getAppVersion"]) {
        //iOS 要获取线上的版本号
        [Utils getAppNetVersion:^(NSString * _Nonnull version) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:version];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    } else if ([dict[@"method"] isEqualToString:@"getCurrentPosition"]) {
        // 获取iOS端当前位置
        [[Utils shareUtils] getCurrentPostion:^(NSDictionary * _Nonnull position) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:position];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        } error:^(NSDictionary * _Nonnull error) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:error];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
    } else if([dict[@"method"] isEqualToString:@"openAppStoreScore"]) {
        // 打开Appstore去评分
        
        NSString *urlStr = [NSString stringWithFormat:@"itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=%@&pageNumber=0&sortOrdering=2&mt=8", APPID];
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlStr]];
    } else if([dict[@"method"] isEqualToString:@"chooseAssetPhoto"]) {
        // 打开Appstore去评分
        
        self.assertPhoto = [[AssertPhotoManager alloc]init];
        [self.assertPhoto getPhotoAlbumOrTakeAPhotoWithController:self.viewController photoBlock:^(UIImage *image) {
            NSData *data = UIImageJPEGRepresentation(image, 0.7);
            NSString *base64Data = [data base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
            //回掉图片
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:base64Data];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }];
        
    } else if([dict[@"method"] isEqualToString:@"appversion"]) {
        NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
        NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:app_Version];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else if ([dict[@"method"] isEqualToString:@"goMapView"]) {

        [[CTMediator sharedInstance] mapModule_initiazeBaiDuMap];
        NSMutableDictionary *params = [NSMutableDictionary dictionaryWithDictionary:dict[@"params"]];
        [params setValue:(^(NSString *tapType, NSDictionary *params){
            [RouterManager goWebViewWithType:tapType params:params];
        }) forKey:@"mapTapHandle"];
        CLBaseViewController *vc = (CLBaseViewController *)[[CTMediator sharedInstance] mapModule_MapViewControllerWithParams:params];
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:vc];
        [AppDelegate shareAppDelegate].window.rootViewController = nav;
        // 初始化百度地图
        
    } else if ([dict[@"method"] isEqualToString:@"popToView"]) {
        CordovaViewController *vc = (CordovaViewController *)self.viewController;
        //        [vc.webViewEngine performSelector:@selector(goBack)];
        
        [vc.navigationController popViewControllerAnimated:YES];
    } else if ([dict[@"method"] isEqualToString:@"notificationNative"]) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"notificationNative" object:self userInfo:dict[@"params"]];
    } else if ([dict[@"method"] isEqualToString:@"showUpdateView"]) {
        // 更新用户提示
        [[AppDelegate shareAppDelegate] queryUpgrade: YES];
    }
        
        
        
}

- (void)setJpushAlias:(CDVInvokedUrlCommand*)command {
    NSString* echo = [command.arguments objectAtIndex:0];
    [JPUSHService setAlias:echo completion:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
        
    } seq:0];
}


- (void)clearJpushAlias:(CDVInvokedUrlCommand*)command {
    [JPUSHService deleteAlias:^(NSInteger iResCode, NSString *iAlias, NSInteger seq) {
        
    } seq:0];
}


@end
