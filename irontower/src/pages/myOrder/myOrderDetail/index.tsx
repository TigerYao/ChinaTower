import React, { FC, useEffect } from 'react';
import { MyOrderDetailModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';
import { PackageListModelState } from '@/models/packageList';

interface PageProps extends ConnectProps {
  myOrderDetail: MyOrderDetailModelState;
}

const MyOrderDetailPage: FC<PageProps> = ({ packageList, myOrderDetail, dispatch, location }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'packageList/getPckageDetail',
      payload: {
        cityCode: location.query.cityId,
        packageID: location.query.packageId,
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  const { selectOffer } = packageList;
  const getOfferDetail = () => {
    // （1 按月套餐 2 按次套餐 3买M送N套餐 4车电一体套餐）
    const { packageType } = selectOffer;
    if (packageType === '1' || packageType === '01' || packageType === '5' || packageType === '6') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '折扣比率',
          value: selectOffer.discountRatio,
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
          type: 'vertical',
        },
        {
          label: '生效时间',
          value: location.query.startTime,
        },
        {
          label: '失效时间',
          value: location.query.expireTime,
        },
      ];
    }
    if (packageType === '2' || packageType === '02') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '有效期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '换电次数',
          value: `${selectOffer.exchangeNum}次`,
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
          type: 'vertical',
        },
        {
          label: '生效时间',
          value: location.query.startTime,
        },
        {
          label: '失效时间',
          value: location.query.expireTime,
        },
      ];
    }
    if (packageType === '3') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: selectOffer.leaseDate,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '赠送时长',
          value: `${selectOffer.handselDuration}天`,
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
          type: 'vertical',
        },
        {
          label: '生效时间',
          value: location.query.startTime,
        },
        {
          label: '失效时间',
          value: location.query.expireTime,
        },
      ];
    }
    if (packageType === '4') {
      return [
        {
          label: '套餐名称',
          value: selectOffer.packageName,
        },
        {
          label: '套餐类型',
          value: getOfferTitle(selectOffer),
        },
        {
          label: '押金',
          value: `${selectOffer.cashPledge}元`,
        },
        {
          label: '租金',
          value: `${selectOffer.leaseRent}元`,
        },
        {
          label: '租期',
          value: `${selectOffer.leaseDate}天`,
        },
        {
          label: '是否退租金',
          value: selectOffer.isRefundRent === '1' ? '是' : '否',
        },
        {
          label: '套餐备注',
          value: selectOffer.packageRemark,
          type: 'vertical',
        },
        {
          label: '生效时间',
          value: location.query.startTime,
        },
        {
          label: '失效时间',
          value: location.query.expireTime,
        },
      ];
    }
    return [];
  };

  const getOfferTitle = res => {
    // （1 按月套餐 2 按次套餐 3买M送N套餐 4车电一体套餐）
    const { packageType } = res;
    switch (packageType) {
      case '1':
        return '按月套餐';
      case '2': // 按照次数
        return '按次套餐';
      case '3':
        return '买M送N套餐';
      case '4':
        return '车电一体套餐';
      case '5':
        return '渠道专属套餐';
      case '6':
        return '企业专属套餐';
      case '01':
        return '按日优惠券';
      case '02':
        return '按次优惠券';
      default:
        break;
    }
  };

  return (
    <div className={styles.center}>
      {getOfferDetail().map(res => {
        if (res.type === 'vertical') {
          return (
            <div className={styles.cellBox}>
              <div>{res.label}</div>
              <div className={styles.cellContent}>{res.value}</div>
            </div>
          );
        }
        return (
          <div className={styles.cellWrapper}>
            <div>{res.label}</div>
            <div>{res.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default connect(
  ({
    myOrderDetail,
    packageList,
  }: {
    myOrderDetail: MyOrderDetailModelState;
    packageList: PackageListModelState;
  }) => ({
    myOrderDetail,
    packageList,
  }),
)(MyOrderDetailPage);
