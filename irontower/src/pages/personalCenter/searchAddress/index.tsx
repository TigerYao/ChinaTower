import React, { FC, useEffect, useState } from 'react';
import {
  SearchAddressModelState,
  ConnectProps,
  connect,
  router,
  RealNameAuthModelState,
} from 'alita';
import { Toast } from 'antd-mobile';
import DynamicForm, { useForm } from '@alitajs/dform';
import LoginBtn from '@/components/LoginBtn';
import { getCurrentPosition, getUserInfo } from '@/utils';
import searchIcon from '@/assets/images/search_img.png';
import localIcon from '@/assets/images/local_img.png';
import ListPage from './component/List';
import ColumnPage from './component/Column';
import styles from './index.less';
import { commonFunc } from '@/utils/cordovapluigs';

interface PageProps extends ConnectProps {
  searchAddress: SearchAddressModelState;
  realNameAuth: RealNameAuthModelState;
}

const SearchAddressPage: FC<PageProps> = ({ searchAddress, dispatch, realNameAuth }) => {
  const [currentCity, setCurrentCity] = useState('定位中...');

  const getCurrentCity = () => {
    getCurrentPosition({
      success: e => {
        setCurrentCity(e.city);
      },
      fail: () => {
        setCurrentCity('定位失败');
      },
    });
  };

  // 这里发起了初始化请求
  useEffect(() => {
    // getCurrentCity();
    // dispatch!({
    //   type: 'searchAddress/selectAllCity',
    // });

    let yetHeight = 0;
    if (document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]) {
      yetHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0].clientHeight;
    }

    window.addEventListener('resize', () => {
      // eslint-disable-next-line prefer-const
      let currHeight = document.getElementsByClassName('rumtime-keep-alive-layout-no')[0]
        .clientHeight;

      // eslint-disable-next-line @typescript-eslint/camelcase
      const SearchAddressPage_Footer = document.getElementById('SearchAddressPage_Footer');
      if (currHeight < yetHeight) {
        SearchAddressPage_Footer.style.display = 'none';
      } else {
        SearchAddressPage_Footer.style.display = 'block';
      }
    });

    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
      window.removeEventListener('resize', () => {}); // 移除监听
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明

  const { allCity, allColumn } = searchAddress;
  const [form] = useForm();
  const { cityList } = realNameAuth;

  const registerFormData = [
    {
      type: 'addressPicker',
      fieldProps: 'cityId',
      required: true,
      title: '地区信息',
      placeholder: '请选择省市',
      hasStar: false,
      level: 2,
      height: '70vh',
      data: cityList,
      placeholderList: ['请选择省', '请选择市'],
      coverStyle: {
        textAlign: 'left',
      },
      onClick: () => {
        console.log('a');
        if (
          form.getFieldValue('cityId') &&
          form.getFieldValue('cityId').value &&
          form.getFieldValue('cityId').value.length > 0
        ) {
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
        let value = '';
        if (nowLevel.length > 0) {
          value = nowLevel[nowLevel.length - 1].split(',')[0];
          Toast.loading('正在加载中...');
        }

        let areaLevel = nowLevel.length + 2;
        const areaParentCode = value || '110000';
        console.log('areaParentCode==', areaParentCode);
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
      },
    },
    {
      type: 'input',
      fieldProps: 'detailedAddress',
      placeholder: '请输入详细地址',
      title: '详细地址',
      inputType: 'text',
      clear: true,
      coverStyle: {
        textAlign: 'left',
      },
      required: true,
      hasStar: false,
    },
  ];

  const submit = () => {
    form.submit();
  };

  const onFinish = (params: any) => {
    console.log(params);

    if (!(params.cityId.value[0] && params.cityId.value[1])) {
      Toast.fail('请选择地址信息');
      return;
    }

    dispatch!({
      type: 'personalNews/updateTurnsCity',
      payload: {
        driverId: getUserInfo().driverId,
        cityId: params.cityId.value[1] ? params.cityId.value[1].split(',')[0] : '',
        provinceId: params.cityId.value[0] ? params.cityId.value[0].split(',')[0] : '',
        // eslint-disable-next-line no-nested-ternary
        deptId: params.cityId.value[1]
          ? params.cityId.value[1].split(',')[1]
          : params.cityId.value[0]
          ? params.cityId.value[0].split(',')[1]
          : '',
        detailedAddress: params.detailedAddress,

        callback: () => {
          Toast.success('城市修改成功');
          localStorage.setItem('isRefreshIndex', 'true');
          commonFunc({
            method: 'notificationNative',
            params: {
              key: 'updateAnnotation',
            },
          });
          setTimeout(() => {
            router.goBack();
          }, 1500);
        },
      },
    });
  };

  return (
    <div className={styles.SearchAddressPage}>
      {/* <div className={styles.searchheader}>
        <div className={styles.search}>
          <img src={searchIcon} alt="" />
          <input
            type="text"
            placeholder="请输入城市名或者拼音"
            onChange={e => {
              console.log(e.target.value, '输入框发生变化');
              dispatch!({
                type: 'searchAddress/changeAddress',
                payload: {
                  value: e.target.value,
                },
              });
            }}
          />
        </div>
        <div className={styles.cancel} onClick={() => router.goBack()}>
          取消
        </div>
      </div>
      <div className={styles.location}>
        <div className={styles.currenlocal}>当前定位</div>
        <div className={styles.local}>
          <div className={styles.localleft}>
            <img src={localIcon} alt="" />
            <div className={styles.localtext}>{currentCity}</div>
          </div>
          <div
            className={styles.localright}
            onClick={() => {
              setCurrentCity('定位中...');
              getCurrentCity();
            }}
          >
            重新定位
          </div>
        </div>
      </div>
      <div className={styles.listpage}>
        <div className={styles.cityWrapper}>
          {allCity.map(item => (
            <ListPage
              pageDate={item}
              onClick={_item => {
                dispatch!({
                  type: 'personalNews/updateUserInfoNews',
                  payload: {
                    driverId: getUserInfo().driverId,
                    userId: getUserInfo().driverId,
                    cityId: _item.areaCode,
                    deptId: _item.deptId,
                    callback: () => {
                      Toast.success('城市修改成功');
                      setTimeout(() => {
                        router.goBack();
                      }, 1500);
                    },
                  },
                });
              }}
            />
          ))}
        </div>
        <div className={styles.column}>
          {allColumn.map((item, index) => (
            <ColumnPage columndate={item} key={index} />
          ))}
        </div>
      </div> */}

      <div className={styles.card}>
        <div className={styles.title}>
          使用地址<span>*</span>
        </div>
        <DynamicForm
          data={registerFormData}
          form={form}
          onFinish={onFinish}
          onFinishFailed={_ => {
            if (_.errorFields.length > 0) {
              Toast.fail(_.errorFields[0].errors[0]);
            }
          }}
        />
      </div>

      <div id="SearchAddressPage_Footer" className={styles.bottomBox}>
        <LoginBtn title="确认修改" styleS={{ background: 'rgba(0,191,131,1)' }} click={submit} />
      </div>
    </div>
  );
};

export default connect(
  ({
    searchAddress,
    realNameAuth,
  }: {
    searchAddress: SearchAddressModelState;
    realNameAuth: RealNameAuthModelState;
  }) => ({
    searchAddress,
    realNameAuth,
  }),
)(SearchAddressPage);
