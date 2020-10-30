//
//  FooterView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "FooterView.h"

@interface FooterView ()

@property (nonatomic, strong) QMUIButton *sqCodeBtn;


@end


@implementation FooterView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
    }
    return self;
}

- (instancetype)initWithHandle:(void(^)(QMUIButton *sender))btnClick
{
    self = [super init];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        
        self.sqCodeBtn = [QMUIButton buttonWithType:UIButtonTypeSystem];
        [self.sqCodeBtn setTitle:@"扫码换电" forState:UIControlStateNormal];
        [self.sqCodeBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [self.sqCodeBtn setImagePosition:QMUIButtonImagePositionLeft];
        [self.sqCodeBtn setSpacingBetweenImageAndTitle:12];
        self.sqCodeBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        [self.sqCodeBtn setImage:[[UIImage mapModule_imageNamed:@"sq-icon"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forState:UIControlStateNormal];
        self.sqCodeBtn.backgroundColor = [UIColor colorWithRed:0/255.0 green:191/255.0 blue:131/255.0 alpha:1.0];
        self.sqCodeBtn.layer.cornerRadius = 22.5;
        self.sqCodeBtn.layer.shadowColor = [UIColor colorWithRed:0/255.0 green:204/255.0 blue:153/255.0 alpha:0.2].CGColor;
        self.sqCodeBtn.layer.shadowOffset = CGSizeMake(0,6);
        self.sqCodeBtn.layer.shadowOpacity = 1;
        self.sqCodeBtn.layer.shadowRadius = 15;
        [self.sqCodeBtn setQmui_tapBlock:btnClick];
        [self addSubview:self.sqCodeBtn];

        [self.sqCodeBtn mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(15);
            make.right.mas_equalTo(-15);
            make.top.mas_equalTo(17);
            make.height.mas_equalTo(43);
        }];
        
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.layer.shadowColor = [UIColor colorWithRed:0/255.0 green:0/255.0 blue:0/255.0 alpha:0.1].CGColor;
    self.layer.shadowOffset = CGSizeMake(0,-2);
    self.layer.shadowOpacity = 1;
    self.layer.shadowRadius = 5;
}




@end
