//
//  MediaPlayer.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/24.
//

#import "MediaPlayer.h"
#import <AudioToolbox/AudioToolbox.h>

static void completionCallback(SystemSoundID mySSID)
{
    // Play again after sound play completion
//    AudioServicesPlaySystemSound(mySSID);
}

@implementation MediaPlayer

SystemSoundID ditaVoice;


+ (void)playWithType:(MediaType)type {
    switch (type) {
        case MediaTypeEleBeyond:
            [self playWithResource:@"ele"];
            break;
            
        default:
            break;
    }
}

+ (void)playWithResource:(NSString *)resouce {
    // 1. 定义要播放的音频文件的URL
    NSURL *voiceURL = [[NSBundle mainBundle]URLForResource:resouce withExtension:@"m4a"];
    // 2. 注册音频文件（第一个参数是音频文件的URL 第二个参数是音频文件的SystemSoundID）
    AudioServicesCreateSystemSoundID((__bridge CFURLRef)(voiceURL),&ditaVoice);
    // 3. 为crash播放完成绑定回调函数
    AudioServicesAddSystemSoundCompletion(ditaVoice,NULL,NULL,(void*)completionCallback,NULL);
    // 4. 播放 ditaVoice 注册的音频 并控制手机震动
    AudioServicesPlayAlertSound(ditaVoice);
    //    AudioServicesPlaySystemSound(ditaVoice);
    //    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate); // 控制手机振动
}


@end
