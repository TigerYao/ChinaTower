//
//  ITypeSwitchView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/21.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "ITypeSwitchView.h"


@interface ITypeSwitchView ()

@property (nonatomic, strong) NSMutableArray *mBtnArr;

@end


@implementation ITypeSwitchView

- (instancetype)initWithFrame:(CGRect)frame superview:(UIView *)superview {
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        self.layer.cornerRadius = CGRectGetWidth(frame)/2;
        self.layer.shadowColor = [UIColor colorWithRed:6/255.0 green:4/255.0 blue:30/255.0 alpha:0.08].CGColor;
        self.layer.shadowOffset = CGSizeMake(0,2);
        self.layer.shadowOpacity = 1;
        self.layer.shadowRadius = 5;
        [self didInitiazeSubviewWithIndex:0];
        [superview addSubview:self];
    }
    return self;
}

- (void)didInitiazeSubviewWithIndex:(NSInteger)index {
    [self.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    
    if (self.switchHandle) {
        self.switchHandle(index);
    }
    
    
    NSArray *selectImages = @[@"station-select-icon",@"service-select-icon",@"electricityBack-select"];
    NSArray *images = @[@"station-icon",@"service-icon",@"electricityBack"];
    NSArray *titles = @[@"换电站", @"服务网点", @"退电指引"];
    
    CGFloat maxY = 8;
    for (int i = 0; i < 3; i++) {
        
        QMUIButton *sender = [QMUIButton buttonWithType:UIButtonTypeCustom];
        sender.frame = CGRectMake(7, maxY, 26, 26);
        if (index == i) {
           [sender setBackgroundImage:[UIImage mapModule_imageNamed:selectImages[i]] forState:UIControlStateNormal];
        } else {
           [sender setBackgroundImage:[UIImage mapModule_imageNamed:images[i]] forState:UIControlStateNormal];
        }
        [sender setQmui_tapBlock:^(__kindof UIControl *sender) {
            [self didInitiazeSubviewWithIndex:i];
            
        }];
        QMUILabel *label = [[QMUILabel alloc] initWithFrame:CGRectMake(2, CGRectGetMaxY(sender.frame) + 2, CGRectGetWidth(self.frame) - 4, 11)];
        label.text = titles[i];
        label.textAlignment = NSTextAlignmentCenter;
        label.font = [UIFont systemFontOfSize:8 weight:UIFontWeightRegular];
        [self addSubview:label];
        [self addSubview:sender];
        
        maxY = CGRectGetMaxY(label.frame) + 8;
    }
    
    
    
    
}

- (NSMutableArray *)mBtnArr {
    if (!_mBtnArr) {
        _mBtnArr = [NSMutableArray new];
    }
    return _mBtnArr;
}

@end
