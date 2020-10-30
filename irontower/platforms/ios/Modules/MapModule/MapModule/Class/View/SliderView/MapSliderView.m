//
//  MapSliderView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/19.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapSliderView.h"
#import "SliderModel.h"
#import "MapViewController.h"
#import "SliderTableViewCell.h"
#import "SliderHeaderTableCell.h"
#import "Utils.h"

static CGFloat const widthRate = 0.75;
static NSString *const SliderTableViewCellIdentifier = @"SliderTableViewCell";
static NSString *const SliderHeaderTableCellIdentifier = @"SliderHeaderTableCell";


@interface MapSliderView ()<UITableViewDelegate, UITableViewDataSource>

@property (nonatomic, weak) UIViewController *viewController;

@property (nonatomic, strong) UIView *backgroundView;

@property (nonatomic, strong) UITableView *tableView;

@property (nonatomic, strong) UIView *footerView;

@property (nonatomic, copy) NSArray *dataSource;

@end


@implementation MapSliderView

- (instancetype)initWithController:(UIViewController *)viewController
{
    self = [super initWithFrame:viewController.view.bounds];
    if (self) {
        self.backgroundColor = [UIColor colorWithWhite:0 alpha:0.2];
        self.viewController = viewController;
        [self didInitaizeView];
        [self initialzeData];
    }
    return self;
}

- (void)initialzeData {
    self.dataSource = [SliderModel mj_objectArrayWithFile:[NSBundle mapModule_fileName:@"Sliderdata.plist"]];
    [UIView performWithoutAnimation:^{
         [self.tableView reloadData];
    }];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    [self close];
}

- (void)didInitaizeView {
    self.backgroundView = [[UIView alloc] init];
    self.backgroundView.backgroundColor = [UIColor whiteColor];
    [self addSubview:self.backgroundView];
    [self.backgroundView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.bottom.mas_equalTo(0);
        make.width.mas_equalTo(widthRate * CGRectGetWidth(self.viewController.view.bounds));
    }];
    
    self.footerView = [[UIView alloc] init];
    [self.backgroundView addSubview:self.footerView];
    [self.footerView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        if (@available(iOS 11.0, *)) {
            make.bottom.mas_equalTo(self.mas_safeAreaLayoutGuideBottom);
        } else {
            // Fallback on earlier versions
            make.bottom.mas_equalTo(0);
        }
        make.height.mas_equalTo(50);
    }];
    
    [self.backgroundView addSubview:self.tableView];
    [self.tableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.bottom.equalTo(self.footerView.mas_top);
        if (@available(iOS 11.0, *)) {
            make.top.equalTo(self.mas_safeAreaLayoutGuideTop);
        } else {
            make.top.mas_equalTo(20);
        }
    }];
    
    [self setFooterSubviews];
}

- (void)setFooterSubviews {
    __weak typeof(self) weakSelf = self;

    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];

    QMUILabel *versionLabel = [[QMUILabel alloc] init];
    versionLabel.text = [@"版本号 V" stringByAppendingString:app_Version];
    versionLabel.font = [UIFont systemFontOfSize:14];
    versionLabel.userInteractionEnabled = YES;
    versionLabel.textColor = [UIColor qmui_colorWithHexString:@"#69696D"];
    [self.footerView addSubview:versionLabel];
    
    UITapGestureRecognizer *tapHandle = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapHandleAction)];
    [versionLabel addGestureRecognizer:tapHandle];
    
    [versionLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(15);
        make.bottom.mas_equalTo(-8);
        make.width.mas_lessThanOrEqualTo(self.frame.size.width / 2);
        make.height.mas_equalTo(30);
    }];
    
    QMUIButton *loginOut = [QMUIButton buttonWithType:UIButtonTypeCustom];
    [loginOut setTitle:@"退出登录" forState:UIControlStateNormal];
    [loginOut setTitleColor:[UIColor qmui_colorWithHexString:@"#69696D"] forState:UIControlStateNormal];
    loginOut.titleLabel.font = [UIFont systemFontOfSize:14];
    [self.footerView addSubview:loginOut];
    [loginOut setQmui_tapBlock:^(__kindof UIControl *sender) {
        [weakSelf close];
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:nil message:@"点击确定后将自动退出到登录页面，是否继续?" preferredStyle:UIAlertControllerStyleActionSheet];
        [alertController addAction:[UIAlertAction actionWithTitle:@"确定退出" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            if (weakSelf.logoutHandle) {
                weakSelf.logoutHandle();
            }
        }]];
        [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
        [self.viewController presentViewController:alertController animated:YES completion:nil];
    }];
    
    [loginOut mas_makeConstraints:^(MASConstraintMaker *make) {
        make.right.mas_equalTo(-20);
        make.bottom.mas_equalTo(-8);
        make.width.mas_lessThanOrEqualTo(self.frame.size.width / 2);
        make.height.mas_equalTo(30);
    }];
}

- (void)tapHandleAction {
    if (self.checkUpdate) {
        self.checkUpdate();
    }
}


