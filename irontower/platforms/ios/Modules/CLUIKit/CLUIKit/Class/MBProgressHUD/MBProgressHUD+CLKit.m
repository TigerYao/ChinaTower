//
//  MBProgressHUD+CLKit.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/20.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MBProgressHUD+CLKit.h"
#import "CLKitResoures.h"

typedef NS_ENUM(NSInteger, MBProgressHUDStatus) {
    MBProgressHUDStatusSuccess,
    MBProgressHUDStatusFail,
    MBProgressHUDStatusWarn
};


@interface MBProgressCustomView : UIView

@property (nonatomic, strong) UIImageView *imageView;

@end

@implementation MBProgressCustomView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.translatesAutoresizingMaskIntoConstraints = NO;
        self.imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 32, 32)];
        [self addSubview:self.imageView];
    }
    return self;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

- (void)success {
    self.imageView.image = [UIImage cLUIKit_imageNamed:@"hud-success"];
}

- (void)failed {
    self.imageView.image = [UIImage cLUIKit_imageNamed:@"hud-fail"];
}

- (void)warn {
    self.imageView.image = [UIImage cLUIKit_imageNamed:@"hud-warn"];
}

- (CGSize)intrinsicContentSize {
    return CGSizeMake(32, 38);
}

@end

@implementation MBProgressHUD (CLKit)

+ (instancetype)cl_showWarnHUDAddedTo:(UIView *)view {
    return [self cl_showStatusHUDAddedTo:view text:@"" delay:2 status:MBProgressHUDStatusWarn];
}

+ (instancetype)cl_showWarnHUDAddedTo:(UIView *)view text:(NSString *)text {
    return [self cl_showStatusHUDAddedTo:view text:text delay:2 status:MBProgressHUDStatusWarn];
}

+ (instancetype)cl_showFailHUDAddedTo:(UIView *)view {
    return [self cl_showStatusHUDAddedTo:view text:@"" delay:2 status:MBProgressHUDStatusFail];
}

+ (instancetype)cl_showFailHUDAddedTo:(UIView *)view text:(NSString *)text {
    return [self cl_showStatusHUDAddedTo:view text:text delay:2 status:MBProgressHUDStatusFail];
}

+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view {
    return [self cl_showStatusHUDAddedTo:view text:@"" delay:2 status:MBProgressHUDStatusSuccess];
}

+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view text:(NSString *)text {
    return [self cl_showStatusHUDAddedTo:view text:text delay:2 status:MBProgressHUDStatusSuccess];
}

+ (instancetype)cl_showSuccessHUDAddedTo:(UIView *)view text:(NSString *)text delay:(NSTimeInterval)delay {
    return [self cl_showStatusHUDAddedTo:view text:text delay:delay status:MBProgressHUDStatusSuccess];
}

+ (instancetype)cl_showLoadingAddedTo:(UIView *)view {
    return [self cl_showTextAddedTo:view text:@""];
}

+ (instancetype)cl_showTextAddedTo:(UIView *)view text:(NSString *)text {
    return [self cl_showTextAddedTo:view text:text delay:2];
}

+ (instancetype)cl_showSuccessAddedTo:(UIView *)view text:(NSString *)text delay:(NSTimeInterval)delay {
    MBProgressHUD *hud = [self hudBasicConfigAddedTo:view];
    hud.mode = MBProgressHUDModeText;
    hud.margin = 10;
    [hud hideAnimated:YES afterDelay:delay];
    return hud;
}

+ (instancetype)cl_showLoadingAddedTo:(UIView *)view text:(NSString *)text {
    [UIActivityIndicatorView appearanceWhenContainedInInstancesOfClasses:@[[MBProgressHUD class]]].color = [UIColor whiteColor];
    MBProgressHUD *hud = [self hudBasicConfigAddedTo:view];
    hud.minSize = CGSizeMake(40, 40);
    if (text || text.length > 0) {
        hud.detailsLabel.textColor = [UIColor whiteColor];
        hud.detailsLabel.text = text;
        hud.margin = 15;
    }
    return hud;
}

+ (instancetype)cl_showTextAddedTo:(UIView *)view text:(NSString *)text delay:(NSTimeInterval)delay {
    MBProgressHUD *hud = [self hudBasicConfigAddedTo:view];
    hud.mode = MBProgressHUDModeText;
    hud.detailsLabel.text = text;
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.margin = 10;
    [hud hideAnimated:YES afterDelay:delay];
    return hud;
}

+ (instancetype)hudBasicConfigAddedTo:(UIView *)view {
    UIView *superview = view;
    if (!view || CGRectEqualToRect(view.frame, CGRectZero)) {
        superview = [UIApplication sharedApplication].keyWindow;
    }
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:superview animated:YES];
    hud.bezelView.style = MBProgressHUDBackgroundStyleSolidColor;
    hud.bezelView.color = [UIColor colorWithWhite:0 alpha:0.89];
    hud.detailsLabel.textColor = [UIColor whiteColor];
    hud.removeFromSuperViewOnHide = YES;
    return hud;
}

+ (instancetype)cl_showStatusHUDAddedTo:(UIView *)view text:(NSString *)text delay:(NSTimeInterval)delay status:(MBProgressHUDStatus)status {
    MBProgressHUD *hud = [self hudBasicConfigAddedTo:view];
    hud.mode = MBProgressHUDModeCustomView;
    hud.margin = 15;
    MBProgressCustomView *customView = [[MBProgressCustomView alloc] init];
    switch (status) {
        case MBProgressHUDStatusSuccess:
            [customView success];
            break;
        case MBProgressHUDStatusFail:
            [customView failed];
            break;
        case MBProgressHUDStatusWarn:
            [customView warn];
            break;
            
        default:
            break;
    }
    hud.customView = customView;
    if (text && text.length > 0) {
        hud.detailsLabel.text = text;
        hud.detailsLabel.preferredMaxLayoutWidth = 120;
        hud.detailsLabel.textColor = [UIColor whiteColor];
    }
    hud.minSize = CGSizeMake(80, 80);
    [hud hideAnimated:YES afterDelay:delay];
    return hud;
}

@end
