//
//  ScanViewController.m
//  HLRCode
//
//  Created by 郝靓 on 2018/7/9.
//  Copyright © 2018年 郝靓. All rights reserved.
//

#import "ScanViewController.h"
#import <ImageIO/ImageIO.h>

#define Height [UIScreen mainScreen].bounds.size.height
#define Width [UIScreen mainScreen].bounds.size.width
#define XCenter self.view.center.x
#define YCenter self.view.center.y

#define SHeight 20

#define SWidth (Width - 140)

@interface ScanViewController ()
{
    NSTimer *_timer;
    int num;
    BOOL upOrDown;
    
}

@property (nonatomic, strong) UIButton *brightnessBtn; // 手电筒开关
@property (nonatomic, assign) BOOL isOpenBrightness;  // 打开了灯光

@property (nonatomic, assign) BOOL isShowBrightness;  // 将要或者已经展示了闪光灯


@end

@implementation ScanViewController

#pragma mark ===========懒加载===========
//device
- (AVCaptureDevice *)device
{
    
    if (_device == nil) {
        //AVMediaTypeVideo是打开相机
        //AVMediaTypeAudio是打开麦克风
        _device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    }
    return _device;
}
//input
- (AVCaptureDeviceInput *)input
{
    if (_input == nil) {
        _input = [AVCaptureDeviceInput deviceInputWithDevice:self.device error:nil];
    }
    return _input;
}
//output  --- output如果不打开就无法输出扫描得到的信息
// 设置输出对象解析数据时感兴趣的范围
// 默认值是 CGRect(x: 0, y: 0, width: 1, height: 1)
// 通过对这个值的观察, 我们发现传入的是比例
// 注意: 参照是以横屏的左上角作为, 而不是以竖屏
//        out.rectOfInterest = CGRect(x: 0, y: 0, width: 0.5, height: 0.5)
- (AVCaptureMetadataOutput *)output
{
    if (_output == nil) {
        _output = [[AVCaptureMetadataOutput alloc]init];
        [_output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
        //限制扫描区域(上下左右)
        [_output setRectOfInterest:[self rectOfInterestByScanViewRect:_imageView.frame]];
    }
    return _output;
}
- (CGRect)rectOfInterestByScanViewRect:(CGRect)rect {
    CGFloat width = CGRectGetWidth(self.view.frame);
    CGFloat height = CGRectGetHeight(self.view.frame);
    
    CGFloat x = (height - CGRectGetHeight(rect)) / 2 / height;
    CGFloat y = (width - CGRectGetWidth(rect)) / 2 / width;
    
    CGFloat w = CGRectGetHeight(rect) / height;
    CGFloat h = CGRectGetWidth(rect) / width;
    
    return CGRectMake(x, y, w, h);
}

//session
- (AVCaptureSession *)session
{
    if (_session == nil) {
        //session
        _session = [[AVCaptureSession alloc]init];
        [_session setSessionPreset:AVCaptureSessionPresetHigh];
        // 3.创建设备输出流
//        AVCaptureVideoDataOutput *output = [[AVCaptureVideoDataOutput alloc] init];
//        [output setSampleBufferDelegate:self queue:dispatch_get_main_queue()];
        if ([_session canAddInput:self.input]) {
            [_session addInput:self.input];
        }
        if ([_session canAddOutput:self.output]) {
            [_session addOutput:self.output];
        }
    }
    return _session;
}
//preview
- (AVCaptureVideoPreviewLayer *)preview
{
    if (_preview == nil) {
        _preview = [AVCaptureVideoPreviewLayer layerWithSession:self.session];
    }
    return _preview;
}

#pragma mark ==========ViewDidLoad==========
- (void)viewDidLoad
{
    //1 判断是否存在相机
    if (self.device == nil) {
//        [self showAlertViewWithMessage:@"没有相机权限或者相机已损坏"];
        
        return;
    }
    self.view.backgroundColor = [UIColor whiteColor];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"相册" style:UIBarButtonItemStylePlain target:self action:@selector(chooseButtonClick)];
    //打开定时器，开始扫描
    [self addTimer];
    
    //界面初始化
    [self interfaceSetup];
    
    //初始化扫描
    [self scanSetup];
    [self setLeftNav];
    [self.view addSubview:self.brightnessBtn];
    
}

#pragma mark ==========初始化工作在这里==========
- (void)viewDidDisappear:(BOOL)animated
{
    //视图退出，关闭扫描
    [self.session stopRunning];
    //关闭定时器
    [_timer setFireDate:[NSDate distantFuture]];
}
//界面初始化
- (void)interfaceSetup
{
    //1 添加扫描框
    [self addImageView];
    
    //添加模糊效果
    [self setOverView];
    //添加开始扫描按钮
    //    [self addStartButton];
    
}

