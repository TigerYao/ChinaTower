//
//  PlayerViewController.m
//  铁塔换电
//
//  Created by 秦传龙 on 2020/3/4.
//

#import "PlayerViewController.h"
#import "WMPlayer.h"
#import "Masonry.h"
@interface PlayerViewController ()<WMPlayerDelegate>

@property (nonatomic, strong)WMPlayer  *wmPlayer;
@property (nonatomic, strong)WMPlayerModel *playerModel;


@end

@implementation PlayerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    //获取设备旋转方向的通知,即使关闭了自动旋转,一样可以监测到设备的旋转方向
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    //旋转屏幕通知
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onDeviceOrientationChange:)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil
     ];
    
    [self.view addSubview:self.wmPlayer];
    [self.wmPlayer play];
    
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationLandscapeRight) forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
}

-(void)viewDidDisappear:(BOOL)animated{
    [super viewDidAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    
    
}


/**
 *  旋转屏幕通知
 */
- (void)onDeviceOrientationChange:(NSNotification *)notification{
    
    UIDeviceOrientation orientation = [UIDevice currentDevice].orientation;
    UIInterfaceOrientation interfaceOrientation = (UIInterfaceOrientation)orientation;
    switch (interfaceOrientation) {
        case UIInterfaceOrientationPortraitUpsideDown:{
            NSLog(@"第3个旋转方向---电池栏在下");
        }
            break;
        case UIInterfaceOrientationPortrait:{
            NSLog(@"第0个旋转方向---电池栏在上");
            [self toOrientation:UIInterfaceOrientationPortrait];
        }
            break;
        case UIInterfaceOrientationLandscapeLeft:{
            NSLog(@"第2个旋转方向---电池栏在左");
            [self toOrientation:UIInterfaceOrientationLandscapeLeft];
        }
            break;
        case UIInterfaceOrientationLandscapeRight:{
            NSLog(@"第1个旋转方向---电池栏在右");
            [self toOrientation:UIInterfaceOrientationLandscapeRight];
        }
            break;
        default:
            break;
    }
}

//点击进入,退出全屏,或者监测到屏幕旋转去调用的方法
-(void)toOrientation:(UIInterfaceOrientation)orientation{
    
    [self.wmPlayer mas_remakeConstraints:^(MASConstraintMaker *make) {
        if([WMPlayer IsiPhoneX]){
            make.edges.mas_equalTo(UIEdgeInsetsMake(self.wmPlayer.playerModel.verticalVideo?14:0, 0, 0, 0));
        }else{
            make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));
        }
    }];
    self.wmPlayer.isFullscreen = YES;
    
    if (@available(iOS 11.0, *)) {
        [self setNeedsUpdateOfHomeIndicatorAutoHidden];
    }
}
- (WMPlayerModel *)playerModel {
    if (!_playerModel) {
        _playerModel = [WMPlayerModel new];
        _playerModel.title = self.playTitle;
        _playerModel.videoURL = [NSURL URLWithString:self.playUrl];
    }
    return _playerModel;
}


- (WMPlayer *)wmPlayer {
    if (!_wmPlayer) {
        _wmPlayer =  [[WMPlayer alloc] initPlayerModel:self.playerModel];
        self.wmPlayer.backBtnStyle = BackBtnStylePop;
        self.wmPlayer.loopPlay = NO;//设置是否循环播放
        self.wmPlayer.tintColor = [UIColor orangeColor];//改变播放器着色
        self.wmPlayer.enableBackgroundMode = NO;//开启后台播放模式
        self.wmPlayer.enableAirPlay  = NO;
        self.wmPlayer.delegate = self;
        self.wmPlayer.frame = self.view.frame;
    }
    return _wmPlayer;
}

//视图控制器实现的方法
- (BOOL)shouldAutorotate{
    return YES;
}

//viewController所支持的全部旋转方向
- (UIInterfaceOrientationMask)supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
-(UIInterfaceOrientation)preferredInterfaceOrientationForPresentation{
    //对于present出来的控制器，要主动的（强制的）旋转VC，让wmPlayer全屏
    //    UIInterfaceOrientationLandscapeLeft或UIInterfaceOrientationLandscapeRight
    [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationLandscapeRight) forKey:@"orientation"];
    return UIInterfaceOrientationLandscapeRight;
}
///播放器事件
-(void)wmplayer:(WMPlayer *)wmplayer clickedCloseButton:(UIButton *)closeBtn{
    [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationPortrait) forKey:@"orientation"];
    [UIViewController attemptRotationToDeviceOrientation];
    if (self.presentingViewController) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }else{
        [self.navigationController popViewControllerAnimated:YES];
    }
}
///播放暂停
-(void)wmplayer:(WMPlayer *)wmplayer clickedPlayOrPauseButton:(UIButton *)playOrPauseBtn{
    NSLog(@"clickedPlayOrPauseButton");
}

///单击播放器
-(void)wmplayer:(WMPlayer *)wmplayer singleTaped:(UITapGestureRecognizer *)singleTap{
    [self setNeedsStatusBarAppearanceUpdate];
}
///双击播放器
-(void)wmplayer:(WMPlayer *)wmplayer doubleTaped:(UITapGestureRecognizer *)doubleTap{
    NSLog(@"didDoubleTaped");
    if (wmplayer.isLockScreen) {
        return;
    }
    [wmplayer playOrPause:[wmplayer valueForKey:@"playOrPauseBtn"]];
}
///播放状态
-(void)wmplayerFailedPlay:(WMPlayer *)wmplayer WMPlayerStatus:(WMPlayerState)state{
    NSLog(@"wmplayerDidFailedPlay");
    if (self.status) {
        self.status(@"failed");
    }
}
-(void)wmplayerReadyToPlay:(WMPlayer *)wmplayer WMPlayerStatus:(WMPlayerState)state{
    
}

-(void)wmplayerFinishedPlay:(WMPlayer *)wmplayer{
    NSLog(@"wmplayerDidFinishedPlay");
    if (self.status) {
        self.status(@"finished");
    }
}
-(void)wmplayerGotVideoSize:(WMPlayer *)wmplayer videoSize:(CGSize )presentationSize{
    
}
//操作栏隐藏或者显示都会调用此方法
-(void)wmplayer:(WMPlayer *)wmplayer isHiddenTopAndBottomView:(BOOL)isHidden{
    [self setNeedsStatusBarAppearanceUpdate];
}

- (void)releaseWMPlayer{
    [self.wmPlayer pause];
    [self.wmPlayer removeFromSuperview];
    self.wmPlayer = nil;
}
- (void)dealloc{
    [self releaseWMPlayer];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    NSLog(@"DetailViewController dealloc");
}
@end
