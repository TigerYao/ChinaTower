//
//  BatteryView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "BatteryView.h"

@interface BatteryView ()

@property (nonatomic, strong) UIImageView *backgroundImageView;

@property (nonatomic, strong) QMUILabel *percentLabel;

@property (nonatomic, strong) UIView *fullView;  // 电量填充view

@end


@implementation BatteryView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.hidden = YES;
        [self layoutViews];
    }
    return self;
}

- (void)layoutViews {
    CGFloat bottom = -10;
    CGFloat top = 2;
    CGFloat fontSize = 12;
    if ([[[UIDevice currentDevice] systemVersion] floatValue] < 11) {
        bottom = 0;
        top = 0;
        fontSize = 8;
    }
    
    self.percentLabel = [[QMUILabel alloc] init];
    self.percentLabel.numberOfLines = 1;
    self.percentLabel.textColor = [UIColor qmui_colorWithHexString:@"#ff4f1d"];
    self.percentLabel.font = [UIFont systemFontOfSize:REMPX(fontSize) weight:UIFontWeightSemibold];
    self.percentLabel.textAlignment = NSTextAlignmentCenter;
    self.percentLabel.text = @"0%";
    [self addSubview:self.percentLabel];
    [self.percentLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.height.mas_equalTo(REMPX(11));
        make.top.mas_equalTo(REMPX(top));
    }];
    
    self.backgroundImageView = [[UIImageView alloc] initWithImage:[UIImage mapModule_imageNamed:@"map-battery-icon"]];
    [self addSubview:self.backgroundImageView];
    [self.backgroundImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.centerX.mas_equalTo(0);
        make.top.mas_equalTo(self.percentLabel.mas_bottom).offset(REMPX(1));
        make.bottom.mas_equalTo(REMPX(bottom));
        make.width.mas_equalTo(REMPX(14));
    }];
    
    self.fullView = [[UIView alloc] init];
    self.fullView.backgroundColor = [UIColor qmui_colorWithHexString:@"#ff4f1d"];
    [self addSubview:self.fullView];
    [self.fullView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.mas_equalTo(REMPX(bottom-3));
        make.centerX.mas_equalTo(0);
        make.width.mas_equalTo(REMPX(8));
        make.height.mas_equalTo(REMPX(0.5));
    }];
    
}

- (void)setPercent:(CGFloat)percent {
    self.percentLabel.text = [NSString stringWithFormat:@"%ld%%", (long)percent];
    
    UIColor *color = [UIColor qmui_colorWithHexString:@"#ff4f1d"];
    if (percent >= 30) {
        color = [UIColor qmui_colorWithHexString:@"#00BF8F"];
    } else if (percent >= 20) {
        color = [UIColor orangeColor];
    } else {
        color = [UIColor qmui_colorWithHexString:@"#ff4f1d"];
    }
    
    CGFloat heightRate = 15;
    if ([[[UIDevice currentDevice] systemVersion] floatValue] < 11) {
        heightRate = 12;
    }
    
    CGFloat height = REMPX(heightRate) / 100 * percent;
    [self setNeedsUpdateConstraints];
    [UIView animateWithDuration:0.5 animations:^{
        self.fullView.backgroundColor = color;
        self.percentLabel.textColor = color;
        [self.fullView mas_updateConstraints:^(MASConstraintMaker *make) {
            make.height.mas_equalTo(height);
        }];
        [self layoutIfNeeded];
    }];
    
}

- (void)setIsoutLine:(BOOL)isoutLine {
    _isoutLine = isoutLine;
    if (isoutLine) {
//        self.percentLabel.text = @"离线";
        self.fullView.backgroundColor = [UIColor qmui_colorWithHexString:@"808080"];
        self.percentLabel.textColor = [UIColor qmui_colorWithHexString:@"808080"];
    }
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [super touchesEnded:touches withEvent:event];
    if (self.batteryItemClick) {
        self.batteryItemClick();
    }
}

@end