//添加扫描框
- (void)addImageView
{
        
    _imageView = [[UIImageView alloc]initWithFrame:CGRectMake((Width - SWidth)/2, (Height-SWidth)/2, SWidth, SWidth)];
    //显示扫描框
    _imageView.image = [UIImage imageNamed:@"scanscanBg.png"];
    [self.view addSubview:_imageView];
    _line = [[UIImageView alloc]initWithFrame:CGRectMake(CGRectGetMinX(_imageView.frame)+5, CGRectGetMinY(_imageView.frame)+5, CGRectGetWidth(_imageView.frame), 3)];
    _line.image = [UIImage imageNamed:@"scanLine"];
    [self.view addSubview:_line];
    
    UILabel * lable = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 200, 40)];
    [lable setText:@"将二维码放入框内，自动识别"];
    lable.textAlignment = NSTextAlignmentCenter;
    lable.textColor = [UIColor whiteColor];
    lable.font = [UIFont systemFontOfSize:14];
    lable.center = CGPointMake(_imageView.center.x , _imageView.center.y+ SWidth/2 + 30);
    [self.view addSubview:lable];
}

- (void)setLeftNav {
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(15, 10 + [UIApplication sharedApplication].statusBarFrame.size.height, 30, 30)];
    imageView.image = [UIImage imageNamed:@"wq_code_scanner_back"];
    [self.view addSubview:imageView];
    imageView.userInteractionEnabled = YES;
    [imageView addGestureRecognizer:[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(goBack)]];
    
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(40, CGRectGetMinY(imageView.frame), [UIScreen mainScreen].bounds.size.width - 80, 30)];
    label.text = self.title ?: @"扫码换电";
    label.textColor = [UIColor whiteColor];
    [self.view addSubview:label];
    label.font = [UIFont systemFontOfSize:15];
    label.textAlignment = NSTextAlignmentCenter;
    
}

- (void)goBack {
    if (self.presentingViewController) {
        [self dismissViewControllerAnimated:YES completion:nil];
    }else{
        [self.navigationController popViewControllerAnimated:YES];
    }
}

//初始化扫描配置
- (void)scanSetup
{
    //2 添加预览图层
    self.preview.frame = self.view.bounds;
    self.preview.videoGravity = AVLayerVideoGravityResize;
    [self.view.layer insertSublayer:self.preview atIndex:0];
    
    //3 设置输出能够解析的数据类型
    //注意:设置数据类型一定要在输出对象添加到回话之后才能设置
    [self.output setMetadataObjectTypes:@[AVMetadataObjectTypeEAN13Code, AVMetadataObjectTypeEAN8Code, AVMetadataObjectTypeCode128Code, AVMetadataObjectTypeQRCode]];
    
    //高质量采集率
    [self.session setSessionPreset:AVCaptureSessionPresetHigh];
    
    //4 开始扫描
    [self.session startRunning];
    
}
//提示框alert
- (void)showAlertViewWithMessage:(NSString *)message
{
    //弹出提示框后，关闭扫描
    [self.session stopRunning];
    //弹出alert，关闭定时器
    [_timer setFireDate:[NSDate distantFuture]];
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"扫描结果" message:[NSString stringWithFormat:@"%@",message] preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"完成" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
      
        
        
        //点击alert，开始扫描
        [self.session startRunning];
        //开启定时器
        [_timer setFireDate:[NSDate distantPast]];
    }]];
    [self presentViewController:alert animated:true completion:^{
        
    }];
    
}

//打开系统相册
- (void)chooseButtonClick
{
    if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
        //关闭扫描
        [self stopScan];
        
        //1 弹出系统相册
        UIImagePickerController *pickVC = [[UIImagePickerController alloc]init];
        //2 设置照片来源
        /**
         UIImagePickerControllerSourceTypePhotoLibrary,相册
         UIImagePickerControllerSourceTypeCamera,相机
         UIImagePickerControllerSourceTypeSavedPhotosAlbum,照片库
         */
        
        pickVC.sourceType = UIImagePickerControllerSourceTypeSavedPhotosAlbum;
        //3 设置代理
        pickVC.delegate = self;
        //4.转场动画
        self.modalTransitionStyle=UIModalTransitionStyleFlipHorizontal;
        [self presentViewController:pickVC animated:YES completion:nil];
    }
    else
    {
        [self showAlertViewWithTitle:@"打开失败" withMessage:@"相册打开失败。设备不支持访问相册，请在设置->隐私->照片中进行设置！"];
    }
    
}
//从相册中选取照片&读取相册二维码信息
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info
{
    //1 获取选择的图片
    UIImage *image = info[UIImagePickerControllerOriginalImage];
    //初始化一个监听器
    CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:@{CIDetectorAccuracy : CIDetectorAccuracyHigh}];
    [picker dismissViewControllerAnimated:YES completion:^{
        //监测到的结果数组
        NSArray *features = [detector featuresInImage:[CIImage imageWithCGImage:image.CGImage]];
        if (features.count >= 1) {
            //结果对象
            CIQRCodeFeature *feature = [features objectAtIndex:0];
            NSString *scannedResult = feature.messageString;
            [self showAlertViewWithTitle:@"读取相册二维码" withMessage:scannedResult];
        }
        else
        {
            [self showAlertViewWithTitle:@"读取相册二维码" withMessage:@"读取失败"];
        }
    }];
    
}

