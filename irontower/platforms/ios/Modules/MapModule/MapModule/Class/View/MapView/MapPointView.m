//
//  MapPointView.m
//  MapModule
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "MapPointView.h"

@interface MapPointView ()

@property (nonatomic, assign) BOOL animationLock;

@property (nonatomic, strong) CABasicAnimation *loadingAnimation;

@property (nonatomic, strong) UIImageView *angleMaskView;

@property (nonatomic, strong) CAShapeLayer *loadingCicleLayer;

@property (nonatomic, strong) CAShapeLayer *solidCircleLayer;

@property (nonatomic, assign) NSTimeInterval timeInterval;

@end


@implementation MapPointView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.hidden = YES;
        [self drawCircleView];
        [self drawLineView];
        [self addLoadingView];
        [self startLoading];
    }
    return self;
}

- (void)drawCircleView {
    
    UIBezierPath *bezierPath = [UIBezierPath bezierPath];
    [bezierPath addArcWithCenter:CGPointMake(CGRectGetWidth(self.bounds) / 2, 10) radius:10 startAngle:0 endAngle:M_PI * 2 clockwise:NO];
    CAShapeLayer *layer = [CAShapeLayer layer];
    layer.path = bezierPath.CGPath;
    layer.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), 20);
    layer.strokeColor = [UIColor colorWithRed:55/255.0f green:62/255.0f blue:81/255.0f alpha:1].CGColor;
    layer.lineWidth = 8;
    layer.fillColor = [UIColor clearColor].CGColor;
    [self.layer addSublayer:layer];
    
}

- (void)drawLineView {
    UIBezierPath *bezierPath = [UIBezierPath bezierPathWithRect:CGRectMake((CGRectGetWidth(self.frame) - 1) / 2, 20, 1, 15)];
    CAShapeLayer *layer = [CAShapeLayer layer];
    layer.path = bezierPath.CGPath;
    layer.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), 15);
    layer.strokeColor = [UIColor colorWithRed:55/255.0f green:62/255.0f blue:81/255.0f alpha:1].CGColor;
    layer.lineWidth = 2;
    [self.layer addSublayer:layer];
}

- (void)addLoadingView {
    UIBezierPath *bezierPath = [UIBezierPath bezierPathWithArcCenter:CGPointMake(CGRectGetWidth(self.bounds) / 2, 10) radius:10 startAngle:0 endAngle:M_PI * 2 clockwise:YES];
    CAShapeLayer *layer = [CAShapeLayer layer];
    layer.path = bezierPath.CGPath;
    layer.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame), 20);
    layer.fillColor = [UIColor colorWithRed:55/255.0f green:62/255.0f blue:81/255.0f alpha:1].CGColor;
    [self.layer addSublayer:layer];
    layer.hidden = YES;
    self.solidCircleLayer = layer;
    
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, -2, CGRectGetWidth(self.frame), CGRectGetWidth(self.frame))];
    imageView.image = [UIImage mapModule_imageNamed:@"angle-mask"];
    imageView.hidden = YES;
    [self addSubview:imageView];
    self.angleMaskView = imageView;
    
    UIBezierPath *bezierPath2 = [UIBezierPath bezierPathWithArcCenter:CGPointMake(CGRectGetWidth(self.bounds) / 2, 10) radius:8 startAngle:0 endAngle:M_PI * 2 clockwise:YES];
    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    shapeLayer.path = bezierPath2.CGPath;
    shapeLayer.strokeColor = [UIColor whiteColor].CGColor;
    shapeLayer.lineWidth = 2;
    shapeLayer.fillColor = [UIColor clearColor].CGColor;
    shapeLayer.hidden = YES;
    [self.layer addSublayer:shapeLayer];
    shapeLayer.mask = imageView.layer;
    self.loadingCicleLayer = shapeLayer;
    
    
    CABasicAnimation *basicAnimation = [CABasicAnimation animationWithKeyPath:@"transform.rotation.z"];
    basicAnimation.repeatCount = MAXFLOAT;
    basicAnimation.fromValue = @(0);
    basicAnimation.toValue = @(M_PI * 2);
    basicAnimation.duration = 1.5;
    basicAnimation.removedOnCompletion =NO;
    self.loadingAnimation = basicAnimation;
}

- (void)startLoading {
    self.timeInterval = [[NSDate date] timeIntervalSince1970];
    self.solidCircleLayer.hidden = NO;
    self.angleMaskView.hidden = NO;
    self.loadingCicleLayer.hidden = NO;
    [self.angleMaskView.layer addAnimation:self.loadingAnimation forKey:nil];
}

- (void)endLoading {
    NSTimeInterval time = [[NSDate date] timeIntervalSince1970] - self.timeInterval;
    if (time > 1.2) {
        [self stopLoading];
        return;
    }
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)((1.2 - time) * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self stopLoading];
    });
}

- (void)stopLoading {
    self.solidCircleLayer.hidden = YES;
    self.angleMaskView.hidden = YES;
    self.loadingCicleLayer.hidden = YES;
    [self.angleMaskView.layer removeAllAnimations];
}


- (void)startAnimation {
    
    if (self.animationLock) {
        return;
    }
    self.animationLock = YES;
    self.transform = CGAffineTransformMakeTranslation(0, -30);
    self.hidden = NO;
    [UIView animateWithDuration:0.8 delay:0 usingSpringWithDamping:0.5 initialSpringVelocity:7 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        self.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
        self.animationLock = NO;
    }];
}


@end
