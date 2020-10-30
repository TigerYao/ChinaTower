//
//  MapModuleResoures.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface MapModuleResoures : NSObject

@property (nonatomic, strong) NSBundle *bundle;

+ (instancetype)sharedInstance;

@end

@interface NSBundle (mapModule)

+ (NSBundle *)mapBundle;
+ (NSString *)mapModule_fileName:(NSString *)fileName;

@end

@interface UIImage (mapModule)

+ (UIImage *)mapModule_imageNamed:(NSString *)imageName;

@end





NS_ASSUME_NONNULL_END
