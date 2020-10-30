//
//  StationListModel.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


@interface BsCabinetResponseListInfo : NSObject

@property (nonatomic, copy) NSString *fullCount;
@property (nonatomic, copy) NSString *emptyCabinCount;

@end


@interface StationListModel : NSObject

@property (nonatomic, copy) NSString *stationLongitude;
@property (nonatomic, copy) NSString *stationLatitude;
@property (nonatomic, copy) NSArray  *bsCabinetResponseList;
@property (nonatomic, copy) NSString *greyFlag; // 0不置灰 1置灰
@property (nonatomic, copy) NSString *stationId;


@end

NS_ASSUME_NONNULL_END
