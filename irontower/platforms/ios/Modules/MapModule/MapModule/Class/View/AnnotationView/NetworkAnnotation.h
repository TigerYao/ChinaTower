//
//  NetworkAnnotation.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN
@class BsNetworkInfo;
@interface NetworkAnnotation : BMKPointAnnotation

@property (nonatomic, strong) BsNetworkInfo *model;

@end

NS_ASSUME_NONNULL_END
