//
//  HDBaseRequest.m
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "HDBaseRequest.h"
#import <QCLFoundation/QCLFoundation.h>
#import "UserInfo.h"
#import <CLUIKit/CLUIKit.h>
#import "IpFileParse.h"

static NSString *hdIp = @"";


@interface HDBaseRequest ()

@property (nonatomic, copy) NSString *url;
@property (nonatomic, assign) BOOL showHud;
@property (nonatomic, copy) NSDictionary *params;
@property (nonatomic, assign) YTKRequestMethod requestMethod;

@end


@implementation HDBaseRequest

- (NSTimeInterval)requestTimeoutInterval {
    return 10;
}

- (void)initialzeRequestConfigWithUrl:(NSString *)url params:(NSDictionary *)params method:(YTKRequestMethod)method hud:(BOOL)hud {
    _url = url;
    _params = params;
    _requestMethod = method;
    _showHud = hud;
}

- (instancetype)initWithUrl:(NSString *)url params:(NSDictionary *)params method:(YTKRequestMethod)method hud:(BOOL)hud
{
    self = [super init];
    if (self) {
        [self initialzeRequestConfigWithUrl:url params:params method:method hud:hud];
    }
    return self;
}

- (instancetype)initWithPOSTShowLoadingUrl:(NSString *)url params:(NSDictionary *)params
{
    self = [super init];
    if (self) {
         [self initialzeRequestConfigWithUrl:url params:params method:(YTKRequestMethodPOST) hud:YES];
    }
    return self;
}

- (instancetype)initWithGETShowLoadingUrl:(NSString *)url params:(NSDictionary *)params
{
    self = [super init];
    if (self) {
       [self initialzeRequestConfigWithUrl:url params:params method:(YTKRequestMethodGET) hud:YES];
    }
    return self;
}

- (instancetype)initWithPOSTNoLoadingUrl:(NSString *)url params:(NSDictionary *)params
{
    self = [super init];
    if (self) {
        [self initialzeRequestConfigWithUrl:url params:params method:(YTKRequestMethodPOST) hud:NO];

    }
    return self;
}

- (YTKRequestMethod)requestMethod {
    return _requestMethod;
}

- (id)requestArgument {
    return self.params;
}

- (NSDictionary<NSString *,NSString *> *)requestHeaderFieldValueDictionary {
    NSDictionary *headerFieldDic = [NSMutableDictionary dictionary];
    [headerFieldDic setValue:[@"Bearer " stringByAppendingString:[UserInfo shareManager].userInfo.token ?:@""] forKey:@"Authorization"];
    return headerFieldDic;
}

- (NSArray<NSString *> *)requestAuthorizationHeaderFieldArray {
    return @[@"Authorization"];
}

- (YTKRequestSerializerType)requestSerializerType {
    return YTKRequestSerializerTypeJSON;
}

- (YTKResponseSerializerType)responseSerializerType {
    return YTKResponseSerializerTypeHTTP;
}


- (void)startRequestWithCompletionBlockWithSuccess:(HDRequestCompletionSuccessBlock)success failure:(HDRequestCompletionFailBlock)failure {
    if (self.showHud) {
        [MBProgressHUD cl_showLoadingAddedTo:nil text:@"正在加载中..."];
    }
    
    [self startWithCompletionBlockWithSuccess:^(__kindof YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:[UIApplication sharedApplication].keyWindow animated:YES];
        NSLog(@"%@", [request responseString]);
        NSDictionary *responseDict = [[request responseString] mj_JSONObject];
        NSString *resultCode = responseDict[@"resultCode"];
        id data = responseDict[@"resultObject"];
        
        if ( [request responseString].length > 0 && !responseDict) {
            if (success) {
                success([request responseString], request);
            }
            return;
        }
        

        if ([resultCode isEqualToString:@"401"]) {
            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"温馨提示" message:@"您的登录信息已失效,请重新登录" preferredStyle:UIAlertControllerStyleAlert];
            [alertController addAction:[UIAlertAction actionWithTitle:@"去登录" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                [[NSNotificationCenter defaultCenter] postNotificationName:@"AppLogout" object:nil];
            }]];
            [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alertController animated:YES completion:nil];
            return;
        }
        
        if (![resultCode isEqualToString:@"000"]) {
            if (failure) {
                failure([NSError errorWithDomain:NSMachErrorDomain code:-999 userInfo:@{NSLocalizedFailureReasonErrorKey: responseDict[@"resultMsg"]}], request);
            } else {
                 [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"服务器开小差~"];
            }
            return;
        }
        
        if (!self.modelName || self.modelName.length == 0 ) {
            if (success) {
                success(data, request);
            }
            return;
        }
        
        if ([data isKindOfClass:[NSDictionary class]]) {
            if (success) {
                success([NSClassFromString(self.modelName) mj_objectWithKeyValues:data], request);
            }
            return;
        }
        
        if ([data isKindOfClass:[NSArray class]]) {
            if (success) {
                success([NSClassFromString(self.modelName) mj_objectArrayWithKeyValuesArray: data], request);
            }
            return;
        }
        
        if (success) {
            success(data, request);
        }
        
    } failure:^(__kindof YTKBaseRequest * _Nonnull request) {
        [MBProgressHUD hideHUDForView:[UIApplication sharedApplication].keyWindow animated:YES];
        
        if (failure) {
            failure(request.error ,request);
        } else {
            [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"服务器开小差~"];
        }
    }];
}




- (NSString *)requestUrl {
    return self.url;
}

- (NSString *)baseUrl {
    
    if (hdIp.length == 0) {
        hdIp = [IpFileParse getIp]; // 防止每次调用
    }
    return hdIp;
}


@end
