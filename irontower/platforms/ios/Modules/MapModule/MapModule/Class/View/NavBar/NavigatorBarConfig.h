//
//  NavigatorBarConfig.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BatteryView.h"

NS_ASSUME_NONNULL_BEGIN

@interface NavigatorBarConfig : NSObject

@property (nonatomic, strong, readonly) QMUIButton *leftItem;

@property (nonatomic, strong) QMUIButton *msgItem;

@property (nonatomic, strong, readonly) QMUIButton *batteryItem;

@property (nonatomic, strong) BatteryView *batteryView;

@property (nonatomic, copy) void (^leftItemClick)(QMUIButton *leftItem);

@property (nonatomic, copy) void (^batteryItemClick)(void);

@property (nonatomic, copy) void (^msgItemClick)(QMUIButton *msgItem);

- (instancetype)initWithViewController:(UIViewController *)viewController;

- (void)updateNavigatorBar;

@end

NS_ASSUME_NONNULL_END
