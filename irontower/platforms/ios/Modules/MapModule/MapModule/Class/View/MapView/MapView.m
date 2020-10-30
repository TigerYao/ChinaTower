//
//  MapView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapView.h"
#import "MapZoomView.h"
#import "LocationManager.h"
#import "MapPointView.h"
#import "StationPointAnnotation.h"
#import "StationAnnotationView.h"
#import "MapControlButton.h"
#import "StationListModel.h"
#import "NetworkAnnotation.h"
#import "NetworkModel.h"
#import "NetworkAnnotationView.h"
#import <BaiduMapAPI_Search/BMKSearchComponent.h>
#import <CLUIKit/CLUIKit.h>
#import "MapTools.h"
#import "StationActionView.h"
#import "DrivingDistanceAnnotation.h"
#import "DrivingDistanceAnnotationView.h"
#import "PlanAnnotationView.h"
#import "PlanPointAnnotation.h"

@interface MapView ()<BMKMapViewDelegate,BMKRouteSearchDelegate>

@property (nonatomic, weak) UIViewController *viewController;

@property (nonatomic, strong) BMKMapView *mapView;

@property (nonatomic, strong) MapZoomView *zoomView;

@property (nonatomic, strong) MapPointView *pointView;

@property (nonatomic, strong) BMKLocationViewDisplayParam *displayParam;  // 显示跟踪位置的样式

@property (nonatomic, strong) NSMutableArray *annotationList;

@property (nonatomic, assign) CLLocationCoordinate2D coordinate2D;

@property (nonatomic, assign) CLLocationCoordinate2D centerCoordinate2D; // 地图中心点位置

@property (nonatomic, strong) BMKRouteSearch *routeSearch;  // 路线你规划

@property (nonatomic, strong) StationActionView *actionPopView;  // 弹出视图库

@property (nonatomic, assign) ITypeSwitchViewType switchViewType;

@end


@implementation MapView

- (instancetype)initWithFrame:(CGRect)frame viewController:(UIViewController *)viewController {
    self = [super initWithFrame:frame];
    if (self) {
        self.switchViewType = ITypeSwitchViewTypeStation;
        self.viewController = viewController;
        [self initialzeMapView];
        [self initialzeZoomView];
        [self initialzePointView];
        [self initializeControlView];
        [self initializeSwitchView];
        [self didInitiazeStationActionView];
    }
    return self;
}

- (void)viewWillAppear:(BOOL)animated {
    [self.mapView viewWillAppear];
    self.mapView.delegate = self;
}

- (void)viewWillDisappear:(BOOL)animated {
    [self.mapView viewWillDisappear];
    self.mapView.delegate = nil;
}

- (void)initializeSwitchView {
    __weak typeof(self) weakSelf = self;
    ITypeSwitchView *switchView = [[ITypeSwitchView alloc] initWithFrame:CGRectMake(20, CGRectGetHeight(self.frame) - 344 + 94, 40, 150) superview:self];
    [switchView setSwitchHandle:^(ITypeSwitchViewType type) {
        weakSelf.switchViewType = type;
        if (weakSelf.delegate && [weakSelf.delegate respondsToSelector:@selector(mapView:switchType:)]) {
            [weakSelf.pointView startLoading];
            [weakSelf.delegate mapView:weakSelf switchType:type];
        }
    }];
}

- (void)initialzeZoomView {
    self.zoomView = [[MapZoomView alloc] initWithFrame:CGRectMake(CGRectGetWidth(self.frame) - 60, CGRectGetHeight(self.frame) - 339 + 94, 40, 80) mapView:self.mapView];
    [self addSubview:self.zoomView];
}

