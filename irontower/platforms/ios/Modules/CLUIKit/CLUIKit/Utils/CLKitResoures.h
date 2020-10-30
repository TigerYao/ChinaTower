//
//  MapModuleResoures.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
NS_ASSUME_NONNULL_BEGIN

@interface CLKitResoures : NSObject

@property (nonatomic, strong) NSBundle *bundle;

+ (instancetype)sharedInstance;

@end

@interface NSBundle (CLUIKit)

+ (NSBundle *)cLUIKitBundle;
+ (NSString *)cLUIKit_fileName:(NSString *)fileName;

@end

@interface UIImage (CLUIKit)

+ (UIImage *)cLUIKit_imageNamed:(NSString *)imageName;

@end





NS_ASSUME_NONNULL_END
