//
//  StationActionView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "StationActionView.h"
#import "StationActionTableViewCell.h"
#import "NetworkModel.h"
#import "NetworkActionTableviewCell.h"
#import <MapViewController.h>
#import "NSString+CLFoundation.h"

@interface StationActionView ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, strong) UIView *backgroundView;

@property (nonatomic, strong) UITableView *tableView;

@property (nonatomic, assign) BOOL isShow;

@property (nonatomic, strong) UIView *footerView;

@property (nonatomic, strong) QMUIButton *gpsBtn; // 导航

@end


@implementation StationActionView

- (instancetype)init {
    
    self = [super init];
    if (self) {

        self.layer.cornerRadius = 10;
        self.layer.masksToBounds = YES;
        self.layer.shadowColor = [UIColor colorWithRed:6/255.0 green:4/255.0 blue:30/255.0 alpha:0.05].CGColor;
        self.layer.shadowOffset = CGSizeMake(0,4);
        self.layer.shadowOpacity = 1;
        self.layer.shadowRadius = 11;
        self.backgroundColor = [UIColor whiteColor];
        [self didInitiazeView];
        
    }
    return self;
}

- (void)setDetailModel:(NSArray<StationDetailModel *> *)detailModel {
    _detailModel = detailModel;
    [self.tableView reloadData];
}

- (UITableView *)tableView {
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.tableFooterView = [UIView new];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.bounces = NO;
        _tableView.estimatedRowHeight = 80;
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        [_tableView registerNib:[UINib nibWithNibName:@"NetworkActionTableviewCell" bundle:[NSBundle mapBundle]] forCellReuseIdentifier:@"NetworkActionTableviewCell"];
        [_tableView registerNib:[UINib nibWithNibName:@"StationActionTableViewCell" bundle:[NSBundle mapBundle]] forCellReuseIdentifier:@"StationActionTableViewCell"];
    }
    return _tableView;
}

- (void)show {
    if (self.isShow) {
        return;
    }
    [self.viewController.view addSubview:self];
    CGFloat height = [self getSelfHeight];
    self.frame = CGRectMake(20, [UIScreen mainScreen].bounds.size.height , [UIScreen mainScreen].bounds.size.width - 40, height);
    [UIView animateWithDuration:0.2 delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
        self.transform = CGAffineTransformMakeTranslation(0, -height - 25);
    } completion:^(BOOL finished) {
        self.isShow = finished;
    }];
}

- (void)close {
    if (!self.isShow) {
        return;
    }
    self.isShow = NO;
    [UIView animateWithDuration:0.2 delay:0 options:UIViewAnimationOptionCurveEaseIn animations:^{
        self.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
        [self removeFromSuperview];
    }];
    
}

#pragma mark -- delegate

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.detailModel.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    id detailModel = self.detailModel[indexPath.row];
    if ([detailModel isKindOfClass:[StationDetailModel class]]) {
        StationActionTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"StationActionTableViewCell"];
        cell.detailModel = detailModel;
        StationDetailModel *model = (StationDetailModel *)detailModel;

        [cell setStationActionHandle:^{

            if ( self.viewController.mapTapHandle) {
                [self close];
                self.viewController.mapTapHandle(MapViewControllertapServiceEleCabinetDetail, @{
                    @"type":self.type,
                    @"cabinetId": model.cabinetId,
                    @"item": [model mj_JSONString],
                                                                                              });
            }
        }];
        return cell;
    }
    
    if ([detailModel isKindOfClass:[BsNetworkInfo class]]) {
        NetworkActionTableviewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"NetworkActionTableviewCell"];
        cell.detailModel = detailModel;
         BsNetworkInfo *model = (BsNetworkInfo *)detailModel;
        [cell setStationActionHandle:^{
            if (self.viewController.mapTapHandle) {
                [self close];
                self.viewController.mapTapHandle(MapViewControllertapServiceNetworkDetail, @{
                    @"type":self.type,
                    @"nodeId":model.nodeId,
                    @"item": [model mj_JSONString]
                 });
            }
        }];
        return cell;
    }
    
    return nil;
}


