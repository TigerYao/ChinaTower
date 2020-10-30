//
//  MapHeaderView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/24.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapHeaderView.h"
#import "MapViewController.h"

@interface MapHeaderView ()

@property (nonatomic, weak) MapViewController *mapVC;

@property (nonatomic, strong) UIView *backgroundView;

@end


@implementation MapHeaderView

- (instancetype)initWithController:(MapViewController *)mapVC
{
    self = [super initWithFrame:CGRectMake(0, 0, CGRectGetWidth(mapVC.view.frame), 66)];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        self.mapVC = mapVC;
        [self didInitialzeView];
        
    }
    return self;
}

- (void)didInitialzeView {
    [self addSubview:self.backgroundView];
    [self.backgroundView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(15);
        make.right.mas_equalTo(-15);
        make.top.mas_equalTo(11);
        make.bottom.mas_equalTo(-11);
    }];
    
    [self.backgroundView addSubview:self.rightBtn];
    [self.rightBtn mas_remakeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(-15);
        make.height.mas_equalTo(26);
        make.centerY.mas_equalTo(0);
    }];
    
    [self.backgroundView addSubview:self.tipsLabel];
    [self.tipsLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(15);
        make.height.mas_equalTo(20);
        make.centerY.mas_equalTo(0);
        make.right.mas_equalTo(self.rightBtn.mas_left).offset(-15).priorityLow();
    }];
    
    
    
}

- (UIView *)backgroundView {
    if (!_backgroundView) {
        _backgroundView = [UIView new];
        _backgroundView.layer.cornerRadius = 4;
        _backgroundView.layer.masksToBounds = YES;
        _backgroundView.backgroundColor = [UIColor colorWithRed:255/255.0 green:94/255.0 blue:0/255.0 alpha:0.08];
    }
    return _backgroundView;
}

- (QMUILabel *)tipsLabel {
    if (!_tipsLabel) {
        _tipsLabel = [[QMUILabel alloc] init];
        _tipsLabel.textColor = [UIColor qmui_colorWithHexString:@"#FB602D"];
        _tipsLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
    }
    return _tipsLabel;
}

- (QMUIButton *)rightBtn {
    if (!_rightBtn) {
        _rightBtn = [[QMUIButton alloc] init];
        [_rightBtn setTitleColor:[UIColor qmui_colorWithHexString:@"#fff"] forState:UIControlStateNormal];
        [_rightBtn setBackgroundColor:[UIColor qmui_colorWithHexString:@"#FF5E00"]];
        _rightBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
        _rightBtn.contentEdgeInsets = UIEdgeInsetsMake(0, 13, 0, 13);
        _rightBtn.layer.cornerRadius = 13;
        _rightBtn.layer.masksToBounds = YES;
        __weak __typeof(self) weakSelf = self;
        [_rightBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
            if (weakSelf.headerViewBtnTap) {
                weakSelf.headerViewBtnTap(weakSelf.headerViewType);
            }
        }];
    }
    return _rightBtn;
}

- (void)setBtnTitle:(NSString *)btnTitle {
    _btnTitle = btnTitle;
    [self.rightBtn setTitle:btnTitle forState:UIControlStateNormal];
}


@end
