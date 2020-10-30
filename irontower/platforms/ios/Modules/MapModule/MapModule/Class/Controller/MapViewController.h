//
//  MapViewController.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <QCLFoundation/CLBaseViewController.h>
#import <TTHDApi/TTHDApi.h>
#import "SliderModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface MapViewController : CLBaseViewController

@property (nonatomic, strong) UserInfo *userInfo;

@property (nonatomic, copy) void (^mapTapHandle)(MapViewControllerTapType _Nonnull tapType, NSDictionary* _Nullable params);

@property (nonatomic, copy) NSString *(^sqTapHandle)(void);


@end



NS_ASSUME_NONNULL_END
