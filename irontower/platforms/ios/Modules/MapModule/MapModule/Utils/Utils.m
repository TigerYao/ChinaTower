//
//  Utils.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/24.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "Utils.h"
#import <CLUIKit/CLUIKit.h>
#import <TTHDApi/TTHDApi.h>


@implementation Utils


+ (NSDictionary *)parse:(NSString *)parse {
    if (parse.length == 0) {
        return nil;
    }
    NSError *error = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:parse options:0 error:&error];
    if (error) {
        return nil;
    }
    
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    
    if (error) {
        return nil;
    }
    
    return dict;
}


+ (NSString *)getQrcodeStr:(NSString *)text {
    if(!text || text.length == 0) {
        [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"二维码错误"];
        return nil;
    }
    NSString *isChineseReg = @"[/\u4e00-/\u9fa5]";
    if ([text containsString:@"{"]) {
        NSDictionary *codeDic = [self parse:text];
        NSString *code = codeDic[@"code"];
        
        if ([[NSPredicate predicateWithFormat:@"SELF MATCHES %@", isChineseReg] evaluateWithObject:code]) {
            [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"二维码错误"];
            return nil;
        } else {
            return code;
        }
    } else if ([text containsString:@"BT"]) {
        NSString *str = [text componentsSeparatedByString:@"BT"][1];
        if (str.length >= 26 && ![[NSPredicate predicateWithFormat:@"SELF MATCHES %@", isChineseReg] evaluateWithObject:str] && [str containsString:@","]) {
             [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"暂不支持邮政电池类型"];
            return nil;
        } else {
             [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"二维码错误"];
            return nil;
        }
    }
    return text;
}

+ (NSString *)getStationType {
       MapUserModel *userModel = [UserInfo shareManager].userModel;
    if ([userModel.driverType isEqualToString:@"5"]) {
        return @"3";
    }
    if ([userModel.orgType intValue] <= 3) {
        return @"1";
    } else if ([userModel.orgType intValue] == 4) {
        return @"2";
    }
    
    return @"";
}

+ (void)showAlertViewController:(NSString *)title content:(NSString *)content cancelBtn:(NSString *)cancenBtn okeyBtn:(NSString *)okeyBtn okbtnHandle:(void(^)(void))ok viewController:(UIViewController *)viewController {
    UIAlertController *alertViewController = [UIAlertController alertControllerWithTitle:title message:content preferredStyle:UIAlertControllerStyleAlert];
    if (cancenBtn && cancenBtn.length > 0) {
        [alertViewController addAction:[UIAlertAction actionWithTitle:cancenBtn style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
        }]];
    }
    if (okeyBtn && okeyBtn.length > 0) {
        [alertViewController addAction:[UIAlertAction actionWithTitle:okeyBtn style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            if (ok) {
                ok();
            }
        }]];
    }
    
    [viewController presentViewController:alertViewController animated:YES completion:nil];
}

//其他返回更新字段
+ (NSDictionary *)needUpdateUserInfo:(NSDictionary *)model {
    
    NSMutableDictionary *params = [NSMutableDictionary new];
    
    NSString *phoneOs = model[@"phoneOs"];
    NSString *appVersion = model[@"appVersion"];
    if ([phoneOs isKindOfClass:[NSNull class]]) {
        phoneOs = @"";
    }
    if ([appVersion isKindOfClass:[NSNull class]]) {
        appVersion = @"";
    }
    
    if (![phoneOs isEqualToString:[UIDevice systemVersion]]) {
        [params setObject:[UIDevice systemVersion] forKey:@"phoneOs"];
    }
    if (![appVersion isEqualToString:[UIDevice appVersion]]) {
        [params setObject:[UIDevice appVersion] forKey:@"appVersion"];
    }
    
    return params;
}

@end
