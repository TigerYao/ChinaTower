import React, { useState, Component } from 'react';
import { List, InputItem, Toast } from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import OpenEyeIcon from '@/assets/images/open-eye.png';
import CloseEyeIcon from '@/assets/images/close-eye.png';
import isEqual from 'lodash/isEqual';
import styles from './index.less';

export interface FormItemData {
  type:
    | 'input'
    | 'select'
    | 'number'
    | 'date'
    | 'switch'
    | 'text'
    | 'textAndImgClick'
    | 'textArea'
    | 'dateAndTime'
    | 'radio'
    | 'numberSection'
    | 'dateSection'
    | 'inputAndSelect'
    | 'click'; // 表单的类型

  source?: any[]; // 选择器的源
  img?: string; // 文本后面带的图片
  initialValue?: any; // 初始化的值
  initialValue2?: any; // 初始化的值
  disabled?: boolean; // 不可交互，单个的不可用
  cascade?: boolean;
  fieldProps: string; // 受控组件绑定的key
  fieldProps2?: string; // 受控组件绑定的key
  title: string; // 标题
  placeholder: string; // 输入框或选择框的输入提示文字
  clear?: boolean; // 是否有清除按钮
  hasStar?: boolean; // 是否有红色星星，标示必填
  labelNumber?: number; // 标题的长度，默认9
  mode?: string; // 时间选择器的mode
  onValueChage?: any; // 当值修改时，某些操作需要回调
  radioType?: 'horizontal' | 'vertical'; // 单选框按钮有两种类型。分别是水平和垂直的。。默认为水平的 horizontal : vertical
  onClick?: any; // 每项的点击事件
  hide?: boolean; // 该项是否隐藏
  extra?: any; // 右边展示项
  onExtraClick?: any; // extra 点击事件
}

interface PageProps {
  formsData: FormItemData[]; // 动态表单数据
  form: formShape; // 表单对象
  allDisabled?: boolean; // 全部不可交互，展示状态
  arrType: [];
  centerSty?: any;
}

interface PageState {
  formsData: any;
  arrType: [];
}

// const Page: React.FC<PageProps, PageState> = props => {
class Page extends Component<PageProps, PageState> {
  constructor(props) {
    super(props);
    this.state = {
      formsData: props.formsData,
      arrType: props.arrType || [],
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.formsData, preState.formsData)) {
      return null;
    }
    // 修复初始化数据不更新的问题
    nextProps.form.resetFields();
    return {
      formsData: nextProps.formsData,
    };
  }

  getArrType = fieldProps => {
    let tmp = '';
    this.state.arrType.map(it => {
      if (it.fieldProps === fieldProps) {
        tmp = it.inputType;
      }
    });
    return tmp;
  };

  onExtraPassWordClick = fieldProps => {
    let arrTypeNew = this.state.arrType;
    arrTypeNew.map(it => {
      if (it.fieldProps === fieldProps) {
        if (it.inputType === 'password') {
          it.inputType = 'text';
        } else {
          it.inputType = 'password';
        }
      }
    });
    this.setState({
      arrType: arrTypeNew,
    });
  };

  render() {
    const { form, allDisabled = false, centerSty = {} } = this.props;
    const { formsData = [], arrType = [] } = this.state;

    const { getFieldProps, validateFields, setFieldsValue } = form;

    const getOpenEye = () => <img src={OpenEyeIcon} className={styles.extraStyle} alt="" />;
    const getCloseEye = () => <img src={CloseEyeIcon} className={styles.extraStyle} alt="" />;

    return (
      <div className={styles.center} style={centerSty}>
        {/* <List> */}
        {formsData.map(item => {
          const {
            type,
            source = [],
            initialValue = null,
            initialValue2 = null,
            title,
            disabled = allDisabled,
            cascade = false,
            fieldProps,
            fieldProps2,
            placeholder = '',
            clear = true,
            hasStar = false,
            labelNumber = 9,
            mode = 'date',
            // img = RightIcon,
            onValueChage = () => {},
            radioType = 'horizontal',
            onClick = () => {},
            hide = false,
            format,
            onChange,
            extra = <></>,
            onExtraClick,
            inputType = 'text',
            maxLength = 1000,
            editable = true,
            coverStyle = {},
          } = item;

          const inputItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) onChange(e);
          };

          switch (type) {
            case 'textAndImgClick':
              return (
                <div
                  className={styles.inputBox}
                  key={fieldProps}
                  onChange={e => {
                    inputItemChange(e);
                  }}
                >
                  <InputItem
                    key={fieldProps}
                    {...getFieldProps(fieldProps, {
                      initialValue,
                      rules: [{ required: hasStar }],
                    })}
                    // onChange={() => {}}
                    labelNumber={labelNumber}
                    placeholder={placeholder}
                    type={this.getArrType(fieldProps)}
                    extra={
                      this.getArrType(fieldProps) === 'password' ? getCloseEye() : getOpenEye()
                    }
                    onExtraClick={() => {
                      this.onExtraPassWordClick(fieldProps);
                    }}
                  ></InputItem>
                </div>
              );
            case 'input':
              return (
                <div className={styles.inputBox} key={fieldProps}>
                  <InputItem
                    key={fieldProps}
                    {...getFieldProps(fieldProps, {
                      initialValue,
                      onChange() {},
                      rules: [{ required: hasStar }],
                    })}
                    clear={clear}
                    labelNumber={labelNumber}
                    placeholder={placeholder}
                    extra={extra}
                    type={inputType}
                    maxLength={maxLength}
                    onExtraClick={onExtraClick}
                    style={coverStyle}
                  />
                </div>
              );
              break;

            default:
              return <></>;
              break;
          }
        })}
        {/* </List> */}
      </div>
    );
  }
}

export default createForm()(Page);
