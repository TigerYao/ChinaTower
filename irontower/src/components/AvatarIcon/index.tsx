import React, { FC } from 'react';
import classnames from 'classnames';
import IconAvatarMan from '@/assets/images/avatar-man.png';
import IconAvatar from '@/assets/images/avatar.png';
import styles from './index.less';
import { getLoginInfo } from '@/utils';
interface AvatarIconProps {
  avatarUrl?: string;
  large?: Boolean;
}

const AvatarIcon: FC<AvatarIconProps> = ({ large = false }) => {
  const { avatar, sex } = getLoginInfo();
  return (
    <div className={classnames(styles.AvatarIcon, large && styles.largIcon)}>
      <img className={styles.icon} src={avatar || (sex === '1' ? IconAvatar : IconAvatarMan)} alt="" />
      <div className={styles.avatarCircle}></div>
    </div>
  );
};

export default AvatarIcon;
