//
//  UserInfo.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/19.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN


@interface MapUserModel:NSObject

@property (nonatomic, copy) NSString *provinceName;
@property (nonatomic, copy) NSString *deptId;
@property (nonatomic, copy) NSString *accountStatus;
@property (nonatomic, copy) NSString *provinceId;
@property (nonatomic, copy) NSString *optionalPackage;
@property (nonatomic, copy) NSString *integral;
@property (nonatomic, copy) NSString *lastLoginTime;
@property (nonatomic, copy) NSString *loginCount;
@property (nonatomic, copy) NSString *idCard;
@property (nonatomic, copy) NSString *driverType;
@property (nonatomic, copy) NSString *orgType;
@property (nonatomic, copy) NSString *batteryVolts;
@property (nonatomic, copy) NSString *packageName;
@property (nonatomic, copy) NSString *registTime;
@property (nonatomic, copy) NSString *account;
@property (nonatomic, copy) NSString *orgName;
@property (nonatomic, copy) NSString *packageId;
@property (nonatomic, assign) NSInteger availableDays;
@property (nonatomic, copy) NSString *deviceClassify;
@property (nonatomic, copy) NSString *attributionPlatform;
@property (nonatomic, copy) NSString *idCardReverse;
@property (nonatomic, copy) NSString *exitnetTime;
@property (nonatomic, copy) NSString *ifPayDeposit;
@property (nonatomic, copy) NSString *phoneModel;
@property (nonatomic, copy) NSString *packageRemark;
@property (nonatomic, copy) NSString *nickName;
@property (nonatomic, copy) NSString *realName;
@property (nonatomic, copy) NSString *phoneNumber;
@property (nonatomic, copy) NSString *detailedAddress;
@property (nonatomic, copy) NSString *avatar;
@property (nonatomic, copy) NSString *cityName;
@property (nonatomic, copy) NSString *vehicleBrand;
@property (nonatomic, copy) NSString *cityId;
@property (nonatomic, copy) NSString *idCardPositive;
@property (nonatomic, copy) NSString *driverId;
@property (nonatomic, copy) NSString *leaseRent;
@property (nonatomic, copy) NSString *certification;
@property (nonatomic, copy) NSString *realNamePinyin;
@property (nonatomic, copy) NSString *depositAmount;
@property (nonatomic, copy) NSString *depositType;
@property (nonatomic, copy) NSString *packageType;
@property (nonatomic, copy) NSString *balance;
@property (nonatomic, copy) NSString *orgId;
@property (nonatomic, copy) NSString *batteryId;

@end


@interface LoginInfo : NSObject

@property (nonatomic, copy) NSString *account;
@property (nonatomic, copy) NSString *avatar;
@property (nonatomic, copy) NSString *certification;
@property (nonatomic, copy) NSString *cityId;
@property (nonatomic, copy) NSString *deptId;
@property (nonatomic, copy) NSString *driverId;
@property (nonatomic, copy) NSString *idCard;
@property (nonatomic, copy) NSString *lastLoginTime;
@property (nonatomic, assign) NSInteger loginCount;
@property (nonatomic, copy) NSString *nickName;
@property (nonatomic, copy) NSString *orgId;
@property (nonatomic, copy) NSString *phoneNumber;
@property (nonatomic, copy) NSString *provinceId;
@property (nonatomic, copy) NSString *realName;
@property (nonatomic, copy) NSString *realNamePinyin;
@property (nonatomic, copy) NSString *sex;
@property (nonatomic, copy) NSString *token;
@property (nonatomic, copy) NSString *orgType;

@end


@interface UserInfo : NSObject

@property (nonatomic, strong) LoginInfo *userInfo;
@property (nonatomic, strong) MapUserModel *userModel;
@property (nonatomic, assign) BOOL hasBattery;
@property (nonatomic, assign) BOOL isUpdate;
@property (nonatomic, strong) NSDictionary *batteryInfo;
@property (nonatomic, strong) NSDictionary *updateModel; // 更新数据

+ (instancetype)shareManager;

- (void)initialUserInfo;

@end

NS_ASSUME_NONNULL_END
