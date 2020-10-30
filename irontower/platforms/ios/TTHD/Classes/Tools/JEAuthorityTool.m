//
//  JEAuthorityTool.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/4/20.
//

#import "JEAuthorityTool.h"

typedef void(^je_authorityLocationBLock)(BOOL granted,CLAuthorizationStatus state);

@interface JEAuthorityTool ()<CLLocationManagerDelegate>

@property (strong,  nonatomic)  CLLocationManager   *locationManager;
@property (copy,    nonatomic)  je_authorityLocationBLock   locationBlock;

@end

@implementation JEAuthorityTool

static  dispatch_once_t onceToken;
+ (JEAuthorityTool *)sharedLocationManage
{
    static  JEAuthorityTool *__singletion;
    dispatch_once(&onceToken, ^{
        __singletion=[[self alloc] init];
    });
    return __singletion;
}
-(instancetype)init
{
    if (self = [super init])
    {
        self.locationManager = [CLLocationManager new];
    }
    return self;
}

+(void)je_authorityLocationRequest:(void(^)(BOOL granted,
                                            CLAuthorizationStatus status))block
{
    [self sharedLocationManage].locationBlock = block;
    
    BOOL canUser;
    CLAuthorizationStatus status;
    [self je_authorityLocation:&canUser status:&status];
    
    if (status == kCLAuthorizationStatusNotDetermined)
    {
        CLLocationManager *manager = [self sharedLocationManage].locationManager;
        manager.delegate = [self sharedLocationManage];
        [manager requestWhenInUseAuthorization];
        
        NSDictionary *dic = [NSBundle mainBundle].infoDictionary;
        BOOL boolWhen = locationContentWithStr(@"NSLocationWhenInUseUsageDescription",dic);
        BOOL boolAlway = locationContentWithStr(@"NSLocationAlwaysUsageDescription",dic);
        
        BOOL show = NO;
        if (@available(iOS 11.4, *))
            show = boolWhen;
        else
            show = (boolAlway || boolWhen);
        
        if (!show) {
            NSLog(@"---------------------\n\
                  ⚠️如果第一次没有弹出权限请求\n\
                  请在plist中配置位置权限信息\n\
                  按照实际需求，需要配置以下key\n\
                  NSLocationWhenInUseUsageDescription   和\n\
                  NSLocationAlwaysUsageDescription      和\n\
                  NSLocationAlwaysAndWhenInUseUsageDescription\n\
                  ---------------------");
        }
    }
    else{
        if ([self sharedLocationManage].locationBlock)
        {
            [self sharedLocationManage].locationBlock(canUser, status);
            [self sharedLocationManage].locationBlock = nil;
        }
        [self sharedLocationManage].locationManager = nil;
        onceToken = 0;
    }
}

BOOL locationContentWithStr(NSString *str, NSDictionary *dic)
{
    if ([[dic allKeys] containsObject:str])
    {
        id value =  dic[str];
        if ([value isKindOfClass:[NSString class]])
        {
            return YES;
        }
    }
    return NO;
}


-(void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    if (status != kCLAuthorizationStatusNotDetermined)
    {
        if (self.locationBlock) {
            self.locationBlock([[self class] je_authorityBoolLocation ], status);
            self.locationBlock = nil;
        }
        self.locationManager = nil;
        onceToken = 0;
    }
}

+(void)je_authorityLocation:(void (^)(BOOL, CLAuthorizationStatus))location
{
    if (location) {
        if (![CLLocationManager locationServicesEnabled]) {
            NSLog(@"系统所有app都没有打开定位功能");
            location(NO,kCLAuthorizationStatusDenied);
            return;
        }
        
        CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
        location(YES,status);
    }
}

+(void)je_authorityLocation:(BOOL *)systemOpen status:(CLAuthorizationStatus *)status
{
    if (![CLLocationManager locationServicesEnabled]) {
        NSLog(@"系统所有app都没有打开定位功能");
        
        *systemOpen = NO;
        *status = kCLAuthorizationStatusDenied;
    }
    else
    {
        *systemOpen = YES;
        *status = [CLLocationManager authorizationStatus];
    }
}

+(BOOL)je_authorityBoolLocation
{
    BOOL systemOpen;
    CLAuthorizationStatus status;
    [self je_authorityLocation:&systemOpen status:&status];
    if (systemOpen == NO) {
        return NO;
    }
    else
    {
        if (status == kCLAuthorizationStatusNotDetermined ||
            status == kCLAuthorizationStatusAuthorizedAlways ||
            status == kCLAuthorizationStatusAuthorizedWhenInUse)
        {
            return YES;
        }
        else{
            return NO;
        }
    }
}



@end
