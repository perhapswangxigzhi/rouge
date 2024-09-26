import { _decorator, Component, director, Event, find, Label, Node, ProgressBar, tween, Tween, v3 } from 'cc';
import { EquipmentManager } from '../bag/EquipmentManager';
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
            label.string=`${progress.toFixed(3)}%`;
        },()=>{
            director.loadScene("MainUI");
        });

    }
    onBtnContinueClicked(event:Event){
        const node = event.target as Node;
        node.parent.active = false;
      
        this.node.active = true;
        EquipmentManager.instance.getEquipment();
        tween(this.node)
                .to(0.3, { scale: v3(1.2, 1.2, 1) }) // 缩小
                .to(0.3, { scale: v3(1, 1, 1) })     // 放大
                .union()                             // 合并
                .start();                  
    }
   
}


