//
//  NetworkModel.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface BsNetworkInfo : NSObject

@property (nonatomic, copy) NSString *nodeId;
@property (nonatomic, copy) NSString *nodeName;
@property (nonatomic, copy) NSString *nodeStatus;
@property (nonatomic, copy) NSString *nodeLongitude;
@property (nonatomic, copy) NSString *nodeLatitude;
@property (nonatomic, copy) NSString *nodeAddress;
@property (nonatomic, copy) NSString *provinceId;
@property (nonatomic, copy) NSString *cityId;
@property (nonatomic, copy) NSString *openTime;
@property (nonatomic, copy) NSString *closeTime;
@property (nonatomic, copy) NSString *operatorName;
@property (nonatomic, copy) NSString *operatorPhone;
@property (nonatomic, copy) NSString *operatorEmail;
@property (nonatomic, copy) NSString *operateTime;
@property (nonatomic, copy) NSString *deptId;

@end


@interface NetworkModel : NSObject

@property (nonatomic, copy) NSArray *bsNetworkInfoList;


@end

NS_ASSUME_NONNULL_END
