//
//  SliderTableViewCell.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/20.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "SliderTableViewCell.h"
#import "SliderModel.h"
#import <TTHDApi/TTHDApi.h>

@interface SliderTableViewCell ()

@property (nonatomic, strong) UIImageView *iconImageView;

@property (nonatomic, strong) QMUILabel *titleLabel;

@property (nonatomic, strong) UIImageView *arrowImageView;

@end


@implementation SliderTableViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        [self setupViews];
    }
    return self;
}

- (void)setupViews {
    self.iconImageView = [[UIImageView alloc] init];
    [self.contentView addSubview:self.iconImageView];
    
    self.titleLabel = [[QMUILabel alloc] init];
    self.titleLabel.font = [UIFont systemFontOfSize:16];
    self.titleLabel.textColor = [UIColor qmui_colorWithHexString:@"#06041E"];
    [self.contentView addSubview:self.titleLabel];
    
    self.arrowImageView = [[UIImageView alloc] init];
    self.arrowImageView.image = [UIImage mapModule_imageNamed:@"arrow-right"];
    [self.contentView addSubview:self.arrowImageView];
    
    [self.iconImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(10);
        make.left.mas_equalTo(15);
        make.width.height.mas_equalTo(25);
        make.bottom.mas_equalTo(-10);
    }];
    
    [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.iconImageView.mas_right).offset(15);
        make.centerY.mas_equalTo(0);
        make.right.mas_equalTo(-40);
    }];
    
    [self.arrowImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(-10);
        make.centerY.mas_equalTo(0);
        make.width.height.mas_equalTo(16);
    }];
}

- (void)setCellModel:(SliderModel *)model {
    self.iconImageView.image = [UIImage mapModule_imageNamed:model.icon];
    self.titleLabel.text = model.title;
    if ([model.tapType isEqualToString:MapViewControllerTapExchangeEleList]) {
        if ([[UserInfo shareManager].userModel.driverType isEqualToString:@"5"]) {
            // 邮政用户
            self.titleLabel.text = @"解绑电池";
        }
    }
}



- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
