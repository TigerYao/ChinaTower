#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "NSDate+CL.h"
#import "NSString+CLRegex.h"
#import "UIDevice+CL.h"
#import "CLBaseModel.h"
#import "CLBaseNavigationController.h"
#import "CLBaseViewController.h"
#import "CLBaseViewModel.h"
#import "QCLFoundation.h"

FOUNDATION_EXPORT double QCLFoundationVersionNumber;
FOUNDATION_EXPORT const unsigned char QCLFoundationVersionString[];

