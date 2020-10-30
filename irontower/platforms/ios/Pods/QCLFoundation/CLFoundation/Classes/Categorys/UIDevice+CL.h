//
//  UIDevice+CL.h
//  CLFoundation_Example
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 LimMem. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface UIDevice (CL)

/// 获取设备uuid
@property (copy, class, readonly) NSString *UUIDString;

/// 系统版本号
@property (copy, class, readonly) NSString *systemVersion;

/// 设备名称
@property (copy, class, readonly) NSString *deviceModel;

/// info plist 信息
@property (copy, class, readonly) NSDictionary *infoDictionary;

/// app BundleId
@property (copy, class, readonly) NSString *bundleId;

/// App build号
@property (copy, class, readonly) NSString *buildNumber;

/// App版本号
@property (copy, class, readonly) NSString *appVersion;

/// 广告id标识符
@property (copy, class, readonly) NSString *advertisingIdentifier;

///上次手机重启时间
@property (copy, class, readonly) NSDate *lastRestartDate;

/// 获取电池电量
@property (assign, class, readonly) CGFloat batteryLevel;

/// 获取磁盘总空间
@property (assign, class, readonly) int64_t totalDiskSpace;

/// 获取剩余磁盘空间
@property (assign, class, readonly) int64_t freeDiskSpace;

/// 获取已用磁盘空间
@property (assign, class, readonly) int64_t usedDiskSpace;

/// 获取设备型号然后手动转化为对应名称
@property (copy, class, readonly) NSString *getDeviceName;


@end

NS_ASSUME_NONNULL_END
