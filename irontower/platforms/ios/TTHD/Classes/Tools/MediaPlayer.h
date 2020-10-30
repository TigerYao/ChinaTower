//
//  MediaPlayer.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/24.
//

#import <Foundation/Foundation.h>


typedef NS_ENUM(NSInteger, MediaType) {
    MediaTypeEleBeyond, // 电量不足
};
NS_ASSUME_NONNULL_BEGIN

@interface MediaPlayer : NSObject

+ (void)playWithType:(MediaType)type;

@end

NS_ASSUME_NONNULL_END
