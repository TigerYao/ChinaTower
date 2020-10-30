//
//  UpdateAlertView.m
//  CLUIKit
//
//  Created by 秦传龙 on 2020/9/3.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "UpdateAlertView.h"

@interface UpdateAlertView ()

@property (nonatomic, strong) UIView *backgroundView;
@property (nonatomic, strong) UIButton *closeBtn; // x按钮
@property (nonatomic, strong) UIView *superView; // 父视图
@property (nonatomic, strong) UIButton *updateBtn;

@property (nonatomic, strong) UIImageView *headerImageView;
@property (nonatomic, strong) UITextView *contentLabel;
@property (nonatomic, strong) UILabel *versionLabel;

@property (nonatomic, copy) NSString *appid;

@end


@implementation UpdateAlertView

+ (instancetype)alertViewAddTo:(UIView *)superView appId:(NSString *)appid {
    if (!superView) {
        UIWindow *window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
        [window makeKeyAndVisible];
        superView = window;
    }
    UpdateAlertView *alertView = [[UpdateAlertView alloc] initWithFrame:superView.bounds];
    alertView.superView = superView;
    alertView.appid = appid;
    return alertView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.alpha = 0;
        self.backgroundColor = [UIColor colorWithWhite:0 alpha:0.3];
        [self initViewSubViews];
    }
    return self;
}

- (void)updateHandle {
    [[UIApplication sharedApplication]openURL:[NSURL URLWithString:[NSString stringWithFormat:@"itms-apps://itunes.apple.com/app/id%@",self.appid]]];
}

- (void)initViewSubViews {
    self.backgroundView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 305, 305 * 2 / 3 )];
    self.backgroundView.transform = CGAffineTransformMakeScale(0.2, 0.2);
    self.backgroundView.backgroundColor = [UIColor whiteColor];
    self.backgroundView.layer.cornerRadius = 8;
    self.backgroundView.alpha = 0.3;
    self.backgroundView.center = self.center;
    [self addSubview:self.backgroundView];
    
    
    // 头部的图片
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"illustrations"]];
    imageView.frame = CGRectMake(0, -20, 305, 127);
    [self.backgroundView addSubview:imageView];
    self.headerImageView = imageView;
    
    UILabel *newVersionLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 34, 130, 28)];
    newVersionLabel.font = [UIFont systemFontOfSize:20 weight:UIFontWeightMedium];
    newVersionLabel.text = @"发现新版本";
    newVersionLabel.textColor = [UIColor whiteColor];
    [self.headerImageView addSubview:newVersionLabel];
    
    
    self.versionLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, CGRectGetMaxY(newVersionLabel.frame) + 2, 130, 28)];
    self.versionLabel.font = [UIFont systemFontOfSize:13];
    self.versionLabel.textColor = [UIColor whiteColor];
    [self.headerImageView addSubview:self.versionLabel];
    
    self.contentLabel = [[UITextView alloc] initWithFrame:CGRectMake(20, CGRectGetHeight(imageView.frame) + 20, CGRectGetWidth(imageView.frame) - 40, 1)];
    self.contentLabel.editable = NO;
    self.contentLabel.selectable = NO;
    self.contentLabel.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    self.contentLabel.font = [UIFont systemFontOfSize:14];
    [self.backgroundView addSubview:self.contentLabel];
   
    // 底部的btn
    self.updateBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    self.updateBtn.frame = CGRectMake(15, CGRectGetMaxY(self.contentLabel.frame) + 30, CGRectGetWidth(self.backgroundView.frame) - 30, 40);
    [self.updateBtn setTitle:@"立即升级" forState:UIControlStateNormal];
    [self.updateBtn setTitleColor:[UIColor colorWithRed:0/255.0 green:191/255.0 blue:131/255.0 alpha:1.0] forState:UIControlStateNormal];
    self.updateBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightMedium];
    self.updateBtn.layer.cornerRadius = 20;
    self.updateBtn.layer.masksToBounds = YES;
    self.updateBtn.layer.borderColor = [UIColor colorWithRed:0/255.0 green:191/255.0 blue:131/255.0 alpha:1.0].CGColor;
    self.updateBtn.layer.borderWidth = 1;
    [self.updateBtn addTarget:self action:@selector(updateHandle) forControlEvents:UIControlEventTouchUpInside];
    [self.backgroundView addSubview:self.updateBtn];
    
    self.closeBtn = [UIButton buttonWithType:UIButtonTypeSystem];
    [self.closeBtn setBackgroundImage:[UIImage imageNamed:@"share_close"] forState:UIControlStateNormal];
    [self addSubview:self.closeBtn];
    [self.closeBtn addTarget:self action:@selector(close) forControlEvents:UIControlEventTouchUpInside];
}


- (void)layoutSubviews {
    [super layoutSubviews];
    
    self.contentLabel.frame = CGRectMake(20, CGRectGetHeight(self.headerImageView.frame) - 20, CGRectGetWidth(self.headerImageView.frame) - 40, 85);
    self.updateBtn.frame = CGRectMake(15, CGRectGetMaxY(self.contentLabel.frame) + 30, CGRectGetWidth(self.headerImageView.frame) - 30, 40);
    self.backgroundView.frame = CGRectMake(0, 0, 305, CGRectGetMaxY(self.updateBtn.frame) + 20 );
    self.backgroundView.center = self.center;
    self.closeBtn.frame = CGRectMake(CGRectGetMidX(self.bounds) - 18, CGRectGetMaxY(self.backgroundView.frame) + 26, 36, 36);
}

- (void)show {
    [self.superView addSubview:self];
    [UIView animateWithDuration:0.3 delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
        self.alpha = 1;
        self.backgroundView.alpha = 1;
        self.backgroundView.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
        
    }];
}

- (void)close {
    [self removeFromSuperview];
}

- (void)setContent:(NSString *)content {
    _content = content;
    NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:content];
    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
    style.minimumLineHeight = 25;
    [attributedString setAttributes:@{
        NSParagraphStyleAttributeName: style
    } range:NSMakeRange(0, attributedString.length)];
    self.contentLabel.attributedText = attributedString;
    [self layoutIfNeeded];
}

- (void)setForce:(BOOL)force {
    _force = force;
    self.closeBtn.hidden = force;
}

- (void)setVersion:(NSString *)version {
    _version = version;
    self.versionLabel.text = version;
}


@end
