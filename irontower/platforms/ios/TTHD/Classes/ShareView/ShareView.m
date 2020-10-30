//
//  ShareView.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/25.
//

#import "ShareView.h"
#import <UIKit/UIKit.h>
#import <Masonry.h>
#import "AppDelegate.h"
#import <WXApi.h>

@interface ShareView ()

@property (nonatomic, strong) NSMutableArray *shareList;
@property (nonatomic, strong) UIView *platView;
@property (nonatomic, assign) CGFloat  maxY;
@property (nonatomic, assign) CGFloat floatBottom;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSDictionary *params;
@end


@implementation ShareView


+ (instancetype)shareManager {
    static dispatch_once_t onceToken;
    static ShareView *shareView = nil;
    dispatch_once(&onceToken, ^{
        shareView = [[self alloc] init];
    });
    return shareView;
}

- (NSMutableArray *)shareList {
    if (!_shareList) {
        _shareList = [NSMutableArray new];
    }
    return _shareList;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setPlatformList];
        [self createPopView];
    }
    return self;
}

- (void)setPlatformList {
    if ([WXApi isWXAppInstalled]) {
        [self.shareList addObjectsFromArray:@[
            @{
                @"type": @"1",
                @"text": @"微信",
                @"icon": @"wechat"
                
            },
            @{
                @"type": @"2",
                @"text": @"朋友圈",
                @"icon": @"linetime"
            }
        ]];
    }
    
    [self.shareList addObject:@{@"type": @"3", @"text": @"短信", @"icon": @"message"}];
}

- (void)createPopView {
    UIView *bgView = [[UIView alloc] init];
    bgView.backgroundColor = [UIColor colorWithWhite:0 alpha:0.2];
    [bgView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(close)]];
    AppDelegate *app = [AppDelegate shareAppDelegate];
    
    [app.window addSubview:bgView];
    self.bgView = bgView;
    
    [bgView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.mas_equalTo(0);
    }];
    
    
    UIView *platformView = [[UIView alloc] init];
    platformView.layer.cornerRadius = 20;
    platformView.layer.masksToBounds = YES;
    platformView.backgroundColor = [UIColor whiteColor];
    self.platView = platformView;
    [app.window addSubview:platformView];
    
    
    CGFloat bottom = 20;
    if (@available(iOS 11.0, *)) {
        bottom = app.window.safeAreaInsets.bottom + bottom;
    }
    
    self.floatBottom = bottom;
    
    CGFloat kWidth = [UIScreen mainScreen].bounds.size.width;

    
    UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, kWidth, 50)];
    [platformView addSubview:titleLabel];
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.font = [UIFont fontWithName:@"PingFangSC" size: 18];
    titleLabel.textColor =  [UIColor colorWithRed:6/255.0 green:4/255.0 blue:30/255.0 alpha:1.0];
    titleLabel.text = @"分享到";
    
    CGFloat maxY = 0;
    
    for (int i = 0; i < self.shareList.count; i++) {
        NSDictionary *dict = self.shareList[i];
        
        CGFloat vWidth = kWidth / 4; // 单个宽度
        CGFloat vIconWith = 44;
        CGFloat tHeight = 17;
        
        UIView *view = [[UIView alloc] initWithFrame:CGRectMake(i * vWidth, CGRectGetMaxY(titleLabel.frame)+(i / 4)*vWidth, vWidth, vWidth)];
        view.tag = i;
        UIImageView *iconImage = [[UIImageView alloc] initWithFrame:CGRectMake((vWidth - vIconWith) / 2, 20, vIconWith, vIconWith)];
        iconImage.image = [UIImage imageNamed:dict[@"icon"]];
        [view addSubview:iconImage];
        
        UILabel *textLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(iconImage.frame)+ 5, vWidth, tHeight)];
        textLabel.textColor = [UIColor colorWithRed:105/255.0 green:105/255.0 blue:109/255.0 alpha:1.0];
        textLabel.text = dict[@"text"];
        textLabel.font = [UIFont systemFontOfSize:12];
        textLabel.textAlignment = NSTextAlignmentCenter;
        [view addSubview:textLabel];
        
        [platformView addSubview:view];
        
        UITapGestureRecognizer *tapHandle = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapHandle:)];
        [view addGestureRecognizer:tapHandle];
        
        maxY = CGRectGetMaxY(view.frame);
    }
    
    UIButton *cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [platformView addSubview:cancelBtn];
    [cancelBtn addTarget:self action:@selector(close) forControlEvents:UIControlEventTouchUpInside];
    [cancelBtn setTitle:@"取消" forState:UIControlStateNormal];
    [cancelBtn setTitleColor:[UIColor colorWithRed:105/255.0 green:105/255.0 blue:109/255.0 alpha:1.0] forState:UIControlStateNormal];
    cancelBtn.titleLabel.font = [UIFont fontWithName:@"PingFangSC" size: 16];
    [cancelBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(0);
        make.width.mas_equalTo(64);
        make.height.mas_equalTo(30);
        make.top.mas_equalTo(maxY + 20);
    }];
    
    self.maxY =maxY + 80;
    
    [platformView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.bottom.mas_equalTo(bottom);
        make.height.mas_equalTo(self.maxY + bottom);
    }];

    self.platView.transform = CGAffineTransformMakeTranslation(0, self.maxY + bottom);
}

