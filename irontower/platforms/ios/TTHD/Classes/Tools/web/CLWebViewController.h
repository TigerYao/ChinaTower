//
//  CLWebViewController.h
//  StudyClass
//
//  Created by 秦传龙 on 2019/11/5.
//  Copyright © 2019 秦传龙. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface CLWebViewController : UIViewController

@property (nonatomic, copy) NSString *url;
@property (nonatomic, strong) UIColor *activeColor;
@property (nonatomic, strong) UIColor *inactiveColor;
@property (nonatomic, copy) NSString *html;

@end

NS_ASSUME_NONNULL_END
