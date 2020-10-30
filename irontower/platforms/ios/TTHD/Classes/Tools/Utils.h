//
//  Utils.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/26.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Utils : NSObject

+ (BOOL)canOpenWx;

+ (BOOL)canOpenAli;

+ (NSString *)getPhoneName;

+ (void)getAppNetVersion:(void(^)(NSString *version))version;

+ (instancetype)shareUtils;
// 获取当前位置信息
- (void)getCurrentPostion:(void(^)(NSDictionary *position))position error:(void(^)(NSDictionary *error))error;

+ (BOOL)isLocationServiceOpen;
+ (void)openLocationSetting;

// 是否需要重置cordovawebview
+ (void)setShouldSaveUserInfo:(BOOL)shouldSaveUser;
+ (BOOL)getShouldSaveUserInfo;


@end

NS_ASSUME_NONNULL_END