- (void)initialzeMapView {
    CGRect frame = self.bounds;
    self.mapView = [[BMKMapView alloc]initWithFrame:frame];
    self.mapView.gesturesEnabled = YES;
    self.mapView.delegate = self;
//    [self.mapView setZoomLevel:16];
    self.mapView.showsUserLocation = NO;
    self.mapView.userTrackingMode = BMKUserTrackingModeHeading;
    [self addSubview:self.mapView];

    __weak typeof(self) weakSelf = self;
    LocationManager *manager = [LocationManager sharedManager];
    manager.viewcontroller = self.viewController;
    [manager startSingleLocation:^(BMKLocation * _Nullable location) {
        weakSelf.coordinate2D = location.location.coordinate;
        weakSelf.centerCoordinate2D = location.location.coordinate;
        [weakSelf.mapView setCenterCoordinate:location.location.coordinate];
        [weakSelf setCenterCoordinate:location zoom:16];
        [weakSelf.mapView updateLocationViewWithParam:weakSelf.displayParam];

        if (weakSelf.delegate && [weakSelf.delegate respondsToSelector:@selector(startSingleLocation:)]) {
            [weakSelf.delegate startSingleLocation:location];
        }
    }];
    
}

- (void)setCenterCoordinate:(BMKLocation *)location zoom:(NSInteger)zoom {
    self.coordinate2D = location.location.coordinate;
    self.centerCoordinate2D = location.location.coordinate;
    self.mapView.showsUserLocation = NO;
    self.mapView.userTrackingMode = BMKUserTrackingModeHeading;
     __weak typeof(self) weakSelf = self;
    [[LocationManager sharedManager] startHeading:^(CLHeading * _Nullable heading) {
        BMKUserLocation *userLocation = [[BMKUserLocation alloc] init];
        userLocation.location = location.location;
        [weakSelf.mapView updateLocationData:userLocation];
        weakSelf.mapView.showsUserLocation = YES;
        [weakSelf.mapView updateLocationViewWithParam:weakSelf.displayParam];
    }];
    [self.pointView startAnimation];
    [self.mapView setZoomLevel:zoom];
}



- (void)initializeControlView {
    __weak typeof(self) weakSelf = self;
    [MapControlButton addButtonToSupview:self type:MapControlButtonTypeTel tapBlock:^(UIControl * _Nonnull btn) {
        if (weakSelf.delegate && [weakSelf.delegate respondsToSelector:@selector(mapViewTelCustomClick)]) {
            [weakSelf.delegate mapViewTelCustomClick];
        }
    }];
    
    [MapControlButton addButtonToSupview:self type:MapControlButtonTypeRefresh tapBlock:^(UIControl * _Nonnull btn) {
        if (weakSelf.delegate && [weakSelf.delegate respondsToSelector:@selector(startRefresh)]) {
            [weakSelf.pointView startLoading];
            [weakSelf.delegate startRefresh];
        }
    }];
    
    [MapControlButton addButtonToSupview:self type:MapControlButtonTypeLocation tapBlock:^(UIControl * _Nonnull btn) {
        [[LocationManager sharedManager] startSingleLocation:^(BMKLocation * _Nullable location) {
            [weakSelf setCenterCoordinate:location];
        }];
    }];
}

- (void)setCenterCoordinate:(BMKLocation *)location {
    [self.mapView setCenterCoordinate:location.location.coordinate animated:YES];
    [self.pointView startAnimation];
    [self.mapView setZoomLevel:16];
}

- (void)initialzePointView {
    self.pointView = [[MapPointView alloc] initWithFrame:CGRectMake(CGRectGetMidX(self.bounds)-15, CGRectGetMidY(self.bounds)-30, 30, 30)];
    [self addSubview:self.pointView];
}

- (void)didInitiazeStationActionView {
    
}

- (void)addStationPointData:(NSArray *)stations {
    [self.pointView endLoading];
    [self removeStationView];
    [self.mapView removeAnnotations:self.mapView.annotations];
    for (int i = 0; i < stations.count; i++) {
        StationListModel *model = stations[i];
        StationPointAnnotation* annotation = [[StationPointAnnotation alloc] init];
        annotation.coordinate = CLLocationCoordinate2DMake([model.stationLatitude doubleValue], [model.stationLongitude doubleValue]);
        //设置标注的标题
        annotation.contentList = model.bsCabinetResponseList;
        annotation.greyFlag = model.greyFlag;
        annotation.model = model;
        //副标题
        [_mapView addAnnotation:annotation];
    }
}

