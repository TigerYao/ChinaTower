//
//  ITypeSwitchView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, ITypeSwitchViewType) {
    ITypeSwitchViewTypeStation,
    ITypeSwitchViewTypeService,
    ITypeSwitchViewTypeElectricityBack,
};


NS_ASSUME_NONNULL_BEGIN

@interface ITypeSwitchView : UIView

- (instancetype)initWithFrame:(CGRect)frame superview:(UIView *)superview;

@property (nonatomic, copy) void (^switchHandle)(ITypeSwitchViewType type);

@end

NS_ASSUME_NONNULL_END
