//
//  StationPointAnnotation.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>
NS_ASSUME_NONNULL_BEGIN
@class StationListModel;
@interface StationPointAnnotation : BMKPointAnnotation

@property (nonatomic, copy) NSArray *contentList;
@property (nonatomic, copy) NSString *greyFlag;
@property (nonatomic, strong) StationListModel *model;

@end

NS_ASSUME_NONNULL_END
