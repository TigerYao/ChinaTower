//
//  StationActionTableViewCell.h
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "StationDetailModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface StationActionTableViewCell : UITableViewCell

@property (nonatomic, strong) StationDetailModel *detailModel;
@property (nonatomic, copy) void (^stationActionHandle)(void);

@end

NS_ASSUME_NONNULL_END