- (void)didInitiazeView {

//    self.gpsBtn = [QMUIButton new];
//    self.gpsBtn.backgroundColor = [UIColor colorWithRed:53/255.0 green:99/255.0 blue:245/255.0 alpha:1.0];
//    self.gpsBtn.layer.cornerRadius = 20;
//    self.gpsBtn.layer.shadowColor = [UIColor colorWithRed:53/255.0 green:99/255.0 blue:245/255.0 alpha:0.2].CGColor;
//    self.gpsBtn.layer.shadowOffset = CGSizeMake(0,4);
//    self.gpsBtn.layer.shadowOpacity = 1;
//    self.gpsBtn.layer.shadowRadius = 8;
//    [self addSubview:self.gpsBtn];
//
//    __weak typeof(self) weakSelf = self;
//    [self.gpsBtn setQmui_tapBlock:^(__kindof UIControl *sender) {
//        if (weakSelf.gspBtnHandle) {
//            weakSelf.gspBtnHandle();
//        }
//    }];
//    [self.gpsBtn setTitle:@"骑行导航" forState:UIControlStateNormal];
//    [self.gpsBtn setTitleColor:UIColor.whiteColor forState:UIControlStateNormal];
//    [self.gpsBtn mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.bottom.mas_equalTo(-15);
//        make.left.mas_equalTo(30);
//        make.height.mas_equalTo(40);
//        make.right.mas_equalTo(-30);
//    }];
//
//    UIView *lineView = [[UIView alloc] init];
//    lineView.layer.backgroundColor = [UIColor colorWithRed:243/255.0 green:243/255.0 blue:243/255.0 alpha:1.0].CGColor;
//    [self addSubview:lineView];
//    [lineView mas_makeConstraints:^(MASConstraintMaker *make) {
//        make.left.mas_equalTo(17);
//        make.right.mas_equalTo(-17);
//        make.bottom.mas_equalTo(self.gpsBtn.mas_top).offset(-15);
//        make.height.mas_equalTo(1);
//    }];
    
    [self addSubview:self.tableView];
    [self.tableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.bottom.top.left.right.mas_equalTo(0);
//        make.bottom.mas_equalTo(lineView.mas_top);
    }];
    
}

- (void)layoutSubviews{
    [super layoutSubviews];
}


- (CGFloat)getSelfHeight {
    NSUInteger count = self.detailModel.count;
    if (count > 2) {
        count = 2;
    }
    CGFloat height = 0;

    if (count >  0) {
        id detailModel = self.detailModel[0];
        if ([detailModel isKindOfClass:[BsNetworkInfo class]]) {
            height = 55;
            BsNetworkInfo *info = (BsNetworkInfo *)detailModel;
            height += [info.nodeName textSizeWithFont:[UIFont systemFontOfSize:16 weight:UIFontWeightMedium] maxWidth: SCREEN_WIDTH - 96  maxHeight:MAXFLOAT].height;
            height += [info.nodeAddress textSizeWithFont:[UIFont systemFontOfSize:12] maxWidth:SCREEN_WIDTH - 96 - 42 maxHeight:MAXFLOAT].height;
        } else if ([detailModel isKindOfClass:[StationDetailModel class]]) {
            for (int i = 0; i < count; i++) {
                height += 130;
                StationDetailModel *info =  self.detailModel[i];
                height += [info.cabinetName textSizeWithFont:[UIFont systemFontOfSize:16 weight:UIFontWeightMedium] maxWidth:0.53 * SCREEN_WIDTH - 10 maxHeight:MAXFLOAT].height;
                height += [info.cabinetAddress textSizeWithFont:[UIFont systemFontOfSize:12] maxWidth:0.53 * SCREEN_WIDTH - 27 maxHeight:MAXFLOAT].height;
                
            }
        }
    }
    
    return  height;
}

@end
