//
//  Utils.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/26.
//

#import "Utils.h"
#import <WXApi.h>
#import "sys/utsname.h"
#import <AFNetworking/AFHTTPSessionManager.h>
#import <CoreLocation/CoreLocation.h>

static BOOL shouldSaveUserInfo = YES;

typedef void(^CurrentPosition)(NSDictionary *position);
typedef void(^Error)(NSDictionary *error);

@interface Utils ()<CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager* locationManager;
@property (nonatomic, strong) CLGeocoder *geoC;
@property (nonatomic, copy) CurrentPosition position;
@property (nonatomic, copy) Error error;


@end

@implementation Utils

+ (void)setShouldSaveUserInfo:(BOOL)shouldSaveUser {
    shouldSaveUserInfo = shouldSaveUser;
}

+ (BOOL)getShouldSaveUserInfo {
    return  shouldSaveUserInfo;
}


+ (BOOL)canOpenWx {
    return [WXApi isWXAppInstalled];
}

+ (BOOL)canOpenAli {
    return [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"aliPay:"]];
}

+ (NSString *)getPhoneName {
    // 需要
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString * deviceString = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    NSString * phoneType = [NSString stringWithCString: systemInfo.machine encoding:NSASCIIStringEncoding];
    //iPhone
    if ([deviceString isEqualToString:@"iPhone1,1"])    return @"iPhone 1G";
    if ([deviceString isEqualToString:@"iPhone1,2"])    return @"iPhone 3G";
    if ([deviceString isEqualToString:@"iPhone2,1"])    return @"iPhone 3GS";
    if ([deviceString isEqualToString:@"iPhone3,1"])    return @"iPhone 4";
    if ([deviceString isEqualToString:@"iPhone3,2"])    return @"Verizon iPhone 4";
    if ([deviceString isEqualToString:@"iPhone4,1"])    return @"iPhone 4S";
    if ([deviceString isEqualToString:@"iPhone5,1"])    return @"iPhone 5";
    if ([deviceString isEqualToString:@"iPhone5,2"])    return @"iPhone 5";
    if ([deviceString isEqualToString:@"iPhone5,3"])    return @"iPhone 5C";
    if ([deviceString isEqualToString:@"iPhone5,4"])    return @"iPhone 5C";
    if ([deviceString isEqualToString:@"iPhone6,1"])    return @"iPhone 5S";
    if ([deviceString isEqualToString:@"iPhone6,2"])    return @"iPhone 5S";
    if ([deviceString isEqualToString:@"iPhone7,1"])    return @"iPhone 6 Plus";
    if ([deviceString isEqualToString:@"iPhone7,2"])    return @"iPhone 6";
    if ([deviceString isEqualToString:@"iPhone8,1"])    return @"iPhone 6s";
    if ([deviceString isEqualToString:@"iPhone8,2"])    return @"iPhone 6s Plus";
    if ([deviceString isEqualToString:@"iPhone8,4"])    return @"iPhone SE";
    if ([deviceString isEqualToString:@"iPhone9,1"])    return @"iPhone 7";
    if ([deviceString isEqualToString:@"iPhone9,2"])    return @"iPhone 7 Plus";
    if ([deviceString isEqualToString:@"iPhone10,1"])   return @"iPhone 8";
    if ([deviceString isEqualToString:@"iPhone10,4"])   return @"iPhone 8";
    if ([deviceString isEqualToString:@"iPhone10,2"])   return @"iPhone 8 Plus";
    if ([deviceString isEqualToString:@"iPhone10,5"])   return @"iPhone 8 Plus";
    if ([deviceString isEqualToString:@"iPhone10,3"])   return @"iPhone X";
    if ([deviceString isEqualToString:@"iPhone10,6"])   return @"iPhone X";
    if ([deviceString isEqualToString:@"iPhone11,8"])   return @"iPhone XR";
    if ([deviceString isEqualToString:@"iPhone11,2"])   return @"iPhone XS";
    if ([deviceString isEqualToString:@"iPhone11,4"])   return @"iPhone XS Max";
    if ([deviceString isEqualToString:@"iPhone11,6"])   return @"iPhone XS Max";
    if ([deviceString isEqualToString:@"iPhone12,1"])   return @"iPhone 11";
    if ([deviceString isEqualToString:@"iPhone12,3"])   return @"iPhone 11 Pro";
    if ([deviceString isEqualToString:@"iPhone12,5"])   return @"iPhone 11 Pro Max";
        
    return deviceString;
}

+ (void)getAppNetVersion:(void(^)(NSString *version))version {
    
//    https://itunes.apple.com/cn/lookup?id=

    [[AFHTTPSessionManager manager] GET:[NSString stringWithFormat:@"https://itunes.apple.com/cn/lookup?id=%@", APPID] parameters:nil headers:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
        NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
        if (!responseObject) {
            if (version) {
                version(app_Version);
            }
            return;
        }
        NSArray *apps =responseObject[@"results"];
        if (!apps) {
            if (version) {
                version(app_Version);
            }
            return;
        }
        
        if (apps.count > 0) {
            if (version) {
                version(apps.lastObject[@"version"]);
            }
        } else {
            if (version) {
                version(app_Version);
            }
        }
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
        NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
        if (version) {
            version(app_Version);
        }
    }];
    