- (void)tapHandle:(UITapGestureRecognizer *)tap {
    NSInteger index = tap.view.tag;
    NSDictionary *dict = self.shareList[index];
    [self openIndexPlatformWithTap:dict];
    [self close];
}

- (void)openIndexPlatformWithTap:(NSDictionary *)dict {

    NSString *type = dict[@"type"];
    if ([type isEqualToString:@"1"]) {
        // 微信好友
        [self shareToWx:WXSceneSession param:dict];
        
    } else if ([type isEqualToString:@"2"]) {
        // 朋友圈
        [self shareToWx:WXSceneTimeline  param:dict];
        
    } else if ([type isEqualToString:@"3"]) {
        
        NSString *urlStr = nil;
        if ([self.params[@"type"] isEqualToString:@"text"]) {
            urlStr = [NSString stringWithFormat:@"sms://&body=%@",self.params[@"description"]];
        } else {
            urlStr = [NSString stringWithFormat:@"sms://&body=%@[%@]",self.params[@"description"], self.params[@"url"]];
        }
        
        urlStr = [urlStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]]; // 对中文进行编码
        // 短信
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlStr] options:@{} completionHandler:^(BOOL success) {
            if (success) {
                NSLog(@"调用成功");
            }else{
                NSLog(@"调用失败");
            }
        }];
    }
    
}

- (void)shareToWx:(int)scene param:(NSDictionary *)dict {
    //创建网页数据对象
    WXWebpageObject *webObj = [WXWebpageObject object];
    if ([self.params[@"type"] isEqualToString:@"webpage"]) {
        webObj.webpageUrl = self.params[@"url"];//链接
    }
    
    //创建多媒体消息结构体
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = self.params[@"title"];//标题
    message.description = self.params[@"description"];//描述
    message.thumbData = [NSData dataWithContentsOfURL:[NSURL URLWithString:self.params[@"icon"]]];
    message.mediaObject = webObj;
    SendMessageToWXReq *sendReq = [[SendMessageToWXReq alloc] init];
    
    sendReq.bText = [self.params[@"type"] isEqualToString:@"text"];//不使用NO文本信息
    sendReq.text = self.params[@"description"];
    sendReq.message = message;
    sendReq.scene = scene;
    [WXApi sendReq:sendReq completion:^(BOOL success) {
        
    }];
}


// 分享到平台
- (void)shareToPlatformWithParams:(NSDictionary *)dict {
    self.params = dict;
    self.bgView.hidden = NO;
    [UIView animateWithDuration:0.3 animations:^{
        self.platView.transform = CGAffineTransformIdentity;;
    }];
}

- (void)close {
    [UIView animateWithDuration:0.3 animations:^{
        self.platView.transform = CGAffineTransformMakeTranslation(0, self.maxY + self.floatBottom);
    } completion:^(BOOL finished) {
//        [self.platView removeFromSuperview];
        self.bgView.hidden = YES;
    }];
}



@end
