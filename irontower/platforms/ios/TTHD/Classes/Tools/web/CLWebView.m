//
//  CLWebView.m
//  StudyClass
//
//  Created by 秦传龙 on 2019/11/5.
//  Copyright © 2019 秦传龙. All rights reserved.
//

#import "CLWebView.h"

@implementation CLWebView


- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew context:nil];
        [self addObserver:self forKeyPath:@"title" options:NSKeyValueObservingOptionNew context:nil];
    }
    return self;
}

- (void)dealloc {
    [self removeObserver:self forKeyPath:@"estimatedProgress" context:nil];
    [self removeObserver:self forKeyPath:@"title"];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    if ([keyPath isEqualToString:@"estimatedProgress"]) {
        if (self.clDelegate && [self.clDelegate respondsToSelector:@selector(webview:estimatedProgress:)]) {
            [self.clDelegate webview:self estimatedProgress:change[@"new"]];
        }
    } else if ([keyPath isEqualToString:@"title"]) {
        if (self.clDelegate && [self.clDelegate respondsToSelector:@selector(webview:title:)]) {
            [self.clDelegate webview:self title:change[@"new"]];
        }
    }

}


@end