// 增加服务站点
- (void)addNetworkPointData:(NSArray *)networks {
    [self.pointView endLoading];
    [self removeStationView];
    [self.mapView removeAnnotations:self.mapView.annotations];
    for (int i = 0; i < networks.count; i++) {
        BsNetworkInfo *model = networks[i];
        NetworkAnnotation *annotation = [[NetworkAnnotation alloc] init];
        annotation.coordinate = CLLocationCoordinate2DMake([model.nodeLatitude doubleValue], [model.nodeLongitude doubleValue]);
        annotation.model = model;
        [_mapView addAnnotation:annotation];
    }
}

/// 增加电站路线规划
- (void)addPolylineViewsShowPopView:(NSArray<StationDetailModel *> *)detailModel model:(StationListModel *)model {

    [self removeStationView];
    self.routeSearch = [[BMKRouteSearch alloc] init];
    self.routeSearch.delegate = self;
    
    BMKPlanNode* start = [[BMKPlanNode alloc] init];
    start.pt = self.coordinate2D;
    
    BMKPlanNode* end = [[BMKPlanNode alloc] init];
    end.pt = CLLocationCoordinate2DMake([model.stationLatitude doubleValue], [model.stationLongitude doubleValue]);
    
    BMKRidingRoutePlanOption *ridingRoutePlanOption= [[BMKRidingRoutePlanOption alloc]init];
    ridingRoutePlanOption.ridingType = 1;
    ridingRoutePlanOption.from = start;
    ridingRoutePlanOption.to = end;
    
    PlanPointAnnotation *planPoint = [PlanPointAnnotation new];
    planPoint.isStart = YES;
    planPoint.coordinate = self.coordinate2D;
    [self.mapView addAnnotation:planPoint];
    
    PlanPointAnnotation *planEndPoint = [PlanPointAnnotation new];
    planEndPoint.isStart = NO;
    planEndPoint.coordinate = end.pt;
    [self.mapView addAnnotation:planEndPoint];
    
    BOOL flag = [self.routeSearch ridingSearch:ridingRoutePlanOption];
    [self.actionPopView removeFromSuperview];
    self.actionPopView = [[StationActionView alloc] init];
    self.actionPopView.detailModel = detailModel;
    self.actionPopView.viewController = (id)self.viewController;
    self.actionPopView.type =  self.switchViewType == ITypeSwitchViewTypeStation ? @"batteryStation" : @"return";  //return  退电指引 batteryStation 换电站
    [self.actionPopView show];
    if (flag) {
        NSLog(@"骑行规划检索发送成功");
    } else{
        NSLog(@"骑行规划检索发送失败");
    }
}

/// 增加服务网点路线规划
- (void)addPolylineNetworkViewsShowPopView:(BsNetworkInfo *)model {
    self.routeSearch = [[BMKRouteSearch alloc] init];
    self.routeSearch.delegate = self;
    
    BMKPlanNode* start = [[BMKPlanNode alloc] init];
    start.pt = self.coordinate2D;
    
    BMKPlanNode* end = [[BMKPlanNode alloc] init];
    end.pt = CLLocationCoordinate2DMake([model.nodeLatitude doubleValue], [model.nodeLongitude doubleValue]);
    
    PlanPointAnnotation *planPoint = [PlanPointAnnotation new];
    planPoint.isStart = YES;
    planPoint.coordinate = self.coordinate2D;
    [self.mapView addAnnotation:planPoint];
    
    PlanPointAnnotation *planEndPoint = [PlanPointAnnotation new];
    planEndPoint.isStart = NO;
    planEndPoint.coordinate = end.pt;
    [self.mapView addAnnotation:planEndPoint];
    
    BMKRidingRoutePlanOption *ridingRoutePlanOption= [[BMKRidingRoutePlanOption alloc]init];
    ridingRoutePlanOption.ridingType = 1;
    ridingRoutePlanOption.from = start;
    ridingRoutePlanOption.to = end;
    
    BOOL flag = [self.routeSearch ridingSearch:ridingRoutePlanOption];
    
    self.actionPopView = nil;
    self.actionPopView = [[StationActionView alloc] init];
    self.actionPopView.detailModel = @[model];
    self.actionPopView.type = @"serviceNetwork";
    self.actionPopView.viewController = (id)self.viewController;
    [self.actionPopView show];
    if (flag) {
        NSLog(@"骑行规划检索发送成功");
    } else{
        NSLog(@"骑行规划检索发送失败");
    }
}

