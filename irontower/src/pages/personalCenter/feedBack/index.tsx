import React, { FC, useEffect, useState } from 'react';
import { FeedBackModelState, ConnectProps, connect, router } from 'alita';
import styles from './index.less';
import Card from './component';
import { getUserInfo } from '@/utils/index';
import { commonFunc} from '@/utils/cordovapluigs';
import { Toast } from 'antd-mobile';
interface PageProps extends ConnectProps {
  feedBack: FeedBackModelState;
}

const FeedBackPage: FC<PageProps> = ({ feedBack, dispatch }) => {
  // 这里发起了初始化请求
  const [showBottom, setShowBottom] = useState(true);
  const { driverId, deptId } = getUserInfo();
  const [dataList, setDataList] = useState([]);
  useEffect(() => {
    dispatch!({
      type: 'feedBack/selectDictionaryByDictType',
    });
    let yetHeight = 0;
    if (document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]) {
      yetHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
    }

    window.addEventListener('resize', () => {
      // eslint-disable-next-line prefer-const
      let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]
        .clientHeight;
      if (currHeight < yetHeight) {
        setShowBottom(false);
      } else {
        setShowBottom(true);
      }
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('resize', () => {});
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name, opinionList } = feedBack;
  // const [style,setStyle]=useState(false)
  // console.log('opinionList='+{opinionList})
  // const dataList = [];
  // const data={opinionList}
  const click = (value: any) => {
    if (dataList.indexOf(value) === -1) {
      if (dataList.length >= 3) {
        Toast.info('最多选择三个标签');
        return;
      }
      setDataList(dataList.concat([value]));

      // dataList.push(value);
    } else {
      dataList.splice(dataList.indexOf(value), 1);
      // const string = dataList.join(',');

      setDataList(JSON.parse(JSON.stringify(dataList)));
      // console.log(dataList.splice(value, 1));
    }
  };
  const submit = () => {
    const type = dataList.join(',');
    // var type = dataList.toString().replace(/,/g, '');
    var text = document.getElementById('textarea')?.value;

    if (type.length === 0) {
      Toast.info('请选择问题类型');
      return;
    }

    if (text.length === 0) {
      Toast.info('请输入问题描述');
      return;
    }

    dispatch!({
      type: 'feedBack/addSuggestInfo',
      payload: {
        userId: driverId,
        depId: deptId,
        text: text,
        type: type,
        callback: () => {
          Toast.success('您的信息已反馈');
          setTimeout(
            () =>
              // router.push({
              //   pathname: '/index',
              // }),
              commonFunc({
                method: 'popToView',
              }),
            1500,
          );
        },
      },
    });
  };

  console.log(dataList, 'dataList');

  return (
    <div className={styles.FeedBackPage}>
      <div style={{ height: 0, overflow: 'scroll', flex: '1' }}>
        <div className={styles.questype}>
          <div className={styles.title}>
            请选择问题类型<span>*</span>
          </div>
          <div className={styles.ques}>
            {opinionList.map((item, index) => (
              <Card
                click={click}
                style={dataList.includes(item.value)}
                cardDate={item}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className={styles.quesdescript}>
          <div className={styles.title}>
            问题描述<span>*</span>
          </div>
          <textarea placeholder="请输入你遇到的问题或建议" id="textarea"></textarea>
        </div>
        <div className={styles.tips}>
          感谢您对铁塔换电提出的宝贵意见，我们会认真对待您的每一个反馈，如您着急解决问题，您可以直接
          <span>
            <a href="tel:10096">拨打客服热线</a>
          </span>
        </div>
      </div>

      <div className={styles.foot} style={{ display: showBottom ? 'block' : 'none' }}>
        <div className={styles.button} onClick={submit}>
          提交
        </div>
      </div>
    </div>
  );
};

export default connect(({ feedBack }: { feedBack: FeedBackModelState }) => ({ feedBack }))(
  FeedBackPage,
);
