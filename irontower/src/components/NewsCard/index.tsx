import React,{FC} from "react";
import { Badge } from 'antd-mobile';
import styles from "./index.less";
import DescImg from '@/assets/images/news.png';

export interface NewsCardProps{
  dateTime?:string; // 头部的日期
  title?:string;
  imgSrc?:string;
  desc?:string;
}

interface formData {
  formData: NewsCardProps;
  click?: () => void;
}
const NewsCard: FC<formData> = props => {
  const { 
    formData, 
    click = () => {}, 
  } = props;
  const{ dateTime, title, imgSrc, desc, isRead } = formData;
  const getTxt = (htmlText = '') => {
    if (htmlText) {
      return htmlText.replace(/<[^>]*>|&nbsp;/g,"");
    }
    return '';
  }
  return(
    <div className={styles.newsCardItem} onClick={click}>
      <div className={styles.dateTime}>
        {dateTime}
      </div>
      <div className={styles.cardContain}>
        <img className={styles.descImg} src={imgSrc || DescImg} />
        <div className={styles.cardTitle}>
          {
            !isRead && (
              <Badge text="NEW" style={{ textAlign: 'center', backgroundColor: '#21b68a', borderRadius: 20 }} />
            )
          }
          {title}
        </div>
        <div className={styles.cardDesc}>
          {desc && getTxt(desc)}
        </div>
      </div>
    </div>
  )
}

export default NewsCard;