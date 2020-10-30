//
//  PlanAnnotationView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/10/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "PlanAnnotationView.h"
#import "PlanPointAnnotation.h"

@interface PlanAnnotationView ()

@property (nonatomic, strong) UIImageView *iconImageView;

@end


@implementation PlanAnnotationView

- (id)initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    if (self) {
        self.frame = CGRectMake(0, 0, 30, 45);
        UIView *view = [[UIView alloc] initWithFrame:self.bounds];
        [self addSubview:view];
        
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"icon_nav_start@2x.png"]];
        [view addSubview:imageView];
        
        [imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.edges.mas_equalTo(0);
        }];
        self.iconImageView = imageView;
        
        self.centerOffset = CGPointMake(-0, -45 / 2.f);
    }
    return self;
}

- (void)setAnnotation:(id<BMKAnnotation>)annotation {
    [super setAnnotation:annotation];
    PlanPointAnnotation *anno = (PlanPointAnnotation *)annotation;
//    self.ima.text = anno.text;
    if (anno.isStart) {
        self.iconImageView.image = [UIImage mapModule_imageNamed:@"icon_nav_start"];
    } else {
        self.iconImageView.image = [UIImage mapModule_imageNamed:@"icon_nav_end"];
    }
}


@end