#pragma mark ===========重启扫描&闪光灯===========
//添加开始扫描按钮
- (void)addStartButton
{
    UIButton *startButton = [UIButton buttonWithType:UIButtonTypeCustom];
    startButton.frame = CGRectMake(60, 420, 80, 40);
    startButton.backgroundColor = [UIColor orangeColor];
    [startButton addTarget:self action:@selector(startButtonClick) forControlEvents:UIControlEventTouchUpInside];
    [startButton setTitle:@"扫描" forState:UIControlStateNormal];
    [self.view addSubview:startButton];
}
- (void)startButtonClick
{
    //清除imageView上的图片
    self.imageView.image = [UIImage imageNamed:@""];
    //开始扫描
    [self starScan];
    
}


- (void)systemLightSwitch:(BOOL)open
{
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if ([device hasTorch]) {
        [device lockForConfiguration:nil];
        if (open) {
            [device setTorchMode:AVCaptureTorchModeOn];
        } else {
            [device setTorchMode:AVCaptureTorchModeOff];
        }
        [device unlockForConfiguration];
    }
}

#pragma mark ===========添加提示框===========
//提示框alert
- (void)showAlertViewWithTitle:(NSString *)aTitle withMessage:(NSString *)aMessage
{
    
    //弹出提示框后，关闭扫描
    [self.session stopRunning];
    //弹出alert，关闭定时器
    [_timer setFireDate:[NSDate distantFuture]];
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:aTitle message:[NSString stringWithFormat:@"%@",aMessage] preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"tishi" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        //点击alert，开始扫描
        [self.session startRunning];
        //开启定时器
        [_timer setFireDate:[NSDate distantPast]];
    }]];
    [self presentViewController:alert animated:true completion:^{
        
    }];
    
}


#pragma mark ===========扫描的代理方法===========
//得到扫描结果
- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection
{
    if ([metadataObjects count] > 0) {
        AVMetadataMachineReadableCodeObject *metadataObject = [metadataObjects objectAtIndex:0];
        if ([metadataObject isKindOfClass:[AVMetadataMachineReadableCodeObject class]]) {
            NSString *stringValue = [metadataObject stringValue];
            if (stringValue != nil) {
                [self.session stopRunning];
                [self stopScan];
                if (_timer) {
                    [_timer invalidate];
                }
                //扫描结果
                if (self.result) {
                    self.result(stringValue);
                }
                
                [self goBack];
                
            }
        }
        
    }
}


#pragma mark ============添加模糊效果============
- (void)setOverView {
    CGFloat width = CGRectGetWidth(self.view.frame);
    CGFloat height = CGRectGetHeight(self.view.frame);
    
    CGFloat x = CGRectGetMinX(_imageView.frame);
    CGFloat y = CGRectGetMinY(_imageView.frame);
    CGFloat w = CGRectGetWidth(_imageView.frame);
    CGFloat h = CGRectGetHeight(_imageView.frame);
    
    [self creatView:CGRectMake(0, 0, width, y)];
    [self creatView:CGRectMake(0, y, x, h)];
    [self creatView:CGRectMake(0, y + h, width, height - y - h)];
    [self creatView:CGRectMake(x + w, y, width - x - w, h)];
}

- (void)creatView:(CGRect)rect {
    CGFloat alpha = 0.5;
    UIColor *backColor = [UIColor blackColor];
    UIView *view = [[UIView alloc] initWithFrame:rect];
    view.backgroundColor = backColor;
    view.alpha = alpha;
    [self.view addSubview:view];
}

#pragma mark ============添加扫描效果============

