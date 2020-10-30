import React, { FC, useEffect, useState } from 'react';
import { PersonalNewsModelState, ModifyNameModelState, ConnectProps, connect, router } from 'alita';
import styles from './index.less';
import { Modal, List, WhiteSpace, ImagePicker, Toast } from 'antd-mobile';
import { Field, useForm } from 'rc-field-form';
import { Store, ValidateErrorEntity } from 'rc-field-form/es/interface';
import DynamicForm, { IFormItemProps } from '@alitajs/dform';
import { uploadFile } from '@/services/loginServices';
import arrowIcon from '@/assets/images/arrow_img.png';
import IconAvatarMan from '@/assets/images/avatar-man.png';
import IconAvatar from '@/assets/images/avatar.png';
import photoIcon from '@/assets/images/personal_photo.png';
import closeIcon from '@/assets/images/closePop_img.png';
import { getLoginInfo, getUserInfo, saveUserInfo } from '@/utils/index';
import green from '@/assets/images/green.jpg';
const alert = Modal.alert;
const arrowImg = () => <img src={arrowIcon} style={{ width: '.32rem', height: '.32rem' }} />;

interface PageProps extends ConnectProps {
  personalNews: PersonalNewsModelState;
  modifyName: ModifyNameModelState;
}

const sexList = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
];

