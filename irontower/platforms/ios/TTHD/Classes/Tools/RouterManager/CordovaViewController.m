//
//  CordovaViewController.m
//  TTHD
//
//  Created by 秦传龙 on 2020/8/19.
//

#import "CordovaViewController.h"
#import "CDVSplashScreen.h"
#import <WebKit/WebKit.h>
#import "AppDelegate.h"
#import "Utils.h"

@interface CordovaViewController ()

@property (nonatomic, strong) UIProgressView *progressView;
@property (nonatomic, strong) UIActivityIndicatorView *activityIndicator;

@end

@implementation CordovaViewController

+ (instancetype)shareInstance {
    static dispatch_once_t onceToken;
    static id webViewController = nil;
    dispatch_once(&onceToken, ^{
        webViewController = [[self alloc] init];
    });
    return  webViewController;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(updateUserInfo:) name:@"TTHDNotificationNameUpdateUserInfo" object:nil];
    }
    return self;
}

- (void)hidenSplashScreen {
    CDVSplashScreen *splashScreen = self.pluginObjects[@"CDVSplashScreen"];
    splashScreen.initHide = YES;
    self.view.backgroundColor = [UIColor whiteColor];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO];
}

- (void)registerPlugin:(CDVPlugin *)plugin withClassName:(NSString *)className {
    [super registerPlugin:plugin withClassName:className];
    if ([className isEqualToString:@"CDVSplashScreen"]) {
        CDVSplashScreen *splashScreen = (CDVSplashScreen *)plugin;
        if ([AppDelegate isFirstRun] != YES) {
            [AppDelegate saveFirstRun:YES];
            [splashScreen setInitHide:YES];
        }
        
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    if (self.isClearAllLocalstorget) {
        [self removeClearItem];
    }
    
    [self saveNoticeInfoToLocalStorage];
    [self.view addSubview:self.progressView];
    
    [self.webViewEngine.engineWebView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew context:NULL];
    self.activityIndicator = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:(UIActivityIndicatorViewStyleGray)];
    [self.view addSubview:self.activityIndicator];
    self.activityIndicator.center= self.view.center;
    self.activityIndicator.hidesWhenStopped = YES;
    [self.activityIndicator startAnimating];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    CGFloat progress = [change[NSKeyValueChangeNewKey] doubleValue];
    if (progress >= 1) {
        self.progressView.hidden = YES;
         [self.activityIndicator stopAnimating];
    } else {
        [self.progressView setProgress:progress animated:YES];
    }
}

- (void)saveNoticeInfoToLocalStorage {
    NSDictionary *params = [[NSUserDefaults standardUserDefaults] objectForKey:@"noticeInfo"];
    if (params && params.allKeys.count > 0) {
        NSString *noticeId = params[@"noticeId"];
        NSData *data = [NSJSONSerialization dataWithJSONObject:@{
            noticeId: params
        } options:0 error:nil];

        NSString *source = [NSString stringWithFormat:@"localStorage.setItem('noticeInfo','%@')",[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]];
        WKWebView *webview = (WKWebView *)self.webView;
        WKUserScript *userScript = [[WKUserScript alloc] initWithSource:source injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
        [webview.configuration.userContentController addUserScript:userScript];
        [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"noticeInfo"];
    }
   
}

- (void)removeClearItem {
    WKWebView *webview = (WKWebView *)self.webView;
    WKUserScript *userScript = [[WKUserScript alloc] initWithSource:@"localStorage.removeItem('loginInfo');localStorage.removeItem('userInfo');" injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [webview.configuration.userContentController addUserScript:userScript];
}


- (void)dealloc {
    NSLog(@"内存已释放");
    [self.webViewEngine.engineWebView removeObserver:self forKeyPath:@"estimatedProgress" context:NULL];
}

- (UIProgressView *)progressView {
    if (!_progressView) {
        _progressView = [[UIProgressView alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(self.view.frame), 2)];
        _progressView.progress = 0.2;
        _progressView.progressTintColor = [UIColor colorWithRed:0/255.0 green:191/255.0 blue:131/255.0 alpha:1.0];
        _progressView.tintColor = [UIColor grayColor];
    }
    
    return _progressView;
}

- (void)updateUserInfo:(NSNotification *)notification {
    NSDictionary *userInfo =  notification.object;
    if (userInfo) {
        NSData *data = [NSJSONSerialization dataWithJSONObject:userInfo options:0 error:nil];
        NSString *source = [NSString stringWithFormat:@"localStorage.setItem('userInfo','%@')",[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]];
        WKWebView *webview = (WKWebView *)self.webView;
        WKUserScript *userScript = [[WKUserScript alloc] initWithSource:source injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
        [webview.configuration.userContentController addUserScript:userScript];
        
        
    }
    
    
}

@end
