/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react';
import { RealNameAuthModelState, ConnectProps, connect, router } from 'alita';
import DynamicForm, { useForm } from '@alitajs/dform';
import LoginBtn from '@/components/LoginBtn';
import scanImage from '@/assets/images/scan-icon.png';
import { openScanQrcode } from '@/utils/cordovapluigs';

import { Toast, ImagePicker } from 'antd-mobile';
import { uploadFile } from '@/services/loginServices';
import {
  getLoginInfo,
  getUserInfo,
  fixedIOS12ReadOnlyKeyboardFocus,
  base64ToFile,
  base64ToBlob,
} from '@/utils';
import styles from './index.less';

interface PageProps extends ConnectProps {
  realNameAuth: RealNameAuthModelState;
}

interface IAddrDataProps {
  label: string;
  value: string | number;
}

const RealNameAuthPage: FC<PageProps> = ({ realNameAuth, dispatch }) => {
  const [showBottom, setShowBottom] = useState(true);
  const [orgIdFlag, updateOrgIdFlag] = useState(getUserInfo().orgType === '0');
  const [invitationCode, updateInvitationCode] = useState('');

  const scanIcon = () => <img src={scanImage} style={{ width: '.32rem', height: '.32rem' }} />;

  const {
    certification,
    // registerDetailedAddress,
  } = getUserInfo();
  const [idCardPositive, updateIdCardPositive] = useState(
    getUserInfo().idCardPositive ? getUserInfo().idCardPositive : '',
  );
  const [idCardReverse, updateIdCardReverse] = useState(
    getUserInfo().idCardReverse ? getUserInfo().idCardReverse : '',
  );

  const [orgId, updateOrgId] = useState(getUserInfo().orgId ? getUserInfo().orgId : '');
  const [orgName, updateOrgName] = useState(getUserInfo().orgName ? getUserInfo().orgName : '');
  const [showForm] = useState(certification !== '1');
  const [orgType, updateOrgType] = useState(getUserInfo().orgType ? getUserInfo().orgType : '');
  const [realName, updateRealName] = useState(getUserInfo().realName ? getUserInfo().realName : '');
  const [idCard, updateIdCard] = useState(getUserInfo().idCard ? getUserInfo().idCard : '');

  const [registerProvinceName, updateRegisterProvinceName] = useState(
    getUserInfo().registerProvinceName ? getUserInfo().registerProvinceName : '',
  );
  const [provinceName, updateProvinceName] = useState(
    getUserInfo().provinceName ? getUserInfo().provinceName : registerProvinceName || '',
  );
  const [registerCityName, updateRegisterCityName] = useState(
    getUserInfo().registerCityName ? getUserInfo().registerCityName : '',
  );
  const [cityName, updateCityName] = useState(
    getUserInfo().cityName ? getUserInfo().cityName : registerCityName || '',
  );
  const [registerProvinceId, updateRegisterProvinceId] = useState(
    getUserInfo().registerProvinceId ? getUserInfo().registerProvinceId : '',
  );
  const [provinceId, updateProvinceId] = useState(
    getUserInfo().provinceId ? getUserInfo().provinceId : '',
  );
  const [registerCityId, updateRegisterCityId] = useState(
    getUserInfo().registerCityId ? getUserInfo().registerCityId : '',
  );
  const [cityId, updateCityId] = useState(getUserInfo().cityId ? getUserInfo().cityId : '');
  const [deptId, updateDeptId] = useState(getUserInfo().deptId ? getUserInfo().deptId : '');

  // 这里发起了初始化请求
  useEffect(() => {
    fixedIOS12ReadOnlyKeyboardFocus();
    Toast.hide();
    dispatch!({
      type: 'realNameAuth/selectDictionaryByDictTypePlatform',
    });
    dispatch!({
      type: 'realNameAuth/selectDictionaryByDictTypeVolts',
    });

    let yetHeight = 0;
    if (document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]) {
      yetHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
    }

    window.addEventListener('resize', () => {
      // eslint-disable-next-line prefer-const
      let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]
        .clientHeight;

      // eslint-disable-next-line @typescript-eslint/camelcase
      const RealNameAuthPage_Footer = document.getElementById('RealNameAuthPage_Footer');
      if (currHeight < yetHeight) {
        // setShowBottom(false);
        RealNameAuthPage_Footer.style.display = 'none';
      } else {
        // setShowBottom(true);
        RealNameAuthPage_Footer.style.display = 'block';
      }
    });

    if (document.getElementById('registerCityId')) {
      document.getElementById('registerCityId').innerHTML =
        '注册地区<span style="color:#ff5e00;padding-left: 0.1rem;">*</span>';
    }

    console.log('orgIdFlag----->', orgType === '0' || orgType === '1');

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('resize', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { cityList, platformList, voltsList } = realNameAuth;
  const [form] = useForm();

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

  const realNameFormData = [
    {
      type: 'input',
      fieldProps: 'realName',
      required: true,
      hasStar: false,
      placeholder: '请输入真实姓名',
      title: '姓名',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      onChange: (val: Array<string>) => {
        updateRealName(val);
      },
    },
    {
      type: 'input',
      fieldProps: 'idCard',
      /* required: true, */
      hasStar: false,
      placeholder: '请输入18位身份证号',
      title: '身份证号',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      onChange: e => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          idCard: form.getFieldValue('idCard').replace(/[^\dXx]/g, ''),
        });

        if (e && e.length > 18) {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            idCard: form.getFieldValue('idCard').substring(0, 18),
          });
        }
        updateIdCard(form.getFieldValue('idCard'));
      },
    },
  ];

  console.log(cityList);
  const registerFormData = [
    {
      type: 'addressPicker',
      fieldProps: 'registerCityId',
      required: true,
      title: '注册地区',
      placeholder: '请选择省市',
      hasStar: false,
      level: 2,
      data: cityList,
      height: '70vh',
      placeholderList: ['请选择省', '请选择市'],
      coverStyle: {
        textAlign: 'left',
      },

      onClick: () => {
        if (
          form.getFieldValue('registerCityId') &&
          form.getFieldValue('registerCityId').value &&
          form.getFieldValue('registerCityId').value.length > 0 &&
          cityList.length > 0
        ) {
          return;
        }
        if (
          form.getFieldValue('registerCityId') &&
          form.getFieldValue('registerCityId').value &&
          form.getFieldValue('registerCityId').value.length > 0
        ) {
          const areaParentCode =
            form.getFieldValue('registerCityId').value.length - 2 <= 0
              ? form.getFieldValue('registerCityId').value[0].split(',')[0]
              : form
                  .getFieldValue('registerCityId')
                  .value[form.getFieldValue('registerCityId').value.length - 2].split(',')[0];
          dispatch!({
            type: 'realNameAuth/selectPronvieOrCity',
            payload: {
              areaLevel: form.getFieldValue('registerCityId').value.length + 1,
              areaParentCode,
            },
          });
          return;
        }
        if (cityList.length < 1) {
          dispatch!({
            type: 'realNameAuth/selectPronvieOrCity',
            payload: {
              areaLevel: 2,
              areaParentCode: '110000',
            },
          });
        }
      },
      onChangeLevel: (nowLevel: Array<string>) => {
        // nowLevel: number, value: number | string
        console.log('nowLevel==', nowLevel);
        let value = '';
        if (nowLevel.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          // console.log(nowLevel[nowLevel.length - 1].split(',')[0])
          value = nowLevel[nowLevel.length - 1].split(',')[0];
          Toast.loading('正在加载中...');
        }
        if (nowLevel.length === 1) {
          updateRegisterProvinceId(nowLevel[0].split(',')[0] || nowLevel[0]);
          updateProvinceId(nowLevel[0].split(',')[0] || nowLevel[0]);
          updateRegisterProvinceName(nowLevel[0].split(',')[2] || nowLevel[2]);
          updateRegisterCityId('');
          updateRegisterCityName('');
        } else if (nowLevel.length === 2) {
          updateRegisterProvinceId(nowLevel[0].split(',')[0]);
          updateRegisterCityId(nowLevel[1].split(',')[0]);
          updateDeptId(nowLevel[1].split(',')[1]);
          updateProvinceId(nowLevel[0].split(',')[0]);
          updateCityId(nowLevel[1].split(',')[0]);
          updateRegisterProvinceName(nowLevel[0].split(',')[2]);
          updateRegisterCityName(nowLevel[1].split(',')[2]);
        }

        let areaLevel = nowLevel.length + 2;
        const areaParentCode = value || '110000';
        if (areaLevel >= 3) {
          areaLevel = 3;
        }
        dispatch!({
          type: 'realNameAuth/selectPronvieOrCity',
          payload: {
            areaLevel,
            areaParentCode,
          },
        });
        // let areaLevel = nowLevel + 2;
        // const areaParentCode = value || '110000';
        // if (areaLevel >= 3) {
        //   areaLevel = 3;
        // }
        // dispatch!({
        //   type: 'realNameAuth/selectPronvieOrCity',
        //   payload: {
        //     areaLevel,
        //     areaParentCode,
        //   },
        // });
      },
    },
    {
      type: 'input',
      fieldProps: 'cityId',
      required: true,
      title: '使用地区',
      placeholder: '默认使用注册地区',
      hasStar: false,
      coverStyle: {
        textAlign: 'left',
      },
      editable: false,
      disabled: true,
      tabindex: -1,
    },
    {
      type: 'multiplePicker',
      fieldProps: 'orgType',
      required: true,
      hasStar: false,
      title: '归属组织',
      placeholder: '请选择',
      disabled: !(orgType === '0' || orgType === '1') || !showForm,
      maxValueLength: 1,
      data: orgType === '0' || orgType === '1' ? data : data2,
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
      editable: orgType === '0' || orgType === '1',
      extra: scanIcon(),
      onExtraClick: () => {
        if (showForm) {
          if (orgType === '0' || orgType === '1') {
            updateOrgId('');
            openScanQrcode({ title: '组织编码扫码' }, text => {
              updateOrgId(text.replace(/[^\d]/g, ''));
              dispatch!({
                type: 'personalNews/getChannelInfo',
                payload: {
                  id: text.replace(/[^\d]/g, ''),
                  callback: res => {
                    if (res.channelName) {
                      updateOrgId(text.replace(/[^\d]/g, ''));
                      updateOrgName(res.channelName);
                      console.log(res.channelName);
                    } else {
                      Toast.fail('无法找到对应的归属组织与组织名称，请您确认后重新输入。');
                    }
                  },
                },
              });
            });
          }
        }
      },

      onChange: e => {
        const reg = /^[0-9]*$/;
        if (!reg.test(form.getFieldValue('orgId'))) {
          Toast.fail('请输入正确的组织编码，或扫描渠道商/代理商提供的二维码');
        }
        form.setFieldsValue({
          ...form.getFieldsValue(),
          orgId: form.getFieldValue('orgId').replace(/[^\d]/g, ''),
        });
      },
      onBlur: txt => {
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
      placeholder: '',
      title: '组织名称',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      required: false,
      hasStar: false,
      hidden: orgIdFlag,
      editable: false,
      tabindex: -1,
    },
    {
      type: 'input',
      fieldProps: 'invitationCode',
      placeholder: '请输入邀请码(非必填)',
      title: '绑定邀请码',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      required: false,
      hasStar: false,
      extra: scanIcon(),
      onExtraClick: () => {
        if (showForm) {
          updateInvitationCode('');
          openScanQrcode({ title: '邀请码扫码' }, text => {
            updateInvitationCode(text);
          });
        }
      },
      onChange: (val: Array<string>) => {
        updateInvitationCode(val);
      },
    },
  ];

  const otherFormData = [
    {
      type: 'multiplePicker',
      fieldProps: 'batteryVolts',
      required: true,
      hasStar: false,
      title: '电池类型',
      placeholder: '请选择',
      maxValueLength: 1,
      data: voltsList,
      coverStyle: {
        textAlign: 'left',
      },
    },
    {
      type: 'multiplePicker',
      fieldProps: 'attributionPlatform',
      required: true,
      hasStar: false,
      title: '归属平台',
      placeholder: '请选择',
      maxValueLength: 1,
      data: platformList,
      coverStyle: {
        textAlign: 'left',
      },
    },
    {
      type: 'input',
      required: true,
      hasStar: false,
      fieldProps: 'vehicleBrand',
      placeholder: '请输入车辆品牌',
      title: '车辆品牌',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      // extraOnclick:
    },
  ];

  const submit = () => {
    form.submit();
  };

  const goFilesFrontArr = idCardPositive
    ? [
        {
          url: idCardPositive,
          id: '1',
        },
      ]
    : [];

  const goFilesBackArr = idCardReverse
    ? [
        {
          url: idCardReverse,
          id: '2',
        },
      ]
    : [];

  const [goFilesFront, setGoFilesFront] = useState(goFilesFrontArr);
  const [goFilesBack, setGoFilesBack] = useState(goFilesBackArr);
  const multiple = false;

  const onChangeFront = (files: Array<any>, type: string) => {
    const RealNameAuthPage_Footer = document.getElementById('RealNameAuthPage_Footer');
    if (RealNameAuthPage_Footer) {
      RealNameAuthPage_Footer.style.display = 'block';
    }
    if (type === 'add') {
      const formData = new FormData();
      formData.append('file', files[0].file);
      uploadFile(formData)
        .then(res => {
          updateIdCardPositive(res.resultObject.url);
          setGoFilesFront(files);
        })
        .catch(err => {
          Toast.info('图片上传失败');
        });
    } else {
      updateIdCardPositive('');
      setGoFilesFront(files);
    }
  };

  const onChangeBack = (files: Array<any>, type: string) => {
    const RealNameAuthPage_Footer = document.getElementById('RealNameAuthPage_Footer');
    if (RealNameAuthPage_Footer) {
      RealNameAuthPage_Footer.style.display = 'block';
    }
    if (type === 'add') {
      const formData = new FormData();
      formData.append('file', files[0].file);
      uploadFile(formData)
        .then(res => {
          updateIdCardReverse(res.resultObject.url);
          setGoFilesBack(files);
        })
        .catch(err => {
          Toast.info('图片上传失败');
        });
    } else {
      updateIdCardReverse('');
      setGoFilesBack(files);
    }
  };

  const idCardRecognition = (params: any, driverId: any) => {
    let tempregisterCityId = registerCityId;
    let tempregisterProvinceId = registerProvinceId;
    let tempDeptId = deptId;
    if (params.registerCityId.value.length) {
      tempregisterCityId = params.registerCityId.value[1]
        ? params.registerCityId.value[1].split(',')[0]
        : registerCityId;
      tempregisterProvinceId = params.registerCityId.value[0]
        ? params.registerCityId.value[0].split(',')[0]
        : registerProvinceId;
      // eslint-disable-next-line no-nested-ternary
      tempDeptId = params.registerCityId.value[1]
        ? params.registerCityId.value[1].split(',')[1]
        : params.registerCityId.value[0]
        ? params.registerCityId.value[0].split(',')[1]
        : '';
    }
    dispatch!({
      type: 'realNameAuth/idCardRecognition',
      payload: {
        idCard: params.idCard.toUpperCase(),
        idCardPositive,
        realName: params.realName,
        callback: () => {
          dispatch!({
            type: 'realNameAuth/authUpdateUser',
            payload: {
              realName: params.realName,
              idCard: params.idCard.toUpperCase(),
              registerCityId: tempregisterCityId,
              cityId: tempregisterCityId,
              registerProvinceId: tempregisterProvinceId,
              provinceId: tempregisterProvinceId,
              // eslint-disable-next-line no-nested-ternary
              deptId: tempDeptId,
              // registerDetailedAddress: params.registerDetailedAddress,
              driverId,
              idCardPositive,
              idCardReverse,
              orgType,
              orgId: params.orgId,
              invitationCode: params.invitationCode,
              invitee: driverId,
              callback: () => {
                dispatch!({
                  type: 'login/selectUserInfo',
                  payload: {
                    driverId,
                  },
                }).then(res => {
                  Toast.success('实名认证成功');
                  localStorage.setItem('isRefreshIndex', 'true');
                  setTimeout(() => {
                    router.goBack();
                  }, 2000);
                });
              },
            },
          });
        },
      },
    });
  };

  const onFinish = (params: any) => {
    // const orgType = params.orgType[0];
    if (orgType === '1') {
      if (!params.orgId) {
        Toast.fail('请填写组织编码');
        return;
      }
      if (!params.orgName) {
        Toast.fail('请正确填写组织编码');
        return;
      }
    }
    if (!idCardPositive) {
      Toast.fail('请上传个人信息面');
      return;
    }
    if (!idCardReverse) {
      Toast.fail('请上传国徽面');
      return;
    }
    if (
      !registerProvinceId &&
      !registerCityId &&
      !deptId &&
      !(params.registerCityId.value[0] && params.registerCityId.value[1])
    ) {
      Toast.fail('请选择地址信息');
      return;
    }
    console.log(params);
    const { driverId } = getLoginInfo();
    const invitationCode = params.invitationCode;
    if (invitationCode) {
      let tempregisterCityId = registerCityId;
      let tempregisterProvinceId = registerProvinceId;
      if (params.registerCityId.value.length) {
        tempregisterCityId = params.registerCityId.value[1]
          ? params.registerCityId.value[1].split(',')[0]
          : registerCityId;
        tempregisterProvinceId = params.registerCityId.value[0]
          ? params.registerCityId.value[0].split(',')[0]
          : registerProvinceId;
      }
      dispatch!({
        type: 'realNameAuth/validInvitationCode',
        payload: {
          registerProvinceId: tempregisterProvinceId,
          registerCityId: tempregisterCityId,
          provinceId: tempregisterProvinceId,
          cityId: tempregisterCityId,
          invitationCode,
          invitee: driverId,
          callback: () => {
            idCardRecognition(params, driverId);
          },
        },
      });
    } else {
      idCardRecognition(params, driverId);
    }
  };

  const usingName = () => {
    let resLabel = '';
    if (provinceName && cityName) {
      resLabel = `${provinceName},${cityName}`;
    } else if (provinceName) {
      resLabel = provinceName;
    } else if (cityName) {
      resLabel = cityName;
    } else if (registerProvinceName && registerCityName) {
      resLabel = `${registerProvinceName},${registerCityName}`;
    } else if (registerProvinceName) {
      resLabel = registerProvinceName;
    } else if (registerCityName) {
      resLabel = registerCityName;
    }
    return resLabel;
  };

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.title}>
          实名认证<span>*</span>
        </div>
        {showForm ? (
          <DynamicForm
            data={realNameFormData}
            form={form}
            formsValues={{
              realName,
              idCard,
            }}
          />
        ) : (
          <DynamicForm
            data={realNameFormData}
            form={form}
            allDisabled
            formsValues={{
              realName,
              idCard,
            }}
          />
        )}
      </div>
      <div className={styles.card}>
        <div className={styles.title}>
          上传身份证照片<span>*</span>
        </div>
        <div className={styles.imgBox}>
          {showForm ? (
            <>
              <ImagePicker
                files={goFilesFront}
                onChange={onChangeFront}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={goFilesFront.length < 1}
                multiple={multiple}
                style={{}}
              />
              <ImagePicker
                files={goFilesBack}
                onChange={onChangeBack}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={goFilesBack.length < 1}
                multiple={multiple}
              />
            </>
          ) : (
            <div className={styles.formBoxWrapper}>
              <div>
                <img
                  src={idCardPositive}
                  alt=""
                  onClick={() => {
                    router.push({
                      pathname: '/realNameAuth/ImagePreview',
                      query: {
                        picObj: JSON.stringify([{ fileUrl: idCardPositive }]),
                        selectedIndex: 0,
                      },
                    });
                    // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
                  }}
                />
              </div>
              <div>
                <img
                  src={idCardReverse}
                  alt=""
                  onClick={() => {
                    router.push({
                      pathname: '/realNameAuth/ImagePreview',
                      query: {
                        picObj: JSON.stringify([{ fileUrl: idCardReverse }]),
                        selectedIndex: 0,
                      },
                    });
                    // ImagePreview.preview({ visible :{ isOpen }, images : getImageSet(),activeIndex:index,zIndex:index});
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.imgTitle}>
          <div>个人信息面</div>
          <div>国徽面</div>
        </div>
      </div>
      <div className={styles.card}>
        {/* <div className={styles.title}>
          注册地址<span>*</span>
        </div> */}
        {showForm ? (
          <DynamicForm
            // data={registerFormData}
            data={
              orgType === '1' || orgType === '2' || orgType === '4'
                ? registerFormData
                : registerFormData.filter(
                    item => item.fieldProps !== 'orgId' && item.fieldProps !== 'orgName',
                  )
            }
            form={form}
            onFinish={onFinish}
            onFinishFailed={e => {
              console.log(e);
              Toast.fail(e.errorFields[0].errors[0]);
            }}
            formsValues={{
              invitationCode,
              orgId,
              orgName,
              registerCityId: {
                label: provinceName && cityName ? [provinceName, cityName] : [],
                value:
                  provinceName && cityName
                    ? [`${registerProvinceId},${registerProvinceId}`, `${registerCityId},${deptId}`]
                    : [],
              },
              cityId: usingName(),
              orgType: orgType ? [orgType] : undefined,
            }}
          />
        ) : (
          <DynamicForm
            data={
              orgType === '1' || orgType === '2' || orgType === '4'
                ? registerFormData
                : registerFormData.filter(
                    item => item.fieldProps !== 'orgId' && item.fieldProps !== 'orgName',
                  )
            }
            form={form}
            allDisabled
            formsValues={{
              registerCityId: {
                label: [registerProvinceName, registerCityName],
              },
              cityId: usingName(),
              orgType: orgType ? [orgType] : undefined,
              orgId,
              orgName,
              // registerDetailedAddress,
              invitationCode,
            }}
            onFinish={onFinish}
          />
        )}
      </div>
      {/* <div className={styles.card}> */}
      {/* <div className={styles.title}>
          其他信息<span>*</span>
        </div>
        <DynamicForm
          data={otherFormData}
          allDisabled={!showForm}
          form={form}
          onFinish={onFinish}
          onFinishFailed={_ => {
            if (_.errorFields.length > 0) {
              Toast.fail(_.errorFields[0].errors[0]);
            }
          }} */}
      {/* /> */}
      {/* </div> */}

      <div id="RealNameAuthPage_Footer" className={styles.bottomBox}>
        {showForm ? (
          <LoginBtn title="立即认证" styleS={{ background: 'rgba(0,191,131,1)' }} click={submit} />
        ) : (
          <LoginBtn title="已实名" styleS={{ background: 'rgba(0,191,131,1)' }} />
        )}
      </div>

      {/* <CityPicker
        show={showCityPicker}
        onClose={() => {
          setShowCityPicker(false);
        }}
      /> */}
    </div>
  );
};

export default connect(({ realNameAuth }: { realNameAuth: RealNameAuthModelState }) => ({
  realNameAuth,
}))(RealNameAuthPage);
