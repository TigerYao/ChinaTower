//
//  SliderHeaderTableCell.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/20.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "SliderHeaderTableCell.h"
#import <TTHDApi/TTHDApi.h>

@interface SliderHeaderTableCell ()

@property (nonatomic, strong) UIImageView *iconImageView;
@property (nonatomic, strong) QMUILabel *userNameLabel;
@property (nonatomic, strong) QMUILabel *phoneNumLabel;
@property (nonatomic, strong) QMUILabel *authLabel;
@property (nonatomic, strong) UIImageView *arrowImageView;
@property (nonatomic, strong) QMUILabel *batteryIdLabel;

@end

@implementation SliderHeaderTableCell

- (instancetype)initWithReuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithReuseIdentifier:reuseIdentifier];
    if (self) {
        self.contentView.backgroundColor = UIColorWhite;
        [self setupViews];
    }
    return self;
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (self.headerClickBlock) {
        self.headerClickBlock();
    }
}

- (void)setupViews {
    self.iconImageView = [[UIImageView alloc] init];
    self.iconImageView.layer.cornerRadius = 25;
    self.iconImageView.layer.masksToBounds = YES;
    self.iconImageView.contentMode = UIViewContentModeScaleAspectFill;
   
    [self.contentView addSubview:self.iconImageView];
    
    NSString *avatar = [UserInfo shareManager].userModel.avatar;
    if (avatar.length > 0) {
        [self.iconImageView sd_setImageWithURL:[NSURL URLWithString:[UserInfo shareManager].userModel.avatar]];
    } else {
        NSString *sex = [UserInfo shareManager].userInfo.sex;
        if ([sex isEqualToString:@"1"]) {
            [self.iconImageView setImage:[UIImage mapModule_imageNamed:@"avatar"]];
        } else {
            [self.iconImageView setImage:[UIImage mapModule_imageNamed:@"map-defaulticon"]];
        }
    }
    
    self.userNameLabel = [[QMUILabel alloc] init];
    self.userNameLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightSemibold];
    self.userNameLabel.textColor = [UIColor qmui_colorWithHexString:@"#373D52"];
    self.userNameLabel.text = [UserInfo shareManager].userModel.realName;
    [self.contentView addSubview:self.userNameLabel];
    
    self.phoneNumLabel = [[QMUILabel alloc] init];
    self.phoneNumLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightRegular];
    self.phoneNumLabel.textColor = [UIColor qmui_colorWithHexString:@"#69696D"];
    self.phoneNumLabel.text = [UserInfo shareManager].userInfo.phoneNumber;
    [self.contentView addSubview:self.phoneNumLabel];
    
    self.batteryIdLabel = [[QMUILabel alloc] init];
    self.batteryIdLabel.font = [UIFont systemFontOfSize:REMPX(11) weight:UIFontWeightBold];
    self.batteryIdLabel.textColor = [UIColor qmui_colorWithHexString:@"#69696D"];
    if ([UserInfo shareManager].batteryInfo) {
        self.batteryIdLabel.text = [UserInfo shareManager].batteryInfo[@"batteryId"];
    }
    
    [self.contentView addSubview:self.batteryIdLabel];
    
    self.authLabel = [[QMUILabel alloc] init];
    self.authLabel.font = [UIFont systemFontOfSize:11 weight:UIFontWeightMedium];
    
    if ([[UserInfo shareManager].userModel.certification isEqualToString:@"1"]) {
        self.authLabel.textColor = [UIColor qmui_colorWithHexString:@"#00BF83"];
        self.authLabel.text = @"已认证";
        self.authLabel.backgroundColor = [UIColor colorWithRed:0/255.0 green:191/255.0 blue:131/255.0 alpha:0.08];
    } else {
        self.authLabel.textColor = [UIColor qmui_colorWithHexString:@"#FF5E00"];
        self.authLabel.text = @"未认证";
        self.authLabel.backgroundColor = [UIColor colorWithRed:251/255.0 green:96/255.0 blue:45/255.0 alpha:0.1];
    }

    self.authLabel.layer.cornerRadius = 9;
    self.authLabel.layer.masksToBounds = YES;
    self.authLabel.contentEdgeInsets = UIEdgeInsetsMake(1, 8, 1, 8);
    [self.contentView addSubview:self.authLabel];
    

    self.arrowImageView = [[UIImageView alloc] init];
    self.arrowImageView.image = [UIImage mapModule_imageNamed:@"arrow-right"];
    [self.contentView addSubview:self.arrowImageView];
    
    [self.iconImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(REMPX(40));
        make.left.mas_equalTo(REMPX(20));
        make.width.height.mas_equalTo(50);
        make.bottom.mas_equalTo(-30);
    }];
    
    [self.userNameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.iconImageView.mas_right).offset(13);
        make.right.mas_lessThanOrEqualTo(-40).priorityLow();
        make.top.mas_equalTo(self.iconImageView);
        make.height.mas_equalTo(25);
        make.width.mas_lessThanOrEqualTo(80);
    }];
    
    [self.phoneNumLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.iconImageView.mas_right).offset(13);
        make.right.mas_lessThanOrEqualTo(-40);
        make.top.mas_equalTo(self.userNameLabel.mas_bottom).offset(0);
        make.height.mas_equalTo(20);
    }];
    
    [self.batteryIdLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.iconImageView.mas_right).offset(REMPX(13));
        make.right.mas_lessThanOrEqualTo(-10);
        make.top.mas_equalTo(self.phoneNumLabel.mas_bottom).offset(0);
        make.height.mas_equalTo(20);
    }];
    
    [self.authLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.userNameLabel.mas_right).offset(10);
        make.centerY.mas_equalTo(self.userNameLabel);
        make.height.mas_equalTo(18);
    }];
    
    [self.arrowImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(-15);
        make.centerY.mas_equalTo(0);
        make.width.height.mas_equalTo(16);
    }];
}



@end
