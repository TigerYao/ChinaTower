//
//  StationDetailModel.h
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BsBatteryInfo : NSObject

@property (nonatomic, copy) NSString *batteryId;
@property (nonatomic, copy) NSString *batteryVoltage;
@property (nonatomic, copy) NSString *batteryStatus;
@property (nonatomic, copy) NSString *lastBindCabinet;

@end

@interface StationDetailModel : NSObject

@property (nonatomic, copy) NSString *cabinetId;
@property (nonatomic, copy) NSString *cabinetName;
@property (nonatomic, copy) NSString *cabinetAddress;
@property (nonatomic, copy) NSString *cabinetStatus;
@property (nonatomic, copy) NSString *cabinCount;
@property (nonatomic, copy) NSString *fullCount60;
@property (nonatomic, copy) NSString *notFullCount60;
@property (nonatomic, copy) NSString *fullCount48;
@property (nonatomic, copy) NSString *notFullCount48;
@property (nonatomic, copy) NSString *fullCount;
@property (nonatomic, copy) NSString *notFullCount;
@property (nonatomic, copy) NSArray *bsBatteryInfoList;

@end

NS_ASSUME_NONNULL_END
