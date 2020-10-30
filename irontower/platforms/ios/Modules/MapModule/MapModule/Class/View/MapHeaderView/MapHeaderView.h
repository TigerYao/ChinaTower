//
//  MapHeaderView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/24.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN


typedef NS_ENUM(NSInteger, MapHeaderViewType) {
    MapHeaderViewTypeAuth, // 实名
    MapHeaderViewTypeExpire  // 到期
};

@class MapViewController;
@interface MapHeaderView : UIView

- (instancetype)initWithController:(MapViewController *)mapVC;

@property (nonatomic, strong) QMUILabel *tipsLabel;

@property (nonatomic, strong) QMUIButton *rightBtn;

@property (nonatomic, copy) NSString *btnTitle;

@property (nonatomic, copy) void (^headerViewBtnTap)(MapHeaderViewType type);

@property (nonatomic, assign) MapHeaderViewType headerViewType;

@end

NS_ASSUME_NONNULL_END
