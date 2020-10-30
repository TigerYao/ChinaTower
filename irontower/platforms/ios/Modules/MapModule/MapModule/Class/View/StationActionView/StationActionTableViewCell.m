//
//  StationActionTableViewCell.m
//  MapModule
//
//  Created by 秦传龙 on 2020/9/1.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "StationActionTableViewCell.h"

@interface StationActionTableViewCell ()

@property (weak, nonatomic) IBOutlet UILabel *fullCountLabel;

@property (weak, nonatomic) IBOutlet UILabel *shortAddrLabel;

@property (weak, nonatomic) IBOutlet UILabel *detailAddrLabel;

@property (weak, nonatomic) IBOutlet UILabel *full60Label;

@property (weak, nonatomic) IBOutlet UILabel *noFull60Label;

@property (weak, nonatomic) IBOutlet UILabel *full48Label;

@property (weak, nonatomic) IBOutlet UILabel *nofull48Label;

@property (weak, nonatomic) IBOutlet UIButton *detailBtn;


@end

@implementation StationActionTableViewCell

- (void)awakeFromNib {
    [super awakeFromNib];
    self.detailBtn.layer.shadowOffset = CGSizeMake(0,4);
    self.detailBtn.layer.shadowOpacity = 1;
    self.detailBtn.layer.shadowRadius = 8;
}

- (IBAction)detailBtnHandle:(UIButton *)sender {
    if (self.stationActionHandle) {
        self.stationActionHandle();
    }
}

- (void)setDetailModel:(StationDetailModel *)detailModel {
    self.fullCountLabel.text = detailModel.fullCount;
    self.noFull60Label.text = [NSString stringWithFormat:@"充电中%@块", detailModel.notFullCount60];
    self.nofull48Label.text = [NSString stringWithFormat:@"充电中%@块", detailModel.notFullCount48];
    self.shortAddrLabel.text = detailModel.cabinetName;
    self.detailAddrLabel.text = detailModel.cabinetAddress;
    if (![detailModel.cabinetStatus isEqualToString:@"1"]) {
        [self.detailBtn setTitle:@"离线" forState:UIControlStateNormal];
        self.detailBtn.backgroundColor = [UIColor qmui_colorWithHexString:@"#999"];
        self.detailBtn.layer.shadowColor = [UIColor colorWithRed:178/255.0 green:178/255.0 blue:178/255.0 alpha:0.4].CGColor;
    } else {
        [self.detailBtn setTitle:@"详情" forState:UIControlStateNormal];
        self.detailBtn.backgroundColor = [UIColor qmui_colorWithHexString:@"#00BF83"];
        self.detailBtn.layer.shadowColor = [UIColor colorWithRed:0/255.0 green:204/255.0 blue:153/255.0 alpha:0.4].CGColor;
    }
    
    NSMutableAttributedString *full60Count = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"可用%@块", detailModel.fullCount60]];
    [full60Count setAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:18 weight:UIFontWeightMedium], NSForegroundColorAttributeName: [UIColor qmui_colorWithHexString:@"#00BF83"]} range:NSMakeRange(2, detailModel.fullCount60.length)];
    self.full60Label.attributedText = full60Count;
    
    NSMutableAttributedString *full48Count = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"可用%@块", detailModel.fullCount48]];
    [full48Count setAttributes:@{NSFontAttributeName: [UIFont systemFontOfSize:18 weight:UIFontWeightMedium], NSForegroundColorAttributeName: [UIColor qmui_colorWithHexString:@"#00BF83"]} range:NSMakeRange(2, detailModel.fullCount48.length)];
    self.full48Label.attributedText = full48Count;
    
}


- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
