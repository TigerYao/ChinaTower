//
//  ApiConstant.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ApiConstant : NSObject

/**
 选择用户信息
 */
@property (readonly, class, copy) NSString *selectUserInfo;

/**
  查询范围站点
*/
@property (readonly, class, copy) NSString *selectRangeStationList;

/**
 城市查询站点信息
*/
@property (readonly, class, copy) NSString *selectPronvieOrCity;

/**
 退出登录
 */
@property (readonly, class, copy) NSString *userLoginOut;

/**
  分享
 */
@property (readonly, class, copy) NSString *getAppShareLink;

/**
  邮政电池绑定
 */
@property (readonly, class, copy) NSString *getPostalBatteryBinding;

/**
  查询电池电量
 */
@property (readonly, class, copy) NSString *queryBatteryElectricQuantity;

/**
  首放标识查询
 */
@property (readonly, class, copy) NSString *queryFirstTakeFlag;

/**
  更新用户信息
 */
@property (readonly, class, copy) NSString *updateUserInfo;

/**
    打开电柜
 */
@property (readonly, class, copy) NSString *exchangePowerBusiness;

/**
    城市网点列表信息查询接口
 */
@property (readonly, class, copy) NSString *queryNetworkInfoList;

/**
   退电站点查询
 */
@property (readonly, class, copy) NSString *selectRangeReturnStationList;

/**
  统计查询电柜电池信息
 */
@property (readonly, class, copy) NSString *queryCabinetAndBatteryInfo;

/**
  统计查询退电电柜电池信息
 */
@property (readonly, class, copy) NSString *queryReturnCabinetInfo;

/**
  邮政电池解绑
 */
@property (readonly, class, copy) NSString *getPostalBatteryUnbound;

/**
  查询是否需要升级
*/
@property (readonly, class, copy) NSString *queryUpgrade;

/**
  获取用户协议 getAgreement
 */
@property (readonly, class, copy) NSString *getAgreement;


@end

NS_ASSUME_NONNULL_END
