import React,{FC} from "react";
import styles from "./index.less";

export interface PersonItemProps{
  key?:number;// 头部是几个 1是一个，2是两个
  data?:string;//右边的日期
  title?:string;
  name?:string;
  number?:string;
  content:string;
}

interface formData {
  formData: PersonItemProps;
  click?: () => void;
}
const PersonItem: FC<formData> = props => {
  const { 
    formData, 
    click = () => {}, 
  } = props;
  const{ data, title, name, number, content, key } = formData;
  return(
    <div className={styles.PersonItem} onClick={click} style={{height: (key===1) ? 'auto' : '1.62rem'}}>
      {key===1 ?(
          <div className={styles.title}>
            <div>{name}</div>
            <div className={styles.number}>{number}</div>
          </div>
      ):(
        <div className={styles.head}>
          <div className={styles.newsTitle}>{title}</div>
          <div className={styles.data}>{data ? data.split(' ')[0] : data}</div>
        </div>
      )}
       <div className={ key===1 ? styles.content : styles.newsContent}>{content}</div>
    </div>
  )
}

export default PersonItem;