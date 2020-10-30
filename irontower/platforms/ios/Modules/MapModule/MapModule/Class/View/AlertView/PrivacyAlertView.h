//
//  PrivacyAlertView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class MapViewController;
@interface PrivacyAlertView : UIView

- (instancetype)initWithFrame:(CGRect)frame controller:(MapViewController *)mapViewController;

- (void)show;

- (void)close;

@end

NS_ASSUME_NONNULL_END
