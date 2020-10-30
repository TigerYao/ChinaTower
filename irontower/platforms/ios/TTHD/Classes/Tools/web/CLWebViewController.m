//
//  CLWebViewController.m
//  StudyClass
//
//  Created by 秦传龙 on 2019/11/5.
//  Copyright © 2019 秦传龙. All rights reserved.
//

#import "CLWebViewController.h"
#import "CLWebView.h"


@interface CLWebViewController ()<WKNavigationDelegate, WKUIDelegate, CLWebviewDelegate>

@property (nonatomic, strong) CLWebView *webview;
@property (nonatomic, strong) UIProgressView *progressView;

@end

@implementation CLWebViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupConfigWebview];
    [self setLeftNavBar];
}

- (void)setLeftNavBar {
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[[UIImage imageNamed:@"goback"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] style:UIBarButtonItemStylePlain target:self action:@selector(leftBtnClick)];
}

- (void)leftBtnClick {
    if ([self.navigationController respondsToSelector:@selector(popViewControllerAnimated:)]) {
        [self.navigationController popViewControllerAnimated:YES];
    } else {
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}


- (void)setupConfigWebview {
    [self.view addSubview:self.webview];
    [self progressBarView];
}


- (void)progressBarView {
    
    UIProgressView *progressView = [[UIProgressView alloc] initWithFrame:CGRectMake(0, 0, KSCREEN_WIDTH, 2)];
    progressView.progressTintColor = [UIColor colorWithRed:0/255.0 green:191/255.0 blue:143/255.0 alpha:1.0];
    progressView.trackTintColor = [UIColor colorWithRed:243/255.0 green:243/255.0 blue:243/255.0 alpha:1.0];
    [self.view addSubview:progressView];
    self.progressView = progressView;
    
}

- (void)setUrl:(NSString *)url {
    _url = [url stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
}

- (void)setHtml:(NSString *)html {
    _html = [NSString stringWithFormat:@"<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><style> body {padding:20px}</style></head><body>%@</body></html>", html];
    
}

- (CLWebView *)webview {
    if (!_webview) {
        CGRect frame = self.view.bounds;
        _webview = [[CLWebView alloc] initWithFrame:frame];
        _webview.UIDelegate = self;
        _webview.navigationDelegate = self;
        _webview.clDelegate = self;
        if (self.url) {
             [_webview loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:self.url]]];
        } else {
            [_webview loadHTMLString:self.html baseURL:nil];
        }
       
    }
    return _webview;
}

- (void)webview:(CLWebView *)webView estimatedProgress:(NSString *)estimatedProgress {
    NSLog(@"%@",estimatedProgress);
    [self.progressView setProgress:[estimatedProgress doubleValue] animated:YES];
    if ([estimatedProgress doubleValue] == 1) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
             self.progressView.hidden = YES;
            self.progressView.progress = 0;
        });
    } else {
        self.progressView.hidden = NO;
    }
}

- (void)webview:(CLWebView *)webView title:(NSString *)title {
    NSLog(@"title:%@", title);
    if (self.navigationController && !self.title) {
        self.title = title;
    } else {
        
    }
}




- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler {
    decisionHandler(WKNavigationResponsePolicyAllow);
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:NO];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO animated:NO];
}

- (void)dealloc {
    NSLog(@"dealloc");
}



@end
