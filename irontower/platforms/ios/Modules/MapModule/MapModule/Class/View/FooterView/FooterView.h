//
//  FooterView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface FooterView : UIView

- (instancetype)initWithHandle:(void(^)(QMUIButton *sender))btnClick;

@end

NS_ASSUME_NONNULL_END
