import React from 'react';
import styles from './index.less';

interface LoginBtnProps {
    title: string;
    styleS: any;
    click?: () => void;
}

const Page: React.FC<LoginBtnProps> = props => {
    const {
        title = '登录',
        styleS = {},
        click,
    } = props;

    return (
        <div className={styles.center} style={styleS} onClick={click}>
            {title}
        </div>
    );
};

export default Page;