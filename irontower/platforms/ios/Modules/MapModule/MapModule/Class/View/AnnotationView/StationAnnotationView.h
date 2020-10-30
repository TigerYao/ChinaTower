//
//  StationAnnotationView.h
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface StationAnnotationView : BMKAnnotationView

- (void)setElectricCabinetList:(NSArray *)list greyFlag:(BOOL)grey;


@end

NS_ASSUME_NONNULL_END
