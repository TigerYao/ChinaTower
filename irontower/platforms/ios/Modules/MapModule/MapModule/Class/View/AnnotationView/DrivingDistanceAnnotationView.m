//
//  DrivingDistanceAnnotationView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "DrivingDistanceAnnotationView.h"
#import "DrivingDistanceAnnotation.h"

@interface DrivingDistanceAnnotationView ()

@property (nonatomic, strong) QMUILabel *titleLabel;

@end

@implementation DrivingDistanceAnnotationView

- (id)initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    if (self) {
        
        self.titleLabel = [[QMUILabel alloc] init];
        self.titleLabel.textColor = [UIColor whiteColor];
        self.titleLabel.layer.cornerRadius = 15;
        self.titleLabel.layer.masksToBounds = YES;
        self.titleLabel.contentEdgeInsets = UIEdgeInsetsMake(8, 8, 8, 8);
        [self addSubview:self.titleLabel];
        self.titleLabel.font = [UIFont systemFontOfSize:12];
        self.titleLabel.backgroundColor = [UIColor colorWithRed:55/255.0 green:61/255.0 blue:82/255.0 alpha:1.0];
        
        [self.titleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerX.mas_equalTo(0);
            make.height.mas_equalTo(30);
            make.bottom.mas_equalTo(-50);
        }];
        
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage mapModule_imageNamed:@"sanjiao"]];
        [self addSubview:imageView];

        [imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.centerX.mas_equalTo(0);
            make.width.mas_equalTo(13);
            make.height.mas_equalTo(7);
            make.bottom.mas_equalTo(-45);
        }];
        
    }
    return self;
}

- (void)setAnnotation:(id<BMKAnnotation>)annotation {
    [super setAnnotation:annotation];
    DrivingDistanceAnnotation *anno = (DrivingDistanceAnnotation *)annotation;
    self.titleLabel.text = anno.text;
}


@end
