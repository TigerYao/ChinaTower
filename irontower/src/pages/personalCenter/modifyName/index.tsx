import React, { FC, useEffect, useState } from 'react';
import { ModifyNameModelState, PersonalNewsModelState, ConnectProps, connect, router } from 'alita';
import styles from './index.less';
import closeIcon from '@/assets/images/closePop_img.png';
import { Toast } from 'antd-mobile';
// import e from 'express';
import { getUserInfo, saveUserInfo } from '@/utils/index';
import goBackIcon from '@/assets/images/go-back.png';
interface PageProps extends ConnectProps {
  modifyName: ModifyNameModelState;
  personalNews: PersonalNewsModelState;
}

const ModifyNamePage: FC<PageProps> = ({ modifyName, personalNews, dispatch }) => {
  // 这里发起了初始化请求
  // useEffect(() => {
  //   dispatch!({
  //     type: 'modifyName/query',
  //   });
  //   return () => {
  //     // 这里写一些需要消除副作用的代码
  //     // 如: 声明周期中写在 componentWillUnmount
  //   };
  // }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = modifyName;
  const { driverId } = getUserInfo();
  const [img, setImg] = useState(false);
  const [num, setNum] = useState(1);

  const clearInput = () => {
    // setNum(0)
    if (num === 1) {
      setNum(0);
    } else {
      setNum(1);
    }
    dispatch!({
      type: 'modifyName/clean',
      payload: { data: '' },
    });
    setImg(false);
  };
  const isChange = e => {
    if (e.target.value.length == 0) {
      setImg(false);
    } else if (e.target.value.length > 1) {
      setImg(true);
      // if (e.target.value.length <= 20) {
      dispatch!({
        type: 'modifyName/inputed',
        payload: { data: e.target.value },
      });
      // }
    }
  };
  const confirm = () => {
    const rag = /^[\u4E00-\u9FA5A-Za-z0-9]{4,20}$/;
    if (!rag.test(modifyName.name)) {
      Toast.fail('4-20个字符，可由中英文、数字组成');
      return;
    }

    dispatch!({
      type: 'personalNews/updateUserInfo',
      payload: {
        userId: driverId,
        nickName: modifyName.name,
        callback: () => {
          const nickName = getUserInfo();
          nickName.nickName = name;
          saveUserInfo(nickName);
          console.log(name);
          dispatch!({
            type: 'personalNews/setname',
            data: name,
          });
        },
      },
    });
    router.goBack();
  };
  const goback = () => {
    router.goBack();
  };
  return (
    <div className={styles.Modifyname}>
      <div className={styles.nav}>
        <img className={styles.go} src={goBackIcon} onClick={goback} />
        <div className={styles.modify}>修改用户名</div>
        <div className={styles.sure} onClick={confirm}>
          确定
        </div>
      </div>
      {/* <div className={styles.sure} onClick={confirm}>确定</div> */}
      <div className={styles.inputText}>
        <input
          type="text"
          key={num === 0 ? 0 : 1}
          defaultValue={name}
          placeholder="请输入昵称"
          onChange={isChange}
          // value={modifyName.name}
          onFocus={() => {
            setImg(true);
          }}
        />
        {img ? <img src={closeIcon} onClick={clearInput} /> : ''}
      </div>
      <div className={styles.tips}>4-20个字符，可由中英文、数字组成</div>
      {/* <div>{name}</div> */}
    </div>
  );
};

export default connect(({ modifyName }: { modifyName: ModifyNameModelState }) => ({ modifyName }))(
  ModifyNamePage,
);
