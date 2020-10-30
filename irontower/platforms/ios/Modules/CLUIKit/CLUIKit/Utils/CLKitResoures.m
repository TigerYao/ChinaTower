//
//  MapModuleResoures.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "CLKitResoures.h"

@implementation CLKitResoures


+ (instancetype)sharedInstance
{
    static id sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[self alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.bundle = [NSBundle bundleForClass:[self class]];
    }
    return self;
}

@end

@implementation NSBundle (CLUIKit)

+ (NSBundle *) cLUIKitBundle{
    return CLKitResoures.sharedInstance.bundle;
}

+ (NSString *)cLUIKit_fileName:(NSString *)fileName {
    return [[NSBundle cLUIKitBundle] pathForResource:fileName ofType:nil];
}

@end

@implementation UIImage (CLUIKit)

+ (UIImage *)cLUIKit_imageNamed:(NSString *)imageName {
    return [UIImage imageNamed:imageName inBundle:[NSBundle cLUIKitBundle] compatibleWithTraitCollection:nil];
}

@end
