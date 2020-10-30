//
//  CLWkWebView.m
//  TTHD
//
//  Created by 秦传龙 on 2020/9/7.
//

#import "CLWkWebView.h"

@implementation CLWkWebView

+ (instancetype)shareWebView {
    static dispatch_once_t onceToken;
    static CLWkWebView *webView = nil;
    dispatch_once(&onceToken, ^{
        webView = [[super allocWithZone:NULL] init];
        webView.backgroundColor = [UIColor whiteColor];
    });
    return webView;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    return [CLWkWebView shareWebView];
}

// 防止外部调用copy
- (instancetype)copyWithZone:(nullable NSZone *)zone {
   return [CLWkWebView shareWebView];
}

- (instancetype)mutableCopyWithZone:(nullable NSZone *)zone {
    return [CLWkWebView shareWebView];
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame configuration:(WKWebViewConfiguration *)configuration {
    self = [super initWithFrame:frame configuration:configuration];
    if (self) {

    }
    return self;

}

@end