const PersonalNewsPage: FC<PageProps> = ({ personalNews, modifyName, dispatch }) => {
  const { avatar, phoneNumber, nickName, sex, certification = '' } = getUserInfo();

  // const pNumber=phoneNumber
  const pNumber =
    phoneNumber && phoneNumber.length
      ? phoneNumber.substr(0, 3) + '****' + phoneNumber.substr(7)
      : '';
  // const usersex=sex===""?'未设置':sex;

  useEffect(() => {
    dispatch!({
      type: 'modifyName/setsex',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  const [state, setState] = useState(false);
  const [files, setFile] = useState(avatar || (sex === '1' ? IconAvatar : IconAvatarMan));
  const [usersex, setuserSex] = useState(sex);
  const [select0, setSelect0] = useState(false);
  const [select1, setSelect1] = useState(false);
  // const {name}=modifyName
  // const [nickname,setnickName]=useState(name)
  let ImgUrl: null | string = null;
  const [form] = useForm();
  // 登录信息
  const loginInfo = getLoginInfo();
  // console.log(loginInfo)
  const onFinish = (values: Store) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };
  const { name, phone } = personalNews;
  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
    alert(errorInfo.errorFields[0].errors[0], '', [{ text: '取消', onPress: () => {} }]);
  };

  const isEmpty = (str: string | any[]) => {
    if (!str) {
      return true;
    }
    if (str.length === 0) {
      return true;
    }
    return false;
  };

  const formsData = [
    {
      type: 'input',
      fieldProps: 'username',
      required: false,
      title: '昵称',
      extra: arrowImg(),
      placeholder:
        nickName === null ? pNumber : name === undefined || name === '' ? nickName : name,
      editable: false,
      onClick: () => {
        dispatch!({
          type: 'modifyName/inputed',
          payload: {
            data: nickName,
          },
        });
        router.push({
          pathname: '/personalCenter/modifyName',
        });
      },
    },
    {
      type: 'input',
      fieldProps: 'usersex',
      required: false,
      title: '性别',
      editable: false,
      placeholder: usersex === '1' ? '女' : '男',
      inputType: 'text',
      extra: arrowImg(),
      onClick: () => setState(true),
    },
    {
      type: 'input',
      fieldProps: 'userphone',
      required: false,
      title: '手机号',
      editable: false,
      extra: arrowImg(),
      placeholder: phone === undefined || phone === '' ? pNumber : phone,
      onClick: () => {
        router.push({
          pathname: '/personalCenter/modifyPhone',
        });
      },
    },
    {
      type: 'input',
      fieldProps: 'authentication',
      required: false,
      placeholder: certification === '1' ? '已认证' : '未认证',
      title: '实名认证',
      extra: arrowImg(),
      editable: false,
      // disabled: true,
      onClick: () => {
        // eslint-disable-next-line no-unused-expressions
        // if (certification !== '1') {
        router.push({
          pathname: '/realNameAuth',
        });
        // }
        // certification === null || certification === '0'
        //   ? router.push({
        //       pathname: '/realNameAuth',
        //     })
        //   : '';
      },
    },
    // {
    //   type: 'input',
    //   fieldProps: 'cityswitch',
    //   required: false,
    //   title: '修改注册地',
    //   editable: false,
    //   placeholder: `${
    //     isEmpty(getUserInfo().cityName) ? '' : `当前城市：${getUserInfo().cityName}`
    //   }`,
    //   extra: arrowImg(),
    //   onClick: () => {
    //     if (getUserInfo().ifPayDeposit === '1' && getUserInfo().packageId) {
    //       Toast.info('如需修改城市注册地，请先退回押金及服务费！');
    //     } else {
    //       router.push({
    //         pathname: '/personalCenter/searchAddress',
    //       });
    //     }
    //   },
    // },
    {
      type: 'input',
      fieldProps: 'changePW',
      required: false,
      placeholder: '',
      title: '修改密码',
      extra: arrowImg(),
      editable: false,
      onClick: () => {
        router.push({
          pathname: '/personalCenter/modifyPW',
        });
      },
    },
    {
      type: 'input',
      fieldProps: 'userAddress',
      required: false,
      title: '我的使用地',
      editable: false,
      // onClick: () => console.log('点击事件'),
      extra: arrowImg(),
      onClick: () => {
        router.push({
          pathname: '/personalCenter/addressManagement',
        });
      },
    },
    {
      type: 'input',
      fieldProps: 'userAddress',
      required: false,
      title: '我的组织',
      editable: false,
      // onClick: () => console.log('点击事件'),
      extra: arrowImg(),
      onClick: () => {
        router.push({
          pathname: '/myOrg',
        });
      },
    },
  ] as IFormItemProps[];
  const formsValues = {
    username: nickName === null ? pNumber : name === undefined || name === '' ? nickName : name,
    // username: name===undefined||name===""?nickName:name,
    usersex: usersex === '1' ? '女' : '男',
    userphone: phone === undefined || phone === '' ? pNumber : phone,
    authentication: certification === '1' ? '已认证' : '未认证',
  };
  const formProps = {
    onFinish,
    onFinishFailed,
    data: formsData,
    formsValues,
    form,
  };
  // 更新用户头像
  const upload = () => {
    const file = document.getElementById('imgfile');
    const fileObj = file.files[0];
    const windowURL = window.URL || window.webkitURL;
    if (file && fileObj) {
      const dataURl = windowURL.createObjectURL(fileObj);
      const formData = new FormData();
      formData.append('file', fileObj);
      uploadFile(formData)
        .then(res => {
          ImgUrl = res.resultObject.url;
          if (ImgUrl) {
            // setFile(dataURl)

            // console.log()
            dispatch!({
              type: 'personalNews/updateUserInfo',
              payload: {
                userId: loginInfo.driverId,
                userImg: ImgUrl,
              },
            }).then(res => {
              setFile(dataURl);
              const upAvatar = getUserInfo();
              upAvatar.avatar = ImgUrl;
              saveUserInfo(upAvatar);
            });
          }
        })
        .catch(err => {
          Toast.fail('图片上传失败');
        });
    }
  };

  // 点击设置属性触发弹窗
  const itemclick = val => {
    console.log('val' + val.value);
    val.value === '0' ? setSelect0(true) : setSelect1(true);
    dispatch!({
      type: 'personalNews/updateUserInfo',
      payload: {
        sex: val.value,
        userId: loginInfo.driverId,
        callback: () => {
          const upAvatar = getUserInfo();
          upAvatar.sex = val.value;
          saveUserInfo(upAvatar);
          // console.log(val.value)
          setuserSex(val.value);
        },
      },
    });
    // setuserSex(val.value)
    // .then(res=>{
    //   const upAvatar=getUserInfo();
    //   upAvatar.sex=val.value;
    //   saveUserInfo(upAvatar)
    //   console.log(val.label)
    //   setuserSex(val.value)
    //   // dispatch!({
    //   //   type:"personalNews/setsex",
    //   // })
    // })
    // setState(false);
  };
  return (
    <div className={styles.body}>
      <div className={styles.photo}>
        <div>头像</div>
        <div className={styles.upImg}>
          <img src={files} className={styles.personalpic} />
          <img
            src={arrowIcon}
            className={styles.arrow}
            style={{ width: '.32rem', height: '.32rem' }}
          />
          <input
            type="file"
            id="imgfile"
            className={styles.inputImg}
            accept="image/*"
            onChange={upload}
          />
        </div>
      </div>
      <div>
        <WhiteSpace size="sm" />
        {formsData.map(res => {
          return (
            <div
              key={res.fieldProps}
              className={styles.formsData}
              onClick={() => {
                if (res.onClick) {
                  res.onClick();
                }
              }}
            >
              <div>{res.title}</div>
              <div className={styles.placeholder}>
                <span>{res.placeholder}</span>
                {arrowImg()}
              </div>
            </div>
          );
        })}
      </div>
      {/* <DynamicForm {...formProps}>
        <WhiteSpace size="sm" />
        <Button onClick={()=>{formClick()}}>sum</Button>
      </DynamicForm> */}
      <div className={styles.line}></div>
      {/* <div data-backdrop="static"> */}
      <Modal
        popup
        visible={state}
        animationType="slide-up"
        className={styles.modal}
        onClose={() => {
          setState(false);
        }}
      >
        <List
          renderHeader={() => (
            <div className={styles.popclose}>
              <div>性别</div>
              <img src={closeIcon} onClick={() => setState(false)} />
            </div>
          )}
          className="popup-list"
        >
          {sexList.map((item, index) => (
            <List.Item key={index} onClick={() => itemclick(item)}>
              {item.label}
              <img
                src={green}
                style={{ display: usersex === item.value ? '' : 'none', float: 'right' }}
              />
            </List.Item>
          ))}
        </List>
      </Modal>
      {/* </div> */}
      {/* <div onClick={test}>{ name }</div> */}
    </div>
  );
};

export default connect(({ personalNews }: { personalNews: PersonalNewsModelState }) => ({
  personalNews,
}))(PersonalNewsPage);
