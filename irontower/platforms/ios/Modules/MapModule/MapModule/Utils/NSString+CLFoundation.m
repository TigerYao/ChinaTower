//
//  NSString+CLFoundation.m
//  MapModule
//
//  Created by 秦传龙 on 2020/9/9.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "NSString+CLFoundation.h"

@implementation NSString (CLFoundation)

- (CGSize)textSizeWithFont:(UIFont *)font maxWidth:(CGFloat)width maxHeight:(CGFloat)height {
    CGRect rect = [self boundingRectWithSize:CGSizeMake(width, height)//限制最大的宽度和高度
                                     options:NSStringDrawingTruncatesLastVisibleLine | NSStringDrawingUsesFontLeading  | NSStringDrawingUsesLineFragmentOrigin //采用换行模式
                                  attributes:@{ NSFontAttributeName: font }//传人的字体字典
                                     context:nil];
    return rect.size;
}


@end
