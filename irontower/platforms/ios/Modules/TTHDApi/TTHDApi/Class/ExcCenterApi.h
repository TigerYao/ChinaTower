//
//  ExcCenterApi.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "HDBaseRequest.h"

NS_ASSUME_NONNULL_BEGIN

@interface ExcCenterApi : HDBaseRequest

/// 邮政电池绑定
- (instancetype)initWithGetPostalBatteryBinding:(NSString *)code;

/// 查询电池电量信息
- (instancetype)initWithQueryBatteryElectricQuantity;

/// 首放标识查询
- (instancetype)initWithQueryFirstTakeFlag;

/// 扫码网络解析
- (instancetype)exchangePowerBusiness:(NSDictionary *)params;

/// 查询范围站点
- (instancetype)selectRangeStationList:(NSDictionary *)params;

/// 查询城市服务网点接口
- (instancetype)queryNetworkInfoList:(NSDictionary *)params;

/// 退电指引站点查询
- (instancetype)selectRangeReturnStationList:(NSDictionary *)params;

/// 统计查询电柜电池信息
- (instancetype)queryCabinetAndBatteryInfo:(NSDictionary *)params;

/// 统计查询退电电柜电池信息
- (instancetype)queryReturnCabinetInfo:(NSDictionary *)params;

/// 邮政电池解绑
- (instancetype)getPostalBatteryUnbound:(NSDictionary *)params;

@end

NS_ASSUME_NONNULL_END
