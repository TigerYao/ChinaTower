/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react';
import { RealNameAuthModelState, ConnectProps, connect, router, setPageNavBar } from 'alita';
import DynamicForm, { useForm } from '@alitajs/dform';
import LoginBtn from '@/components/LoginBtn';
import { openScanQrcode } from '@/utils/cordovapluigs';
import scanImage from '@/assets/images/scan-icon.png';
import { Toast } from 'antd-mobile';
import { getLoginInfo, getUserInfo, fixedIOS12ReadOnlyKeyboardFocus } from '@/utils';
import styles from './index.less';

interface PageProps extends ConnectProps {
  realNameAuth: RealNameAuthModelState;
}

interface IAddrDataProps {
  label: string;
  value: string | number;
}

const RealNameAuthPage: FC<PageProps> = ({ dispatch }) => {
  const [orgId, updateOrgId] = useState(getUserInfo().orgId);
  const [orgName, updateOrgName] = useState(getUserInfo().orgName);
  const [orgType, updateOrgType] = useState(getUserInfo().orgType);

  const [orgIdFlag, updateOrgIdFlag] = useState(orgType === '0');
  const scanIcon = () => <img src={scanImage} style={{ width: '.32rem', height: '.32rem' }} />;

  // 这里发起了初始化请求

  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const [form] = useForm();
  useEffect(() => {
    //  解决iOS12键盘弹出问题
    fixedIOS12ReadOnlyKeyboardFocus();
    setPageNavBar({
      pagePath: '/myOrg',
      navBar: {
        rightContent:
          orgType === '0' || orgType === '1' ? (
            <div
              onClick={() => {
                form.submit();
              }}
              style={{ color: 'rgba(0, 191, 131, 1)' }}
            >
              保存
            </div>
          ) : (
            ''
          ),
      },
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);

  const data = [
    {
      label: '个人',
      value: '0',
    },
    {
      label: '渠道',
      value: '1',
    },
  ];

  const data2 = [
    {
      label: '个人',
      value: '0',
    },
    {
      label: '渠道',
      value: '1',
    },
    {
      label: '企业',
      value: '2',
    },
    {
      label: '邮政',
      value: '3',
    },
    {
      label: '集团',
      value: '4',
    },
  ];
  const registerFormData = [
    {
      type: 'multiplePicker',
      fieldProps: 'orgType',
      required: true,
      hasStar: false,
      title: '组织类型',
      placeholder: '请选择',
      maxValueLength: 1,
      data: orgType === '0' || orgType === '1' ? data : data2,
      disabled: !(orgType === '0' || orgType === '1'),
      coverStyle: {
        textAlign: 'left',
      },
      onChange: (val: Array<string>) => {
        updateOrgType(val[0]);
        if (val[0] === '0') {
          updateOrgIdFlag(true);
        } else {
          updateOrgIdFlag(false);
        }
      },
    },
    {
      type: 'input',
      fieldProps: 'orgId',
      placeholder: '请输入组织编码(渠道必填)',
      title: '组织编码',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      required: false,
      hasStar: false,
      hidden: orgIdFlag,
      extra: scanIcon(),
      onExtraClick: () => {
        openScanQrcode({ title: '组织编码扫码' }, text => {
          // orgId = text;
          updateOrgId(text.replace(/[^\d]/g, ''));
          dispatch!({
            type: 'personalNews/getChannelInfo',
            payload: {
              id: text.replace(/[^\d]/g, ''),
              callback: res => {
                if (res.channelName) {
                  updateOrgName(res.channelName);
                } else {
                  Toast.fail('无法找到对应的归属组织与组织名称，请您确认后重新输入。');
                }
              },
            },
          });
        });
      },
      onChange: e => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          orgId: form.getFieldValue('orgId').replace(/[^\d]/g, ''),
        });
      },
      onBlur: txt => {
        console.log(txt);
        if (txt && orgType === '1') {
          dispatch!({
            type: 'personalNews/getChannelInfo',
            payload: {
              id: txt,
              callback: res => {
                if (res.channelName) {
                  updateOrgId(txt);
                  updateOrgName(res.channelName);
                  console.log(res.channelName);
                } else {
                  Toast.fail('无法找到对应的归属组织与组织名称，请您确认后重新输入。');
                }
              },
            },
          });
        }
      },
    },
    {
      type: 'input',
      fieldProps: 'orgName',
      title: '组织名称',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      editable: false,
      required: false,
      hasStar: false,
      hidden: orgIdFlag,
    },
  ];
  const updateOrg = () => {
    const { driverId } = getLoginInfo();
    dispatch!({
      type: 'personalNews/updateUserInfoNews',
      payload: {
        driverId,
        orgType,
        orgId,
        callback: () => {
          Toast.success('组织修改成功');
          setTimeout(() => {
            router.goBack();
          }, 1000);
        },
      },
    });
  };

  const onFinish = (params: any) => {
    console.log(params);
    const orgTypes = params.orgType[0];
    console.log('orgTypes---->', orgTypes);
    if (orgTypes === '1') {
      if (!params.orgId) {
        Toast.fail('请填写组织编码');
        return;
      }
      dispatch!({
        type: 'personalNews/getChannelInfo',
        payload: {
          id: params.orgId,
          callback: res => {
            if (res.channelName) {
              updateOrgName(res.channelName);
              setTimeout(() => {
                updateOrg();
              }, 1000);
            } else {
              Toast.fail('无法找到对应的组织编码与组织名称，请您确认后重新输入。');
            }
          },
        },
      });
    } else {
      updateOrg();
    }
  };

  // const onValuesChange = values => {
  //   console.log(values);
  // };

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        {/* {showForm ? (
          <DynamicForm data={registerFormData} form={form} onFinish={onFinish} formsValues={{
            orgType: orgType ? [orgType] : undefined,
            orgId,
            // detailedAddress,
          }}/>
        ) : ( */}
        <DynamicForm
          data={registerFormData}
          form={form}
          // allDisabled
          formsValues={{
            orgType: orgType ? [orgType] : undefined,
            orgId,
            orgName,
            // detailedAddress,
          }}
          onFinish={onFinish}
          // onValuesChange={onValuesChange}
        />
      </div>
    </div>
  );
};

export default connect(({ realNameAuth }: { realNameAuth: RealNameAuthModelState }) => ({
  realNameAuth,
}))(RealNameAuthPage);
