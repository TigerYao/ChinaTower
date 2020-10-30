import React, { FC } from 'react';
import classnames from 'classnames';
import styles from './index.less';

interface AlertActionItem {
  onClick?: () => void;
  title: string;
  key: string | number;
}

interface AlertActionProps {
  visiable: boolean;
  list: Array<AlertActionItem>;
  showCancel?: boolean;
  onClose?: () => void;
  cancelText?: string;
}

const AlertAction: FC<AlertActionProps> = ({
  visiable,
  list = [],
  showCancel = true,
  cancelText = '取消',
  onClose = () => {},
}) => {
  return (
    <>
      <div
        onClick={onClose}
        hidden={!visiable}
        className={classnames({
          [styles.modal]: true,
        })}
      ></div>
      <div
        className={classnames({
          [styles.wrapper]: true,
          [styles.show]: visiable,
        })}
      >
        {list.map((res: AlertActionItem) => (
          <div
            className={styles.cellBox}
            key={res.key}
            onClick={() => {
              res.onClick();
              onClose();
            }}
          >
            {res.title}
          </div>
        ))}
        {showCancel && (
          <div
            className={classnames(styles.cellBox, styles.cancel)}
            onClick={() => {
              onClose();
            }}
          >
            {cancelText}
          </div>
        )}
      </div>
    </>
  );
};

export default AlertAction;
