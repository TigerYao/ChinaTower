//
//  PrivacyAlertView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "PrivacyAlertView.h"
#import "MapViewController.h"

@interface PrivacyAlertView ()<QMUITextViewDelegate>

@property (nonatomic, weak) MapViewController *mapVC;

@property (nonatomic, assign) BOOL isShow;

@property (nonatomic, strong) UIView *backgroundView;

@property (nonatomic, strong) UIImageView *topImageView;

@property (nonatomic, strong) QMUILabel *titleLabel;

@property (nonatomic, strong) QMUITextView *contentView;

@property (nonatomic, strong) QMUIButton *noAgrementBtn;

@property (nonatomic, strong) QMUIButton *agrementBtn;

@end

@implementation PrivacyAlertView


- (instancetype)initWithFrame:(CGRect)frame controller:(MapViewController *)mapViewController
{
    self = [super initWithFrame:frame];
    if (self) {
        self.mapVC = mapViewController;
        self.backgroundColor = [UIColor colorWithWhite:0 alpha:0.3];
        [self addSubview:self.backgroundView];
        self.alpha = 0.2;
        
        [self.backgroundView addSubview:self.topImageView];
        [self.topImageView addSubview:self.titleLabel];
        [self.backgroundView addSubview:self.contentView];
        [self.backgroundView addSubview:self.agrementBtn];
        [self.backgroundView addSubview:self.noAgrementBtn];
    }
    return self;
}

- (UIView *)backgroundView {
    if (!_backgroundView) {
        _backgroundView = [[UIView alloc] init];
        _backgroundView.backgroundColor = UIColor.whiteColor;
        _backgroundView.layer.cornerRadius = 10;
        _backgroundView.layer.masksToBounds = YES;
        _backgroundView.transform = CGAffineTransformMakeScale(0.3, 0.3);
    }
    return _backgroundView;
}

- (UIImageView *)topImageView {
    if (!_topImageView) {
        _topImageView = [[UIImageView alloc] init];
        _topImageView.image = [UIImage mapModule_imageNamed:@"privacy-top"];
        _topImageView.layer.masksToBounds = YES;
        
    }
    return _topImageView;
}

- (QMUILabel *)titleLabel {
    if (!_titleLabel) {
        _titleLabel = [[QMUILabel alloc] initWithFrame:self.topImageView.bounds];
        _titleLabel.text = @"铁塔换电隐私政策";
        _titleLabel.font = [UIFont systemFontOfSize:20 weight:UIFontWeightSemibold];
        _titleLabel.textColor = UIColor.whiteColor;
        _titleLabel.textAlignment = NSTextAlignmentCenter;
        _titleLabel.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    }
    return _titleLabel;
}

- (QMUIButton *)noAgrementBtn {
    if (!_noAgrementBtn) {
        _noAgrementBtn = [QMUIButton buttonWithType:UIButtonTypeCustom];
        [_noAgrementBtn setTitle:@"不同意" forState:UIControlStateNormal];
        _noAgrementBtn.layer.cornerRadius = 20;
        _noAgrementBtn.layer.masksToBounds = YES;
        _noAgrementBtn.backgroundColor = UIColor.whiteColor;
        _noAgrementBtn.layer.borderColor = [UIColor qmui_colorWithHexString:@"#CBCACF"].CGColor;
        _noAgrementBtn.layer.borderWidth = 1;
        [_noAgrementBtn setTitleColor:[UIColor qmui_colorWithHexString:@"#CBCACF"] forState:UIControlStateNormal];
        _noAgrementBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        __weak typeof(self) weakSelf = self;
        [_noAgrementBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
            [weakSelf close];
            [NSUserDefaults cl_noAgreement];
            if (weakSelf.mapVC.mapTapHandle) {
                weakSelf.mapVC.mapTapHandle(MapViewControllerTapLoginout, nil);
            }
        }];
    }
    return _noAgrementBtn;
}

- (QMUIButton *)agrementBtn {
    if (!_agrementBtn) {
        _agrementBtn = [QMUIButton buttonWithType:UIButtonTypeCustom];
        [_agrementBtn setTitle:@"同意" forState:UIControlStateNormal];
        _agrementBtn.layer.cornerRadius = 20;
        _agrementBtn.layer.masksToBounds = YES;
        _agrementBtn.backgroundColor = [UIColor qmui_colorWithHexString:@"#00BF83"];
        [_agrementBtn setTitleColor:[UIColor qmui_colorWithHexString:@"#fff"] forState:UIControlStateNormal];
        _agrementBtn.layer.borderColor = [UIColor qmui_colorWithHexString:@"#00BF83"].CGColor;
        _agrementBtn.layer.borderWidth = 1;
        _agrementBtn.titleLabel.font = [UIFont systemFontOfSize:16 weight:UIFontWeightSemibold];
        __weak typeof(self) weakSelf = self;
        [_agrementBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
            [NSUserDefaults cl_agreement];
            [weakSelf close];
        }];
    }
    return _agrementBtn;
}

