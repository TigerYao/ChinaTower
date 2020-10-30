//
//  PlayerViewController.h
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/4.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^PlayStatus)(NSString *status);

@interface PlayerViewController : UIViewController

@property (nonatomic, copy) NSString *playUrl;
@property (nonatomic, copy) NSString *playTitle;

@property (nonatomic, copy) PlayStatus status;


@end

NS_ASSUME_NONNULL_END
