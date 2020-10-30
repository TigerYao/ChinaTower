//
//  JEAuthorityTool.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/4/20.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>

NS_ASSUME_NONNULL_BEGIN

@interface JEAuthorityTool : NSObject

/**
 请求定位权限

 @param block 结果
 */
+(void)je_authorityLocationRequest:(void(^)(BOOL granted,
                                            CLAuthorizationStatus status))block;

/**
 *  获取定位使用权限
 *
 *  @param location BOOL 表示系统所有app有没有打开定位  status app的定位权限状态
*/
+(void)je_authorityLocation:(void(^)(BOOL canLocation ,
                                     CLAuthorizationStatus status))location;

@end

NS_ASSUME_NONNULL_END
