//
//  CLWebView.h
//  StudyClass
//
//  Created by 秦传龙 on 2019/11/5.
//  Copyright © 2019 秦传龙. All rights reserved.
//

#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@class CLWebView;

@protocol CLWebviewDelegate <NSObject>

@optional
- (void)webview:(CLWebView *)webView estimatedProgress:(NSString *)estimatedProgress;

- (void)webview:(CLWebView *)webView title:(NSString *)title;

@end


@interface CLWebView : WKWebView

@property (nonatomic, weak) id<CLWebviewDelegate> clDelegate;


@end

NS_ASSUME_NONNULL_END
