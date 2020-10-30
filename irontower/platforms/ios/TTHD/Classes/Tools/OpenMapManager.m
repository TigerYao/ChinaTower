//
//  OpenMapManager.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/24.
//

#import "OpenMapManager.h"
#import <MapKit/MapKit.h>
#import <CoreLocation/CoreLocation.h>
#import <CTMeditorCategory/CTMeditorCategory.h>


@implementation OpenMapManager


- (void)openMapAppWith:(NSDictionary *)dict controller:(UIViewController *)vc{
    
    NSArray *mArr = @[@{
                          @"type": @"1",
                          @"title":@"Apple地图",
                          @"url": @"",
                          @"scheme": @"http://maps.apple.com/"
    },@{
                          @"type": @"0",
                          @"title":@"百度地图",
                          @"url": [NSString stringWithFormat:@"baidumap://map/direction?origin={{%@}}&destination=latlng:%@,%@|name=%@&mode=%@&coord_type=gcj02",dict[@"origin"],dict[@"lat"], dict[@"lng"],dict[@"name"], dict[@"mode"]],
                          @"scheme": @"baidumap://"
    }, @{
                        @"type": @"2",
                          @"title":@"高德地图",
                          @"url": [NSString stringWithFormat:@"baidumap://map/direction?origin={{%@}}&destination=latlng:%@,%@|name=%@&mode=%@&coord_type=gcj02",dict[@"origin"],dict[@"lat"], dict[@"lng"],dict[@"name"], dict[@"mode"]],
                          @"scheme": @"iosamap://"
    }];
    
    
    
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"导航功能" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    
    for (int i = 0; i < mArr.count; i++) {
        
       BOOL isOpen = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:mArr[i][@"scheme"]]];
        if (isOpen) {
            [alertController addAction:[UIAlertAction actionWithTitle:mArr[i][@"title"] style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
                NSString *type = mArr[i][@"type"];
                if ([type isEqualToString:@"0"]) {
                    // 百度地图
                    NSString *urlScheme = [NSString stringWithFormat:@"baidumap://map/direction?origin={{%@}}&destination=latlng:%@,%@|name:%@&mode=%@&coord_type=bd09ll",dict[@"origin"],dict[@"lat"], dict[@"lng"],dict[@"name"], dict[@"mode"]];
                    NSString *urlString = [urlScheme stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
                    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
                }else if ([type isEqualToString:@"1"]) {
                    
                    CLLocationCoordinate2D tarCoordinate2D = CLLocationCoordinate2DMake([dict[@"lat"] doubleValue], [dict[@"lng"] doubleValue]);//要导航的终点的经纬度
                    CLLocationCoordinate2D desCoordinate =  [[CTMediator sharedInstance] mapModule_actionBMKCoordTransFromBD09ToGCJ02:@{
                        @"location": [[CLLocation alloc] initWithLatitude:tarCoordinate2D.latitude longitude:tarCoordinate2D.longitude]
                    }].coordinate;
                    MKMapItem *currentLocation = [MKMapItem mapItemForCurrentLocation];
                    MKMapItem *toLocation = [[MKMapItem alloc] initWithPlacemark:[[MKPlacemark alloc] initWithCoordinate:desCoordinate addressDictionary:nil]];
                    toLocation.name = dict[@"name"];//可传入目标地点名称
                    [MKMapItem openMapsWithItems:@[currentLocation, toLocation]
                                   launchOptions:@{MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving,MKLaunchOptionsShowsTrafficKey: [NSNumber numberWithBool:YES]}];
                
                } else if ([type isEqualToString:@"2"]) {
                    CLLocationCoordinate2D desCoordinate = CLLocationCoordinate2DMake([dict[@"lat"] doubleValue], [dict[@"lng"] doubleValue]);//要导航的终点的经纬度
                    // 地图转换
                    CLLocationCoordinate2D coordinate2D =  [[CTMediator sharedInstance] mapModule_actionBMKCoordTransFromBD09ToGCJ02:@{
                        @"location": [[CLLocation alloc] initWithLatitude:desCoordinate.latitude longitude:desCoordinate.longitude]
                    }].coordinate;
                    NSString *urlScheme = [NSString stringWithFormat:@"iosamap://route/plan?sourceApplication=铁塔换电&poiname=%@&dlat=%lf&dlon=%lf&dname=%@&dev=0&rideType=elebike&t=3", dict[@"name"], coordinate2D.latitude, coordinate2D.longitude, dict[@"name"]];
                    NSString *urlString = [urlScheme stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
                    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
                }
            }]];
        }
    }
    
    [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    
    [vc presentViewController:alertController animated:YES completion:nil];
    
    
}

@end