- (void)open {
    self.backgroundView.transform = CGAffineTransformMakeTranslation(-widthRate * CGRectGetWidth(self.viewController.view.bounds), 0);
    [[UIApplication sharedApplication].keyWindow addSubview:self];
    [UIView animateWithDuration:0.2 delay:0 options:UIViewAnimationOptionCurveEaseIn  animations:^{
        self.backgroundView.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {}];
}

- (void)close {
    [UIView animateWithDuration:0.2 delay:0 options:UIViewAnimationOptionCurveEaseIn  animations:^{
        self.backgroundView.transform = CGAffineTransformMakeTranslation(-widthRate * CGRectGetWidth(self.viewController.view.bounds), 0);
        self.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
    } completion:^(BOOL finished) {
        [self removeFromSuperview];
    }];
}

#pragma mark --- UITableView

- (UITableView *)tableView {
    if (!_tableView) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.estimatedRowHeight = 44;
        _tableView.estimatedSectionHeaderHeight = 100;
        [_tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:@"UITableViewCell"];
        _tableView.tableFooterView = [UIView new];
        _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
        [_tableView registerClass:[SliderTableViewCell class] forCellReuseIdentifier:SliderTableViewCellIdentifier];
        [_tableView registerClass:[SliderHeaderTableCell class] forHeaderFooterViewReuseIdentifier:SliderHeaderTableCellIdentifier];
        if (@available(iOS 11.0, *)) {
            _tableView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        } else {
            self.viewController.automaticallyAdjustsScrollViewInsets = NO;
        }
    }
    return _tableView;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section {
    
    if (section == 0) {
        __weak typeof(self) weakSelf = self;
        SliderHeaderTableCell *headerView = [tableView dequeueReusableHeaderFooterViewWithIdentifier:SliderHeaderTableCellIdentifier];
        [headerView setHeaderClickBlock:^{
            [weakSelf close];
            [weakSelf tapHandleByType:MapViewControllerTapPersonal params:nil];
        }];
        return headerView;
    }
    return nil;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    SliderModel *model = self.dataSource[indexPath.row];
    SliderTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:SliderTableViewCellIdentifier];
    [cell setCellModel:model];
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    [self close];
    __weak typeof(self) weakSelf = self;
    SliderModel *model = self.dataSource[indexPath.row];
    if ([model.tapType isEqualToString:MapViewControllerTapTel]) {
        // 这里弹出框
        if (self.telCustomerOnLineHandle) {
            self.telCustomerOnLineHandle();
        }
        return;
    }
    
    if ([model.tapType isEqualToString:MapViewControllerTapShare]) {
        // 如果是分享
        BasicCenterApi *centerApi = [[BasicCenterApi alloc] initWithGetAppShareLink];
        [centerApi startRequestWithCompletionBlockWithSuccess:^(id  _Nonnull models, YTKBaseRequest * _Nonnull request) {
            [self tapHandleByType:model.tapType params:@{
                @"type": @"webpage",
                @"title": models[@"appShareTitle"],
                @"url": models[@"appShareLink"],
                @"icon": models[@"appShareImage"],
                @"description": models[@"appShareContent"],
            }];
        } failure:nil];
        return;
    }
    
    if ([model.tapType isEqualToString:MapViewControllerTapQrCodeInvate]) {
        MapUserModel *info = [UserInfo shareManager].userModel;
        if (![info.certification isEqualToString:@"1"]) {
            [Utils showAlertViewController:@"温馨提示" content:@"老带新功能，需实名认证并购买套餐后才能使用。请您确认是否先去实名认证？" cancelBtn:@"取消" okeyBtn:@"确认" okbtnHandle:^{
                [self tapHandleByType:MapViewControllerTapOnlineAuth params:nil];
            } viewController:self.viewController];
        } else if (info.availableDays <= 0) {
            [Utils showAlertViewController:@"温馨提示" content:@"老带新功能，需购买套餐后才能使用。请您确认是否购买套餐？" cancelBtn:@"取消" okeyBtn:@"确认" okbtnHandle:^{
                [self tapHandleByType:MapViewControllerTapMyWallet params:nil];
            } viewController:self.viewController];
        } else {
            [self tapHandleByType:model.tapType params:nil];
        }
        return;
    }
    
    // 如果是邮政用户
    if ([model.tapType isEqualToString:MapViewControllerTapExchangeEleList]) {
        if ([[UserInfo shareManager].userModel.driverType isEqualToString:@"5"]) {
            // 邮政用户
            if (self.postalBatteryUnbound) {
                self.postalBatteryUnbound();
            }
        }
    }
    [weakSelf tapHandleByType:model.tapType params:nil];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    if (scrollView.contentOffset.y <= 0) {
        scrollView.contentOffset = CGPointMake(0, 0);
    }
}


- (void)tapHandleByType:(MapViewControllerTapType)type params:(NSDictionary *)params {
//    [self close];
    MapViewController *mapVC = (MapViewController *)self.viewController;
      if (mapVC.mapTapHandle) {
          mapVC.mapTapHandle(type, params);
      }
}


#pragma mark ---- 更新数据
- (void)updateSliderView {
    [self.tableView qmui_reloadDataWithoutInvalidateIndexPathHeightCache];
}

@end
