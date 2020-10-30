//
//  MapControlButton.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSUInteger, MapControlButtonType) {
    MapControlButtonTypeTel,
    MapControlButtonTypeRefresh,
    MapControlButtonTypeLocation,
};

NS_ASSUME_NONNULL_BEGIN

@interface MapControlButton : NSObject

+ (void)addButtonToSupview:(UIView *)superview type:(MapControlButtonType)type tapBlock:(void (^)(UIControl *))tapBlock;

@end

NS_ASSUME_NONNULL_END
