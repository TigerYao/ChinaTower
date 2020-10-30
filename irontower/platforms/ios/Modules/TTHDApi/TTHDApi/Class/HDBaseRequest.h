//
//  HDBaseRequest.h
//  TTHDApi
//
//  Created by 秦传龙 on 2020/8/18.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import <YTKNetwork/YTKNetwork.h>
#import "ApiConstant.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^HDRequestCompletionSuccessBlock)(id model ,YTKBaseRequest *request);
typedef void(^HDRequestCompletionFailBlock)(NSError *error, YTKBaseRequest *request);

@interface HDBaseRequest : YTKBaseRequest

@property (nonatomic, copy) NSString *modelName;
@property (nonatomic, strong) id modelData;

- (instancetype)initWithUrl:(NSString *)url params:(NSDictionary *)params method:(YTKRequestMethod)method hud:(BOOL)hud;

- (instancetype)initWithPOSTShowLoadingUrl:(NSString *)url params:(NSDictionary *)params;

- (instancetype)initWithGETShowLoadingUrl:(NSString *)url params:(NSDictionary *)params;

- (instancetype)initWithPOSTNoLoadingUrl:(NSString *)url params:(NSDictionary *)params;

- (void)startRequestWithCompletionBlockWithSuccess:(_Nullable HDRequestCompletionSuccessBlock)success failure:(_Nullable HDRequestCompletionFailBlock)failure;

@end

NS_ASSUME_NONNULL_END
