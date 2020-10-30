//
//  NavigatorBarConfig.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "NavigatorBarConfig.h"
#import <TTHDApi/TTHDApi.h>

@interface NavigatorBarConfig ()

@property (nonatomic, weak) UIViewController *viewController;


@end


@implementation NavigatorBarConfig

- (instancetype)initWithViewController:(UIViewController *)viewController {
    self = [super init];
    if (self) {
        self.viewController = viewController;
        [self configLeftItem];
        [self configTitleView];
        [self configRightItems];
        
    }
    return self;
}

- (void)configLeftItem {
    _leftItem = [[QMUIButton alloc] init];
    _leftItem.layer.masksToBounds = YES;
    _leftItem.layer.cornerRadius = 16;
    _leftItem.qmui_width = 32;
    _leftItem.qmui_height = 32;
    __weak __typeof(self) weakSelf = self;
    
    [_leftItem setBackgroundImage:[UIImage mapModule_imageNamed:@"map-defaulticon"] forState:UIControlStateNormal];
    self.viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:_leftItem];
    [_leftItem setQmui_tapBlock:^(__kindof UIControl *sender) {
        if (weakSelf.leftItemClick) {
            weakSelf.leftItemClick(sender);
        }
    }];
}

- (void)updateNavigatorBar {
    NSString *avatar = [UserInfo shareManager].userModel.avatar;
    if (avatar.length > 0) {
        [_leftItem sd_setBackgroundImageWithURL:[NSURL URLWithString:[UserInfo shareManager].userModel.avatar] forState:UIControlStateNormal];
        return;
    }
    
    NSString *sex = [UserInfo shareManager].userInfo.sex;
    if ([sex isEqualToString:@"0"]) {
        [_leftItem setBackgroundImage:[UIImage mapModule_imageNamed:@"map-defaulticon"] forState:UIControlStateNormal];
    } else {
        [_leftItem setBackgroundImage:[UIImage mapModule_imageNamed:@"avatar"] forState:UIControlStateNormal];
    }

}

- (void)configTitleView {
    UIImageView *titleView = [[UIImageView alloc] init];
    titleView.image = [UIImage imageNamed:@"map-titleView" inBundle:[NSBundle bundleForClass:[self class]] compatibleWithTraitCollection:nil];
    titleView.qmui_width = 98;
    titleView.qmui_height = 32;
    self.viewController.navigationItem.titleView = titleView;
}

- (void)configRightItems {
    
    self.msgItem = [[QMUIButton alloc] init];
    self.msgItem.layer.masksToBounds = YES;
    self.msgItem.layer.cornerRadius = 17.5;
    self.msgItem.qmui_width = 32;
    self.msgItem.qmui_height = 32;
    __weak typeof(self) weakSelf = self;
    [self.msgItem setBackgroundImage:[UIImage mapModule_imageNamed:@"map-msgicon"] forState:UIControlStateNormal];
    UIBarButtonItem *msgBarItem = [[UIBarButtonItem alloc] initWithCustomView:self.msgItem];
    [self.msgItem setQmui_tapBlock:^(__kindof UIControl *sender) {
        if (weakSelf.msgItemClick) {
            weakSelf.msgItemClick(sender);
        }
    }];
    
    CGFloat width = 20;
    if ([[[UIDevice currentDevice] systemVersion] floatValue] < 11) {
        width = 25;
    }
    _batteryView = [[BatteryView alloc] initWithFrame:CGRectMake(0, 0, 25, 32)];
    [_batteryView setBatteryItemClick:^() {
        if (weakSelf.batteryItemClick) {
            weakSelf.batteryItemClick();
        }
    }];
    UIBarButtonItem *batteryBarItem = [[UIBarButtonItem alloc] initWithCustomView:_batteryView];
    self.viewController.navigationItem.rightBarButtonItems = @[msgBarItem, batteryBarItem];
}

@end
