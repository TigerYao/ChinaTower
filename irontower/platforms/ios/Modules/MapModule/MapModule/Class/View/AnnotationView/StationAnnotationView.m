//
//  StationAnnotationView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "StationAnnotationView.h"
#import "StationListModel.h"

@interface StationAnnotationView ()

@property (nonatomic, strong) UIView *backgroundView;
@property (nonatomic, strong) UIImageView *backgroundImageView;


@end


@implementation StationAnnotationView

- (id)initWithAnnotation:(id<BMKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithAnnotation:annotation reuseIdentifier:reuseIdentifier];
    if (self) {
        self.bounds = CGRectMake(0, 0, 61, 55);
        self.canShowCallout = NO;
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage mapModule_imageNamed:@"annotation-bg"]];
        self.backgroundImageView = imageView;
        [self addSubview:imageView];
        
        UIView *view = [[UIView alloc] initWithFrame:self.bounds];
        [self addSubview:view];
        self.backgroundView = view;
        
        [imageView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.bottom.mas_equalTo(0);
            make.width.mas_equalTo(43);
            make.height.mas_equalTo(47);
            make.centerX.mas_equalTo(0);
        }];
        self.centerOffset = CGPointMake(-0, -22.5);
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
}

- (void)setElectricCabinetList:(NSArray *)list greyFlag:(BOOL)grey {
    [self.backgroundView.subviews makeObjectsPerformSelector:@selector(removeFromSuperview)];
    if (grey) {
        self.backgroundImageView.image = [UIImage mapModule_imageNamed:@"map-enable"];
        [self.backgroundImageView mas_updateConstraints:^(MASConstraintMaker *make) {
            make.width.height.mas_equalTo(40);
        }];
        return;
    }
    
    self.backgroundImageView.image = [UIImage mapModule_imageNamed:@"annotation-bg"];
    [self.backgroundImageView mas_updateConstraints:^(MASConstraintMaker *make) {
        make.width.mas_equalTo(43);
        make.height.mas_equalTo(47);
    }];

    for (int i = 0; i < list.count; i++) {
        if (i > 5) {
            return; // 这里设置最多展示6个
        }
        BsCabinetResponseListInfo *model = list[i];
        QMUILabel *label = [[QMUILabel alloc] init];
        label.text = model.fullCount;
        label.textAlignment = NSTextAlignmentCenter;
        label.font = [UIFont systemFontOfSize:12 weight:UIFontWeightMedium];
        label.backgroundColor = [UIColor qmui_colorWithHexString:@"#00BF83"];
        label.textColor = [UIColor whiteColor];
        label.layer.borderWidth = 2;
        label.layer.cornerRadius = 9;
        label.layer.masksToBounds = YES;
        label.layer.borderColor = [UIColor whiteColor].CGColor;
        label.frame = [self rectForLabelWithIndex:i];
        [self.backgroundView addSubview:label];

    }
}

- (CGRect)rectForLabelWithIndex:(NSInteger)index {
    CGRect frame = CGRectZero;
    CGFloat width = 18;
    CGFloat height = 18;
    NSLog(@"----%ld",index);
    switch (index) {
        case 0:
            frame = CGRectMake(12, 2, width, height);
            break;
        case 1:
            frame = CGRectMake(CGRectGetWidth(self.frame) - width - 12, 2, width, height);
            break;
        case 2:
            frame = CGRectMake(0, CGRectGetMidY(self.backgroundView.frame) - 11, width, height);
            break;
        case 3:
            frame = CGRectMake(CGRectGetWidth(self.frame) - width, CGRectGetMidY(self.backgroundView.frame) - 11, width, height);
            break;
        case 4:
            frame = CGRectMake(9, CGRectGetHeight(self.frame) - height - 2, width, height);
            break;
        case 5:
            frame = CGRectMake(CGRectGetWidth(self.frame) - width - 9, CGRectGetHeight(self.frame) - height - 2, width, height);
            break;
            
        default:
            break;
    }
    return frame;
}


@end
