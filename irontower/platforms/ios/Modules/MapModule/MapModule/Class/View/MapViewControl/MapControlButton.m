//
//  MapControlButton.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapControlButton.h"

@implementation MapControlButton

+ (void)addButtonToSupview:(UIView *)superview type:(MapControlButtonType)type tapBlock:(void (^)(UIControl *))tapBlock {
    QMUIButton *btn = [QMUIButton buttonWithType:UIButtonTypeSystem];
    [btn setQmui_tapBlock:tapBlock];
    [superview addSubview:btn];
    switch (type) {
        case MapControlButtonTypeTel:
           [btn setBackgroundImage:[UIImage mapModule_imageNamed:@"customer-icon"] forState:UIControlStateNormal];
            btn.frame = CGRectMake(15, CGRectGetHeight(superview.frame) - 160 + 94, 50, 50);
            break;
        case MapControlButtonTypeRefresh:
            [btn setBackgroundImage:[UIImage mapModule_imageNamed:@"refresh-icon"] forState:UIControlStateNormal];
            btn.frame = CGRectMake(CGRectGetWidth(superview.frame) - 65 , CGRectGetHeight(superview.frame) - 230 + 94, 50, 50);

            break;
        case MapControlButtonTypeLocation:
            [btn setBackgroundImage:[UIImage mapModule_imageNamed:@"location-icon"] forState:UIControlStateNormal];
            btn.frame = CGRectMake(CGRectGetWidth(superview.frame) - 65, CGRectGetHeight(superview.frame) - 160 + 94, 50, 50);
            break;
        default:
            break;
    }
    
    
}

@end
