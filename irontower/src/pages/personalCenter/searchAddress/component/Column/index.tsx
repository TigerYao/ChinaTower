import React,{FC} from "react";
import styles from "./index.less";

export interface ColumnProps{
  letter:string;
  id:string;
}
interface ColumnDate{
  columndate:ColumnProps
}

const ColumnPage:FC<ColumnDate>=props=>{
  const {columndate}=props;
  const {letter, id}=columndate;

  const scrollToAnchor=(anchorName)=>{
    console.log("你点到我了"+anchorName)
    if (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName);
      // 如果对应id的锚点存在，就跳转到锚点
      if(anchorElement) { anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'}); }
  }
  }
  return(
  <div  onClick={()=>scrollToAnchor(id)} className={styles.letter}>{letter}</div>
  )
}

export default ColumnPage;
