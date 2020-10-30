//
//  NetworkActionTableviewCell.h
//  MapModule
//
//  Created by 秦传龙 on 2020/9/2.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@class BsNetworkInfo;
@interface NetworkActionTableviewCell : UITableViewCell

@property (nonatomic, strong) BsNetworkInfo *detailModel;

@property (nonatomic, copy) void (^stationActionHandle)(void);


@end

NS_ASSUME_NONNULL_END
