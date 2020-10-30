import React, { FC, useEffect, useState } from 'react';
import { ApplyRefundModelState, ConnectProps, connect, router } from 'alita';
import DynamicForm, { useForm } from '@alitajs/dform';
import { Toast, Button } from 'antd-mobile';
import {
  getUserInfo,
} from '@/utils';
import { payMethodDict } from '@/utils/constant';
import styles from './index.less';

interface PageProps extends ConnectProps {
  applyRefund: ApplyRefundModelState;
}

const ApplyRefundPage: FC<PageProps> = ({ applyRefund, dispatch }) => {
  const [ depositAmountFlag, updateDepositAmountFlag ] = useState(false);
  const {
    depositAmount,
    depositType,
    deptId,
    driverId,
    cityId,
    provinceId,
  } = getUserInfo();
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'applyRefund/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = applyRefund;
  const [form] = useForm();
  const applyFormData = [
    {
      type: 'input',
      fieldProps: 'depositType',
      required: true,
      hasStar: false,
      placeholder: '退款方式',
      title: '退款方式',
      clear: true,
      coverStyle: {
        textAlign: 'right',
      },
      editable: false,
    },
    {
      type: 'input',
      fieldProps: 'refundType',
      required: true,
      hasStar: false,
      placeholder: '退款类型',
      title: '退款类型',
      clear: true,
      coverStyle: {
        textAlign: 'right',
      },
      editable: false,
    },
    {
      type: 'input',
      fieldProps: 'depositAmount',
      required: true,
      hasStar: false,
      placeholder: '押金金额',
      title: '押金金额',
      inputType: 'number',
      clear: true,
      extra: '¥',
      coverStyle: {
        textAlign: 'right',
      },
      editable: false,
    },
    {
      type: 'input',
      fieldProps: 'refundFee',
      required: true,
      hasStar: false,
      placeholder: '请输入退款金额',
      title: '退款金额',
      inputType: 'input',
      clear: true,
      extra: '¥',
      coverStyle: {
        textAlign: 'right',
      },
      onChange: e => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          refundFee: form.getFieldValue('refundFee').replace(/[^\d.]/g, ''),
        });
        if (e && e > depositAmount) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            refundFee: depositAmount,
          });
        }
      }
    },
    {
      type: "area",
      fieldProps: "refundReason",
      title: "退款原因",
      placeholder: "请输入退款原因",
      required: true,
      hasStar: false,
      clear: true,
      coverStyle: {
        textAlign: 'right',
      },
      labelNumber: 7,
    },
    /* {
      type: "area",
      fieldProps: "remark",
      title: "备注/退款说明",
      placeholder: "请输入备注/退款说明",
      required: true,
      hasStar: false,
      clear: true,
      coverStyle: {
        textAlign: 'right',
      },
      labelNumber: 7,
    } */
  ];

  const onFinish = (params: any) => {
    if (params.refundFee > depositAmount) {
      Toast.fail('退款金额必须小于等于押金金额，请重新输入');
      return;
    }
    dispatch!({
      type: 'applyRefund/subApplyRefund',
      payload: {
        deptId,
        refundFee: params.refundFee,
        refundMethod: `0${depositType}`,
        refundReason: params.refundReason,
        refundType: '3',
        userId: driverId,
        cityCode: cityId,
        provinceCode: provinceId,
        callback: () => {
          Toast.success('申请成功，请等待审核');
          setTimeout(() => { 
            router.goBack();
          },1000);
        },
      },
    });
  };

  return (
    <div className={styles.center}>
      <DynamicForm
        data={applyFormData}
        form={form}
        onFinish={onFinish}
        onFinishFailed={e => {
          console.log(e);
          Toast.fail(e.errorFields[0].errors[0]);
        }}
        formsValues={{
          depositType: payMethodDict[`0${depositType}`],
          refundType: '车电一体退款',
          depositAmount,
          refundFee: depositAmount,
        }}
      />
      <div>
        <Button
          style={{ width: '80%', margin: 'auto', marginTop: '30px' }}
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          提交申请
        </Button>
      </div>
    </div>);
};

export default connect(({ applyRefund }:{ applyRefund: ApplyRefundModelState; }) => ({ applyRefund }))(ApplyRefundPage);
