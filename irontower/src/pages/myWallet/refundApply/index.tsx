import React, { FC, useEffect, useState } from 'react';
import { RefundApplyModelState, ConnectProps, connect } from 'alita';
import DynamicForm, { useForm } from '@alitajs/dform';
import { Toast, Switch } from 'antd-mobile';
import LoginBtn from '@/components/LoginBtn';
// import CloseIcon from '@/assets/images/setting-close.png';
// import OpenIcon from '@/assets/images/setting-open.png';
import styles from './index.less';

interface PageProps extends ConnectProps {
  refundApply: RefundApplyModelState;
}

const RefundApplyPage: FC<PageProps> = ({ refundApply, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    // dispatch!({
    //   type: 'refundApply/query',
    // });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = refundApply;
  const [form] = useForm();
  const submit = () => {
    form.submit();
  };
  const [isOpen, setIsOpen] = useState(true);
  const change = () => {
    setIsOpen(!isOpen);
  };
  const onFinish = (params: any) => {
    console.log(params);
  };
  const formsData = [
    {
      type: 'switch',
      fieldProps: 'isall',
      title: '是否全额退款',
      // rows: 2,
    },
    {
      type: 'area',
      fieldProps: 'instruction',
      title: '退款说明',
      placeholder: '请输入退款说明',
      // rows: 3,
    },
  ];

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.line}>
          <div>申请单号</div>
          <div>TB12322231123</div>
        </div>
        <div className={styles.line}>
          <div>押金</div>
          <div>2000元</div>
        </div>
      </div>
      <div className={styles.card}>
        {/* <div className={styles.line}>
          <div>是否全额退款</div>
          <Switch />
        </div> */}
        <DynamicForm
          data={formsData}
          form={form}
          onFinish={onFinish}
          onFinishFailed={_ => {
            if (_.errorFields.length > 0) {
              Toast.fail(_.errorFields[0].errors[0]);
            }
          }}
        />
      </div>
      <div className={styles.bottomBox}>
        <LoginBtn title="提交" styleS={{ background: 'rgba(0,191,131,1)' }} click={submit} />
      </div>
    </div>
  );
};

export default connect(({ refundApply }: { refundApply: RefundApplyModelState }) => ({
  refundApply,
}))(RefundApplyPage);
