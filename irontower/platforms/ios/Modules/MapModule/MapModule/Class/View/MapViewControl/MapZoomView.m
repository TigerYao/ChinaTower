//
//  MapZoomView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapZoomView.h"

@interface MapZoomView ()

@property (nonatomic, weak) BMKMapView *mapView;


@end

@implementation MapZoomView

- (instancetype)initWithFrame:(CGRect)frame mapView:(BMKMapView *)mapView {
    self = [super initWithFrame:frame];
    if (self) {
        self.mapView = mapView;
        [self setupSelfShadow];
        [self setupZoomBtn];
    }
    return self;
}
- (void)setupSelfShadow {
    self.backgroundColor = [UIColor whiteColor];
    self.layer.cornerRadius = 20;
    self.layer.shadowColor = [UIColor colorWithRed:6/255.0 green:4/255.0 blue:30/255.0 alpha:0.08].CGColor;
    self.layer.shadowOffset = CGSizeMake(0,2);
    self.layer.shadowOpacity = 1;
    self.layer.shadowRadius = 5;
}

- (void)setupZoomBtn {
    
    QMUIButton *addZoomBtn = [QMUIButton buttonWithType:UIButtonTypeSystem];
    [addZoomBtn setTitle:@"+" forState:UIControlStateNormal];
    addZoomBtn.titleLabel.font = [UIFont systemFontOfSize:30];
    [addZoomBtn setTitleColor:[UIColor colorWithRed:55/255.0f green:62/255.0f blue:81/255.0f alpha:1] forState:UIControlStateNormal];
    [self addSubview:addZoomBtn];
    [addZoomBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.bottom.mas_equalTo(-CGRectGetHeight(self.frame) / 2);
        make.top.mas_equalTo(3);
    }];
    
    QMUIButton *minusBtn = [QMUIButton buttonWithType:UIButtonTypeSystem];
    [minusBtn setTitle:@"-" forState:UIControlStateNormal];
    minusBtn.titleLabel.font = [UIFont systemFontOfSize:30];
    [minusBtn setTitleColor:[UIColor colorWithRed:55/255.0f green:62/255.0f blue:81/255.0f alpha:1] forState:UIControlStateNormal];
    [self addSubview:minusBtn];
    [minusBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.top.mas_equalTo(CGRectGetHeight(self.frame) / 2);
        make.bottom.mas_equalTo(-3);
    }];
    
    UIView *lineView = [UIView new];
    lineView.backgroundColor = [UIColor qmui_colorWithHexString:@"#F5F5F5"];
    [self addSubview:lineView];
    [lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.height.mas_equalTo(1);
        make.centerY.mas_equalTo(0);
    }];
    
    // 控制
    [addZoomBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
        [self.mapView zoomIn];
    }];
    
    [minusBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
        [self.mapView zoomOut];
    }];
    
}



@end
