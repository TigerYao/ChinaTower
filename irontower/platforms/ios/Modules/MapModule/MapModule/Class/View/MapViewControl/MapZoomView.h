//
//  MapZoomView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface MapZoomView : UIView

- (instancetype)initWithFrame:(CGRect)frame mapView:(BMKMapView *)mapView;

@end

NS_ASSUME_NONNULL_END