- (void)centerDidChangeFinish:(BMKMapView *)mapView {
    if (self.delegate && [self.delegate respondsToSelector:@selector(mapView:centerDidChangeFinish:)]) {
        [self.pointView startLoading];
        [self.delegate mapView:self centerDidChangeFinish:mapView.centerCoordinate];
    }
}

#pragma mark --- BMKMapViewDelegate  地图代理
- (void)mapView:(BMKMapView *)mapView regionDidChangeAnimated:(BOOL)animated reason:(BMKRegionChangeReason)reason {
    if (reason == BMKRegionChangeReasonGesture) {

        BOOL distancePass = [MapTools distanceWithPoint:mapView.centerCoordinate otherPoint:self.centerCoordinate2D] > 1000;
        BOOL timePass = NO;
        if (self.switchViewType == ITypeSwitchViewTypeStation) {
            timePass = [MapTools getStationLastTimePass];
        }
        
        if (self.switchViewType == ITypeSwitchViewTypeElectricityBack) {
            timePass = [MapTools getReturnStationLastTimePass];
        }
        
        // 只有滑动距离大于500m时才进行网络请求
        if (distancePass || timePass) {
            if (self.switchViewType != ITypeSwitchViewTypeService) {
                [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(centerDidChangeFinish:) object:mapView];
                [self performSelector:@selector(centerDidChangeFinish:) withObject:mapView afterDelay:1];
                self.centerCoordinate2D = mapView.centerCoordinate;
                [self.actionPopView close];
            }
            
        }
    }
}


