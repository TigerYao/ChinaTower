import React,{FC} from "react";
import styles from "./index.less";

export interface NewsViewProps{
  logoImg:string;
  title:string;
  rignhImg?:any;
  onClick?:()=>void;
}
interface formData{
  Data:NewsViewProps;
}

const NewsView:FC<formData>=props=>{
  const {Data}=props;
  const {logoImg,title,rignhImg,onClick}=Data

  return(
    <div className={styles.NewsView} onClick={onClick}>
      <div className={styles.left}>
        <img src={logoImg} alt=""/>
        <div>{title}</div>
      </div>
      {/* <img src={rignhImg} className={styles.rightimg}/> */}
      {rignhImg}
    </div>
  )

}

export default  NewsView