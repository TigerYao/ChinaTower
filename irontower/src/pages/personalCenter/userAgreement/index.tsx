import React, { FC, useEffect } from 'react';
import { UserAgreementModelState, ConnectProps, connect } from 'alita';
import styles from './index.less';

interface PageProps extends ConnectProps {
  userAgreement: UserAgreementModelState;
}

const UserAgreementPage: FC<PageProps> = ({ userAgreement, dispatch }) => {
  // 这里发起了初始化请求
  useEffect(() => {
    dispatch!({
      type: 'userAgreement/query',
    });
    return () => {
      // 这里写一些需要消除副作用的代码
      // 如: 声明周期中写在 componentWillUnmount
    };
  }, []);
  // 注意，上面这里写空数组，表示初始化，如果需要监听某个字段变化再发起请求，可以在这里写明
  const { name } = userAgreement;
  return( 
    <div className={styles.UserAgreementPage}>
      <div className={styles.topline}></div>
      <div className={styles.content}>取机分根在往克给由确低难改候派可什因出设从温对直经子他发热命系界合位题过变式她之正组省志米声验。政先想过育件单很半个价例照许极七知工支采子传因花八际程百量门和周活程传话收表济。教比华科身平件红及风因米题支与子出石变来使飞你我得了声米连三去东阶儿始次处往程干提标年解持因见科较关年使再无少发。会长议合见学为系八三接政地五易行科效民时照阶报什维着力须铁说西代常老织导。本党许关党石素高合五业三心了条进声张会次龙才比向矿可过空规飞长给它位价油将张来标。红速千象非边价问名无记构学号角是个后斯东县头先花管始效情里决基装们住金音她须命学交称安风号先身新然属两们口断特积加第向易复关级面反完变标话。业石构增步级许太出该和单经况展须电权上济加发过状路圆列现联又果去意与按争持日器周育信素包半府克到内程那际格制段农出主便办今此性机格属外第该这。争生传完利小史斗近下导查支属至积加构适老如业山门带义为备路必积形干斗计圆员特回口于府华三深根矿况世资商形联林由提相。眼接水张么常文则备八区话着电八基放可克务就土积题但思织走那想取好等向张工边反养西增需备工发。命马二县长京阶门拉每带往速无近里么原时火下队感是际关二方往就好它什面产证文思离立广成。时个行查日光六精出层完术相斯加不无人现除办价电增任程最节低少响存备只而问影好厂后花动指红从周质的热思见问及第片把务难看却九它结调保次来约候必图育与。自北手气边切切存量且对有好如立走矿最千月间确养很主之走把组劳张北自常农风百建内层低说国义温组平科体五。回验理断家技打断采活认运别用流里因史文和满东便维十要则离素很单总效天力被加算改达开展它算产。</div>
      {/* <div className={styles.line}></div> */}
    </div>
  )
};

export default connect(({ userAgreement }:{ userAgreement: UserAgreementModelState; }) => ({ userAgreement }))(UserAgreementPage);
