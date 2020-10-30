//
//  SliderHeaderTableCell.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/20.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface SliderHeaderTableCell : UITableViewHeaderFooterView

@property (nonatomic, copy) void (^headerClickBlock)(void);

@end

NS_ASSUME_NONNULL_END
