//
//  MapView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ITypeSwitchView.h"

@class MapView,StationListModel, StationDetailModel, NetworkAnnotation;
NS_ASSUME_NONNULL_BEGIN

@protocol MapViewDelegate <NSObject>

@optional
- (void)startSingleLocation:(BMKLocation *)location;

- (void)startRefresh;

- (void)mapView:(MapView *)view centerDidChangeFinish:(CLLocationCoordinate2D)coordinate2D;

- (void)mapView:(MapView *)view switchType:(ITypeSwitchViewType)type;

- (void)mapViewClickStationAnnotationView:(MapView *)view model:(StationListModel *)model;

- (void)mapViewClickNetworkAnnotationView:(MapView *)view model:(NetworkAnnotation*)model;

- (void)mapViewTelCustomClick;

@end

@interface MapView : UIView

@property (nonatomic, weak) id<MapViewDelegate> delegate;

- (instancetype)initWithFrame:(CGRect)frame viewController:(UIViewController *)viewController;

-(void)viewWillAppear:(BOOL)animated;
-(void)viewWillDisappear:(BOOL)animated;
- (void)addStationPointData:(NSArray *)stations;
- (void)addNetworkPointData:(NSArray *)networks;
- (void)setCenterCoordinate:(BMKLocation *)location; // 除了首次 请都点击这里进行定位
- (void)setCenterCoordinate:(BMKLocation *)location zoom:(NSInteger)zoom;

// 增加路线规划，并弹出电柜气泡
- (void)addPolylineViewsShowPopView:(NSArray<StationDetailModel *> *)detailModel model:(StationListModel *)model;

@end

NS_ASSUME_NONNULL_END
