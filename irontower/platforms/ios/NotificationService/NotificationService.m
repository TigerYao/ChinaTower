//
//  NotificationService.m
//  NotificationService
//
//  Created by 秦传龙 on 2020/6/5.
//

#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    NSString *type = self.bestAttemptContent.userInfo[@"type"];
    if ([type isEqualToString:@"2"]) {
        //  电池电量不足
        self.bestAttemptContent.sound = [UNNotificationSound soundNamed:@"ele.m4a"];
    } else {
        self.bestAttemptContent.sound = [UNNotificationSound defaultSound];
    }
    
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