- (void)addTimer
{
    _timer = [NSTimer scheduledTimerWithTimeInterval:0.008 target:self selector:@selector(timerMethod) userInfo:nil repeats:YES];
}
//控制扫描线上下滚动
- (void)timerMethod
{
    if (upOrDown == NO) {
        num ++;
        _line.frame = CGRectMake(CGRectGetMinX(_imageView.frame)+5, CGRectGetMinY(_imageView.frame)+5+num, CGRectGetWidth(_imageView.frame)-10, 3);
        if (num == (int)(CGRectGetHeight(_imageView.frame)-10)) {
            upOrDown = YES;
        }
    }
    else
    {
        num --;
        _line.frame = CGRectMake(CGRectGetMinX(_imageView.frame)+5, CGRectGetMinY(_imageView.frame)+5+num, CGRectGetWidth(_imageView.frame)-10, 3);
        if (num == 0) {
            upOrDown = NO;
        }
    }
}
//暂定扫描
- (void)stopScan
{
    //弹出提示框后，关闭扫描
    [self.session stopRunning];
    //弹出alert，关闭定时器
    [_timer setFireDate:[NSDate distantFuture]];
    //隐藏扫描线
    _line.hidden = YES;
}
- (void)starScan
{
    //开始扫描
    [self.session startRunning];
    //打开定时器
    [_timer setFireDate:[NSDate distantPast]];
    //显示扫描线
    _line.hidden = NO;
}

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection{
    CFDictionaryRef metadataDict = CMCopyDictionaryOfAttachments(NULL,sampleBuffer, kCMAttachmentMode_ShouldPropagate);
    NSDictionary *metadata = [[NSMutableDictionary alloc] initWithDictionary:(__bridge NSDictionary*)metadataDict];
    CFRelease(metadataDict);
    NSDictionary *exifMetadata = [[metadata objectForKey:(NSString *)kCGImagePropertyExifDictionary] mutableCopy];
    float brightnessValue = [[exifMetadata objectForKey:(NSString *)kCGImagePropertyExifBrightnessValue] floatValue];
    // brightnessValue 值代表光线强度，值越小代表光线越暗
    
    if (brightnessValue <= -2) {
        self.isShowBrightness = YES;
        [UIView animateWithDuration:0.2 animations:^{
            
//            self.brightnessBtn.layer.opacity = 1;
            
        } completion:^(BOOL finished) {
            
        }];
        
        
    } else {
        
        if (self.isOpenBrightness) {
           // 不用管
            return;
        }
        
        if (self.isShowBrightness) {
            // 如果正在打开
            return;
        }
        
    }
    
    
    if (brightnessValue <= -2 && !self.isOpenBrightness) {
        
    }
}

- (void)turnTorchOn:(BOOL)on{
    if ([self.device hasTorch] && [self.device hasFlash]){

        [self.device lockForConfiguration:nil];
        if (on) {
            self.isOpenBrightness = YES;
            [self.device setTorchMode:AVCaptureTorchModeOn];
            [self.device setFlashMode:AVCaptureFlashModeOn];
        } else {
            self.isOpenBrightness = NO;
            [self.device setTorchMode:AVCaptureTorchModeOff];
            [self.device setFlashMode:AVCaptureFlashModeOff];
        }
        [self.device unlockForConfiguration];
    }
}

- (UIButton *)brightnessBtn {
    if (!_brightnessBtn) {
        CGRect btnFrame = CGRectMake([UIScreen mainScreen].bounds.size.width/2 - 24, [UIScreen mainScreen].bounds.size.height - 104, 48, 80);

        _brightnessBtn= [UIButton buttonWithType:UIButtonTypeSystem];
        [_brightnessBtn setImage:[[UIImage imageNamed:@"brightnessbtnicon"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forState:UIControlStateNormal];
        [_brightnessBtn setFrame:btnFrame];
        _brightnessBtn.contentHorizontalAlignment = UIControlContentHorizontalAlignmentCenter;
        _brightnessBtn.contentVerticalAlignment = UIControlContentVerticalAlignmentTop;
        CGRect imageFrame = [_brightnessBtn imageRectForContentRect:_brightnessBtn.frame];
        
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(0,CGRectGetHeight(imageFrame) + 14 , CGRectGetWidth(btnFrame), 9)];
        [_brightnessBtn addSubview:label];
        label.text = @"手电筒";
        label.textColor = [UIColor whiteColor];
        label.font = [UIFont systemFontOfSize:12];
        label.textAlignment = NSTextAlignmentCenter;
        [_brightnessBtn addTarget:self action:@selector(turnTorchOn) forControlEvents:UIControlEventTouchUpInside];
    }
    return _brightnessBtn;
}

- (void)turnTorchOn{
     [self turnTorchOn:!self.isOpenBrightness];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setNavigationBarHidden:YES];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self.navigationController setNavigationBarHidden:NO];
}

@end












