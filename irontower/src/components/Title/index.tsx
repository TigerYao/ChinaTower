import React from 'react';
import styles from './index.less';

interface TitleProps {
    title: string;
}

const Page: React.FC<TitleProps> = props => {
    const {
        title = '登录铁塔换电',
    } = props;

    return (
        <div className={styles.center}>
            {title}
        </div>
    );
};

export default Page;