- (QMUITextView *)contentView {
    if (!_contentView) {
        _contentView = [[QMUITextView  alloc] init];
        NSString *content =
        @"欢迎使用“铁塔换电”，基于对个人信息的保护，在使用前请仔细阅读《铁塔换电隐私政策》，我们将严格遵照您的意愿使用个人信息，以便为您提供更好的服务。";
        NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
        style.lineSpacing = 4;
        NSMutableAttributedString *arributedString = [[NSMutableAttributedString alloc] initWithString:content ];
        [arributedString addAttributes:@{
            NSFontAttributeName: [UIFont systemFontOfSize:14],
            NSForegroundColorAttributeName: [UIColor qmui_colorWithHexString:@"#69696D"],
            NSParagraphStyleAttributeName:style
        } range:NSMakeRange(0, content.length)];
        [arributedString addAttributes:@{NSLinkAttributeName: @"loanContract://loanContract", NSForegroundColorAttributeName: [UIColor qmui_colorWithHexString:@"#00BF83"]} range:[content rangeOfString:@"《铁塔换电隐私政策》"]];
        _contentView.linkTextAttributes = @{NSForegroundColorAttributeName:[UIColor qmui_colorWithHexString:@"#00BF83"]};
        _contentView.editable = NO;
        _contentView.attributedText = arributedString;
        _contentView.delegate = self;
//        _contentView.selectable = NO;
    }
    return _contentView;
}

// 其他方式修改
-(BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange {
    if ([URL.absoluteString hasPrefix:@"loanContract"]) {
        [self getPrivacyPolicyAgreement];
    }
    return YES;
}

- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange interaction:(UITextItemInteraction)interaction  API_AVAILABLE(ios(10.0)){
    if ([URL.absoluteString hasPrefix:@"loanContract"]) {
        [self getPrivacyPolicyAgreement];
    }
    return YES;
}

- (void)getPrivacyPolicyAgreement {
    BasicCenterApi *centerApi = [[BasicCenterApi alloc] getPrivacyPolicyAgreement];
    [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull model, YTKBaseRequest * _Nonnull request) {
        if (self.mapVC.mapTapHandle) {
            self.mapVC.mapTapHandle(MapViewControllerTapOnlineCustom, @{
                @"html": model,
                @"title": @"铁塔换电隐私政策"});
            [self close];
        }
    } failure:nil];
}



- (void)layoutSubviews {
    [super layoutSubviews];
    self.backgroundView.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame) - 70, CGRectGetMaxY(self.agrementBtn.frame) + 20);
    self.topImageView.frame = CGRectMake(0, 0, CGRectGetWidth(self.backgroundView.frame), 70);
    self.contentView.frame = CGRectMake(20, CGRectGetMaxY(self.topImageView.frame), CGRectGetWidth(self.backgroundView.frame) - 40, 141);
    self.noAgrementBtn.frame = CGRectMake(20, CGRectGetMaxY(self.contentView.frame) + 10, 125, 40);
    self.agrementBtn.frame = CGRectMake(CGRectGetWidth(self.backgroundView.frame) - 20 - 125, CGRectGetMaxY(self.contentView.frame) + 10, 125, 40);
    self.backgroundView.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame) - 70, CGRectGetMaxY(self.agrementBtn.frame) + 20);
    self.backgroundView.center = self.center;
}

- (void)show {
    if (self.isShow) {
        return;
    }
    self.isShow = YES;
    [[UIApplication sharedApplication].keyWindow addSubview:self];
    [UIView animateWithDuration:0.2 delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
        self.alpha = 1;
        self.backgroundView.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
        
    }];
}

- (void)close {
    if (!self.isShow) {
        return;
    }
    [UIView animateWithDuration:0.1 delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
        self.alpha = 0;
        self.backgroundView.transform = CGAffineTransformMakeScale(0.3, 0.3);
    } completion:^(BOOL finished) {
        self.isShow = NO;
    }];
}


@end
