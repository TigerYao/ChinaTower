//
//  NetworkAnnotationView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/31.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "NetworkAnnotationView.h"

@implementation NetworkAnnotationView

- (id)initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    if (self) {
        self.frame = CGRectMake(0, 0, 43, 47);
        UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 43, 47)];
        [self addSubview:view];
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage mapModule_imageNamed:@"tip-service"]];
        [view addSubview:imageView];
        [imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.bottom.mas_equalTo(0);
            make.width.mas_equalTo(43);
            make.height.mas_equalTo(47);
            make.centerX.mas_equalTo(0);
        }];
        
        self.centerOffset = CGPointMake(-0, -47 / 2.f);
    }
    return self;
}

@end
