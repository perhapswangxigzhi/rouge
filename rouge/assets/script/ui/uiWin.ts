import { _decorator, Component, director, Event, find, Label, Node, ProgressBar, tween, Tween, v3 } from 'cc';
import { RewardsManager } from '../bag/RewardsManager';
import { AudioMgr } from '../sound/soundManager';
const { ccclass, property } = _decorator;

@ccclass('uiWin')
export class uiWin extends Component {
    onBtnReturnClicked(){
        find('UIRoot/Mask').active = true;
        let progressBar = find('UIRoot/Mask/ProgressBar').getComponent(ProgressBar);;
        let label=find('UIRoot/Mask/ProgressBar/Label').getComponent(Label);
       
        director.preloadScene("MainUI",(completedCount:number,totalCount:number,item:any) =>{

            let progress = completedCount/totalCount;
            progressBar.progress = progress;
            label.string=`${Math.round(progress * 100)}%`;
        },()=>{
            director.loadScene("MainUI");
        });

    }
    onBtnContinueClicked(event:Event){
        const node = event.target as Node;
        node.parent.active = false;
        this.node.active = true;
        RewardsManager.instance.getEquipment();
        RewardsManager.instance.getAssent();
        tween(this.node)
                .to(0.3, { scale: v3(1.2, 1.2, 1) }) // 缩小
                .to(0.3, { scale: v3(1, 1, 1) })     // 放大
                .union()                             // 合并
                .start();                  
    }
      //点击按钮播放音效
      playSound(event:Event,customEventData:string){
        AudioMgr.inst.playOneShot('click1',1);
    }
     
   
}


