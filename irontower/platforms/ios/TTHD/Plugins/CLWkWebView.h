//
//  CLWkWebView.h
//  TTHD
//
//  Created by 秦传龙 on 2020/9/7.
//

#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface CLWkWebView : WKWebView

+ (instancetype)shareWebView;

- (instancetype)initWithFrame:(CGRect)frame configuration:(WKWebViewConfiguration *)configuration;
@end

NS_ASSUME_NONNULL_END