//    [[AFHTTPSessionManager manager] GET:[NSString stringWithFormat:@"https://itunes.apple.com/cn/lookup?id=%@", APPID] parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
//        NSArray *apps =responseObject[@"results"];
//        if (apps.count > 0) {
//            if (version) {
//                version(apps.lastObject[@"version"]);
//            }
//        } else {
//            NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
//            NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
//            if (version) {
//                version(app_Version);
//            }
//        }
//    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
//        NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
//        NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
//        if (version) {
//            version(app_Version);
//        }
//    }];
    
}

+ (instancetype)shareUtils {
    static dispatch_once_t onceToken = 0;
    static Utils *utils = nil;
    dispatch_once(&onceToken, ^{
        utils = [self new];
    });
    return utils;
}


// 获取当前位置信息
- (void)getCurrentPostion:(void(^)(NSDictionary *position))position error:(void(^)(NSDictionary *error))error {
    self.position = position;
    self.error = error;
    [self startLocation];
}

#pragma mark Location and Delegate
- (void)startLocation
{
    if ([CLLocationManager locationServicesEnabled]) {
        self.locationManager = [[CLLocationManager alloc] init];
           self.locationManager.delegate = self;
           self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
           self.locationManager.distanceFilter=kCLDistanceFilterNone;
        //   [self.locationManager requestWhenInUseAuthorization];
           [self.locationManager startMonitoringSignificantLocationChanges];
           /** 由于IOS8中定位的授权机制改变 需要进行手动授权
            * 获取授权认证，两个方法：
            * [self.locationManager requestWhenInUseAuthorization];
            * [self.locationManager requestAlwaysAuthorization];
            */
           if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
               NSLog(@"requestWhenInUseAuthorization");
              [self.locationManager requestWhenInUseAuthorization];
           }
           //开始定位，不断调用其代理方法
           [self.locationManager startUpdatingLocation];
    } else {
        NSLog(@"请打开定位");
    }
}

- (CLGeocoder *)geoC
{
    if (!_geoC) {
        _geoC = [[CLGeocoder alloc] init];
    }
    return _geoC;
}


- (void)locationManager:(CLLocationManager *)manager
    didUpdateLocations:(NSArray *)locations
{
   // 1.获取用户位置的对象
   CLLocation *location = [locations lastObject];
   CLLocationCoordinate2D coordinate = location.coordinate;

    [self.geoC reverseGeocodeLocation:location completionHandler:^(NSArray<CLPlacemark *> * _Nullable placemarks, NSError * _Nullable error) {
        CLPlacemark *placemark = [placemarks firstObject];
        if(error == nil)
        {
            
            //获取城市
            NSString *city = placemark.locality;
            NSString *privce = [placemark.addressDictionary objectForKey:@"State"];
            if (!city) {
                // 四大直辖市的城市信息无法通过locality获得，只能通过获取省份的方法来获得（如果city为空，则可知为直辖市）
                city = placemark.administrativeArea;
                privce = city;
            }
            
            NSArray *addresses = [placemark.addressDictionary objectForKey:@"FormattedAddressLines"];
            
            if (self.position) {
                self.position(@{
                    @"platform": @"iOS",
                    @"longitude": [NSString stringWithFormat:@"%lf", coordinate.longitude],
                    @"latitude": [NSString stringWithFormat:@"%lf", coordinate.latitude],
                    @"city": city?:@"",
                    @"privce":privce?:@"",
                    @"area": [placemark.addressDictionary objectForKey:@"SubLocality"] ?: (city?:@""),
                    @"address":addresses.count > 0 ? addresses[0] : @"",
                    @"county":[placemark.addressDictionary objectForKey:@"Country"]?:@""
                });
            }

        } else {
            if (self.position) {
                self.position(@{
                    @"platform": @"iOS",
                    @"longitude": [NSString stringWithFormat:@"%lf", coordinate.longitude],
                    @"latitude": [NSString stringWithFormat:@"%lf", coordinate.latitude]
                });
            }
        }
    }];
   // 2.停止定位
   [manager stopUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager
      didFailWithError:(NSError *)error
{
    
    if (self.error) {
        self.error(@{@"code": @(error.code), @"msg": error.localizedDescription});
    }
    
   if (error.code == kCLErrorDenied) {
       // 提示用户出错原因，可按住Option键点击 KCLErrorDenied的查看更多出错信息，可打印error.code值查找原因所在
   }
}

+ (void)openLocationSetting {
    if (SYSTEM_VERSION_GREATER_THAN(@"8.0")) {
        NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url];
        }
    } else {
//        这里使用被拒
//        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"prefs:root=LOCATION_SERVICES"]];
    }
}


+ (BOOL)isLocationServiceOpen {
    if ([ CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
        return NO;
    } else
        return YES;
}

@end
