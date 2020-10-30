//
//  NetworkActionTableviewCell.m
//  MapModule
//
//  Created by 秦传龙 on 2020/9/2.
//  Copyright © 2020 秦传龙. All rights reserved.
//

#import "NetworkActionTableviewCell.h"
#import "NetworkModel.h"

@interface NetworkActionTableviewCell ()

@property (weak, nonatomic) IBOutlet UIButton *detailBtn;

@property (weak, nonatomic) IBOutlet UILabel *name;

@property (weak, nonatomic) IBOutlet UILabel *addrLabel;

@end

@implementation NetworkActionTableviewCell

- (void)awakeFromNib {
    [super awakeFromNib];
       self.detailBtn.layer.shadowColor = [UIColor colorWithRed:0/255.0 green:204/255.0 blue:153/255.0 alpha:0.4].CGColor;
     self.detailBtn.layer.shadowOffset = CGSizeMake(0,4);
     self.detailBtn.layer.shadowOpacity = 1;
     self.detailBtn.layer.shadowRadius = 8;
}
- (IBAction)detailBtnClick:(UIButton *)sender {
    if (self.stationActionHandle) {
        self.stationActionHandle();
    }
}

- (void)setDetailModel:(BsNetworkInfo *)detailModel {
    _detailModel = detailModel;
    self.name.text = detailModel.nodeName;
    self.addrLabel.text = detailModel.nodeAddress;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
