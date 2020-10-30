//
//  BatteryView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface BatteryView : UIView

@property (nonatomic, copy) void (^batteryItemClick)(void);

@property (nonatomic, assign) BOOL isoutLine; // 设备离线

- (void)setPercent:(CGFloat)percent;

@end

NS_ASSUME_NONNULL_END
