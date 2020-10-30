//
//  CordovaViewController.h
//  TTHD
//
//  Created by 秦传龙 on 2020/8/19.
//

#import "MainViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface CordovaViewController : MainViewController

@property (nonatomic, assign) BOOL isClearAllLocalstorget;

+ (instancetype)shareInstance;

- (void)removeClearItem;

- (void)hidenSplashScreen;

- (void)saveNoticeInfoToLocalStorage;

@end

NS_ASSUME_NONNULL_END
