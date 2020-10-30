//
//  StationActionView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "StationDetailModel.h"

@class MapViewController;
NS_ASSUME_NONNULL_BEGIN

@interface StationActionView : UIView

@property (nonatomic, weak) MapViewController *viewController;
@property (nonatomic, copy) void (^gspBtnHandle)(void);
@property (nonatomic, strong) NSArray<id> *detailModel;
@property (nonatomic, copy) NSString *type; // serviceNetwork 服务网点 return  退电指引 batteryStation 换电站

- (void)show;
- (void)close;
@end

NS_ASSUME_NONNULL_END
