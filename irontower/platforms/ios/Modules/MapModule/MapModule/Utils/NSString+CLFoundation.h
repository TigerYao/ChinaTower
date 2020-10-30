//
//  NSString+CLFoundation.h
//  MapModule
//
//  Created by 秦传龙 on 2020/9/9.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (CLFoundation)

- (CGSize)textSizeWithFont:(UIFont *)font maxWidth:(CGFloat)width maxHeight:(CGFloat)height;

@end

NS_ASSUME_NONNULL_END