- (BMKAnnotationView *)mapView:(BMKMapView *)mapView viewForAnnotation:(id<BMKAnnotation>)annotation {
    
    if ([annotation isKindOfClass:[StationPointAnnotation class]]) {
        StationPointAnnotation *annotationInfo = (StationPointAnnotation *)annotation;
        static NSString *reuseIndetifier = @"annotationReuseIndetifier";
        StationAnnotationView *annotationView = (StationAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:reuseIndetifier];
        if (!annotationView) {
            annotationView = [[StationAnnotationView alloc] initWithAnnotation:annotation
                                                               reuseIdentifier:reuseIndetifier];
        }
        [annotationView setElectricCabinetList:annotationInfo.contentList greyFlag:[annotationInfo.greyFlag  isEqualToString:@"1"]];
        annotationView.annotation = annotation;
        return annotationView;
    }
    
    if ([annotation isKindOfClass:[NetworkAnnotation class]]) {
        static NSString *reuseIndetifier = @"NetworkAnnotationReuseIndetifier";
        NetworkAnnotationView *annotationView = (NetworkAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:reuseIndetifier];
        if (!annotationView) {
            annotationView = [[NetworkAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:reuseIndetifier];
        }
        annotationView.annotation = annotation;
        return annotationView;
    }
    
    if ([annotation isKindOfClass:[DrivingDistanceAnnotation class]]) {
        static NSString *reuseIndetifier = @"DrivingDistanceAnnotationReuseIndetifier";
        DrivingDistanceAnnotationView *annotationView = (DrivingDistanceAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:reuseIndetifier];
        if (!annotationView) {
            annotationView = [[DrivingDistanceAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:reuseIndetifier];
        }
        annotationView.annotation = annotation;
        return annotationView;
    }
    
    if ([annotation isKindOfClass:[PlanPointAnnotation class]]) {
        static NSString *reuseIndetifier = @"PlanPointAnnotationReuseIndetifier";
        PlanAnnotationView *annotationView = (PlanAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:reuseIndetifier];
        if (!annotationView) {
            annotationView = [[PlanAnnotationView alloc] initWithAnnotation:annotation reuseIdentifier:reuseIndetifier];
        }
        annotationView.annotation = annotation;
        return annotationView;
    }
    return nil;
}

- (void)mapView:(BMKMapView *)mapView clickAnnotationView:(BMKAnnotationView *)view {
    [self removeStationView];
    
    if ( [view.annotation isKindOfClass:[StationPointAnnotation class]]) {
        StationPointAnnotation *annotation = (StationPointAnnotation *)view.annotation;
        if ([annotation.greyFlag isEqualToString:@"0"]) {
            if (self.delegate && [self.delegate respondsToSelector:@selector(mapViewClickStationAnnotationView:model:)]) {
                [self.delegate mapViewClickStationAnnotationView:self model:annotation.model];
            }
        }
    } else if ([view.annotation isKindOfClass:[NetworkAnnotation class]]) {
        NetworkAnnotation *annotation = (NetworkAnnotation *)view.annotation;
        [self addPolylineNetworkViewsShowPopView:annotation.model];
        if (self.delegate && [self.delegate respondsToSelector:@selector(mapViewClickNetworkAnnotationView:model:)]) {
            [self.delegate mapViewClickNetworkAnnotationView:self model:annotation];
        }
    }
}

- (BMKOverlayView *)mapView:(BMKMapView *)mapView viewForOverlay:(id <BMKOverlay>)overlay {
    if ([overlay isKindOfClass:[BMKPolyline class]]){
        BMKPolylineView *polylineView = [[BMKPolylineView alloc] initWithPolyline:(id)overlay];
        polylineView.strokeColor = [[UIColor alloc] initWithRed:19/255.0 green:107/255.0 blue:251/255.0 alpha:1.0];
        polylineView.lineWidth = 6;
        polylineView.lineJoinType = kBMKLineJoinRound;
        return polylineView;
    }
    return nil;
}


- (void)mapView:(BMKMapView *)mapView onClickedMapBlank:(CLLocationCoordinate2D)coordinate {
    [self removeStationView];
}

#pragma mark --- BMKRouteSearchDelegate
/**
 *返回骑行搜索结果
 *@param searcher 搜索对象
 *@param result 搜索结果，类型为BMKRidingRouteResult
 *@param error 错误号，@see BMKSearchErrorCode
 */
-(void)onGetRidingRouteResult:(BMKRouteSearch*)searcher result:(BMKRidingRouteResult*)result errorCode:(BMKSearchErrorCode)error{
    NSLog(@"onGetRidingRouteResult error:%d", (int)error);
    if (error == BMK_SEARCH_NO_ERROR) {
        //成功获取结果
        BMKRidingRouteLine* plan = (BMKRidingRouteLine*)[result.routes objectAtIndex:0];
        DrivingDistanceAnnotation *annotation = [[DrivingDistanceAnnotation alloc] init];
        annotation.text = [self getDistanceText:plan];
        annotation.coordinate = self.coordinate2D;
        [self.mapView addAnnotation:annotation];
        
        int size = (int)[plan.steps count];
        int pointCount = 0;
        for (int i = 0; i< size; i++) {
            BMKDrivingStep *step = [plan.steps objectAtIndex:i];
            pointCount += step.pointsCount;
        }
        BMKMapPoint *points =  [MapTools getBMKMapPoint:pointCount];
        int k = 0;
        for (int i = 0; i< size; i++) {
            BMKDrivingStep *step = [plan.steps objectAtIndex:i];
            for (int j= 0; j<step.pointsCount; j++) {
                points[k].x = step.points[j].x;
                points[k].y = step.points[j].y;
                k++;
            }
        }
        BMKPolyline *polyLine = [BMKPolyline polylineWithPoints:points count:pointCount];
        [_mapView addOverlay:polyLine];
//        [self mapViewFitPolyLine:polyLine];
        [MapTools deleteTemppoints:points];
    } else if (error == BMK_SEARCH_RESULT_NOT_FOUND){
        [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"距离太远，骑行路线规划失败"];
    } else if (error == BMK_SEARCH_ST_EN_TOO_NEAR){
        [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"距离太近，无需规划骑行路线"];
    } else {
        [MBProgressHUD cl_showFailHUDAddedTo:nil text:@"骑行路线规划失败"];
    }
}

- (NSString *)getDistanceText:(BMKRidingRouteLine*)plan {
    NSString *text = @"";
    
    if (plan.distance > 1000) {
        text = [text stringByAppendingFormat:@"%0.1f公里  ", plan.distance / 1000.f];
    } else {
        text = [text stringByAppendingFormat:@"%d米  ", plan.distance];
    }
    
    if (plan.duration.dates > 0) {
        return [text stringByAppendingFormat:@"%d天%02d小时%02d分钟",plan.duration.dates, plan.duration.hours, plan.duration.minutes];
    }
    
    if (plan.duration.hours > 0) {
        return [text stringByAppendingFormat:@"%d小时%02d分钟", plan.duration.hours, plan.duration.minutes];
    }
    if (plan.duration.minutes > 0) {
        return [text stringByAppendingFormat:@"%d分钟",  plan.duration.minutes];
    }
    
    
    return text;
}


//根据polyline设置地图范围
- (void)mapViewFitPolyLine:(BMKPolyline *) polyLine {
    CGFloat leftTopX, leftTopY, rightBottomX, rightBottomY;
    if (polyLine.pointCount < 1) {
        return;
    }
    BMKMapPoint pt = polyLine.points[0];
    // 左上角顶点
    leftTopX = pt.x;
    leftTopY = pt.y;
    // 右下角顶点
    rightBottomX = pt.x;
    rightBottomY = pt.y;
    for (int i = 1; i < polyLine.pointCount; i++) {
        BMKMapPoint pt = polyLine.points[i];
        leftTopX = pt.x < leftTopX ? pt.x : leftTopX;
        leftTopY = pt.y < leftTopY ? pt.y : leftTopY;
        rightBottomX = pt.x > rightBottomX ? pt.x : rightBottomX;
        rightBottomY = pt.y > rightBottomY ? pt.y : rightBottomY;
    }
    BMKMapRect rect;
    rect.origin = BMKMapPointMake(leftTopX, leftTopY);
    rect.size = BMKMapSizeMake(rightBottomX - leftTopX, rightBottomY - leftTopY);
    UIEdgeInsets padding = UIEdgeInsetsMake(10, 88, 100, 10);
    BMKMapRect fitRect = [_mapView mapRectThatFits:rect edgePadding:padding];
    [_mapView setVisibleMapRect:fitRect];
}


- (void)removeStationView {
    [self.mapView.annotations enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if ([obj isKindOfClass:[DrivingDistanceAnnotation class]] || [obj isKindOfClass:[PlanPointAnnotation class]]) {
            [self.mapView removeAnnotation:obj];
        }
    }];
    
    [self.mapView removeOverlays:self.mapView.overlays];
    [self.actionPopView close];
}

- (BMKLocationViewDisplayParam *)displayParam {
    if (!_displayParam) {
        _displayParam = [[BMKLocationViewDisplayParam alloc] init];
        _displayParam.isAccuracyCircleShow = YES;
    }
    return _displayParam;
}


- (NSMutableArray *)annotationList {
    if (!_annotationList) {
        _annotationList = [NSMutableArray new];
    }
    return _annotationList;
}


- (void)dealloc {
    [self.mapView removeFromSuperview];
    self.mapView = nil;
    NSLog(@"MapView 内存释放");
}


@end
