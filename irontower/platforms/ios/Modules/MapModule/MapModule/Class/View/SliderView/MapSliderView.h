//
//  MapSliderView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/19.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface MapSliderView : UIView

@property (nonatomic, copy) void (^logoutHandle)(void);

@property (nonatomic, copy) void (^checkUpdate)(void);

@property (nonatomic, copy) void (^telCustomerOnLineHandle)(void);

// 邮政电池解绑
@property (nonatomic, copy) void (^postalBatteryUnbound)(void);

- (instancetype)initWithController:(UIViewController *)viewController;

- (void)open;

- (void)close;

- (void)updateSliderView;

@end

NS_ASSUME_NONNULL_END
