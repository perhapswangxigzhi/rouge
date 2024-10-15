import { _decorator, assetManager, Button, Color, Component, director, Event, EventTouch, find,  Label,  Node, ProgressBar, Sprite, SpriteFrame, v3 } from 'cc';
import { Equipment } from '../bag/Equipment';
import { AudioMgr } from '../sound/soundManager';
import { AssentManager } from '../bag/AssentManager';
import { BagStorage } from '../bag/BagStorage';
import { equipBarManager } from '../bag/equipBarManager';
const { ccclass, property } = _decorator;

@ccclass('ButtonManager')
export class ButtonManager extends Component {
    // start() {
    
    // }
    open(){
        this.node.active = true;
    }
    close(){
        this.node.active = false;
    }
   
    //邮件公告切换
    mailNoticeToggle(event:Event,customEventData:string){
       
        const node = event.target as Node;
    //当前节点按下时，另一个节点的图标切换至初始状态
       if(node.name=='Mail'){
        assetManager.resources.load('UIicon/HolySpring_common_btn_8/spriteFrame',SpriteFrame,(err,spriteFrame)=>{
            if(err){
                console.error(err);
                return;
            }
            node.getComponent(Sprite).spriteFrame=spriteFrame
            this.node.getChildByName('text').active=false
        })
       
       }else if(node.name=='Announcement'){
        assetManager.resources.load('UIicon/HolySpring_common_btn_8/spriteFrame',SpriteFrame,(err,spriteFrame)=>{
            if(err){
                console.error(err);
                return;
            }
            node.getComponent(Sprite).spriteFrame=spriteFrame
        })
        node.getChildByName('red').active=false
        node.getChildByName('text').active=true
        node.parent.parent.parent.getChildByName('red').active=false
       }



       assetManager.resources.load(`UIicon/HolySpring_common_btn_9/spriteFrame`, SpriteFrame, (err, spriteFrame ) => {
        if (err) {
            console.error(err);
            return;
        }
        this.node.getComponent(Sprite).spriteFrame=spriteFrame
       })
        this.node.parent.getChildByName('Title').children[0].getComponent(Label).string = customEventData;
    }
    //切换场景
    chageScence(){
        find('LevelCanvas/Mask').active = true;
        let progressBar = find('LevelCanvas/Mask/ProgressBar').getComponent(ProgressBar);;
        let label=find('LevelCanvas/Mask/ProgressBar/Label').getComponent(Label);
       
        director.preloadScene("game",(completedCount:number,totalCount:number,item:any) =>{

            let progress = completedCount/totalCount;
            progressBar.progress = progress;
            label.string=`${Math.round(progress * 100)}%`;
        },()=>{
            director.loadScene("game");
        });

    }

    //切换主界面
    chageMainInterface(event:Event){
        const node = event.target as Node;
        if(find(`LevelCanvas/${this.node.name}`).active==true){
            return;
        }else{
            //将所有主界面重置
            find(`LevelCanvas/UIMain`).active=false
            find(`LevelCanvas/UIEquipment`).active=false
            find(`LevelCanvas/UIShop`).active=false
            find(`LevelCanvas/UITalend`).active=false
            find(`LevelCanvas/UICopy`).active=false
            //将状态栏恢复到初始状态
            for(let i=0;i<node.parent.children.length;i++){
                node.parent.children[i].children[1].active=false
            }
            //将目标主界面的活动开启
            find(`LevelCanvas/${this.node.name}`).active = true;
            //将当前的状态栏开启
            node.children[1].active=true;
        }
    }
    //点击按钮播放音效
    playSound(event:Event,customEventData:string){
        AudioMgr.inst.playOneShot('click1',1);
    }
    //设置切换切换开关
    settingToggle(event:Event,Toggle:string){
        const node = event.target as Node;
        node.getComponent(Sprite).color=new Color(255,255,255,255)   //背景显示
       this.node.getComponent(Sprite).color=new Color(255,255,255,0)   //背景透明
        if(Toggle=='open'){
        node.parent.getChildByName('close').getComponent(Label).color=new Color(134,134,134,255)   //文字显示
        node.parent.getChildByName('open').getComponent(Label).color=new Color(255,255,255,255)   //文字显示
        }
        if(Toggle=='close'){
            node.parent.getChildByName('close').getComponent(Label).color=new Color(255,255,255,255)   //文字显示
            node.parent.getChildByName('open').getComponent(Label).color=new Color(134,134,134,255)   //文字显示
        }
        if(node.parent.getChildByName('Title').getComponent(Label).string=='音乐'){
            if(Toggle=='open'){
                AudioMgr.inst.resume();
                AudioMgr.inst.musicToggle=true;
            }
            if(Toggle=='close'){
                AudioMgr.inst.pause();
                AudioMgr.inst.musicToggle=false;
            }
        }
        if(node.parent.getChildByName('Title').getComponent(Label).string=='音效'){
            if(Toggle=='open'){
                AudioMgr.inst.audioToggle=true;
                AudioMgr.inst.playOneShot('click1',1);
            }
            if(Toggle=='close'){
                AudioMgr.inst.audioToggle=false;
            }
        }
        if(node.parent.getChildByName('Title').getComponent(Label).string=='震动'){
            if(AssentManager.instance){
            if(Toggle=='open'){
               AssentManager.instance.navigator=true;
               navigator.vibrate(100);
            }
            if(Toggle=='close'){
                AssentManager.instance.navigator=false;
            }
        }
        }

    }
    //点击关闭按钮，恢复游戏
    onCloseButtonClicked() {
        // 关闭公告
        this.node.active=false;
         // 恢复游戏
      director.resume();
    }
    //显示装备操作选项
     showEquipmentOperation(event:Event,equipCell:number){
        AssentManager.instance.equipCell=equipCell;
        const node = event.target as Node;
        this.node.active=true;
        this.node.worldPosition=v3(node.worldPosition.x+140,node.worldPosition.y,0)
     }
     //显示装备说明
     showEquipmentInfo(event:Event){
        const node = event.target as Node;
        let equipIndex=node.parent.parent.getChildByName('UIbag').getChildByName(`${AssentManager.instance.equipCell}`).children[0].getComponent(Sprite).spriteFrame.name
        let index=Equipment.inst.equipIndex.indexOf(equipIndex)
        let equipProperty=this.node.getChildByName('equipProperty').getComponent(Label)
        let equipTitle=this.node.getChildByName('equipTitle').getComponent(Label)
        if(index!=-1){
           equipTitle.string=Equipment.inst.equipmentPerporty[index].name;
           assetManager.resources.load(`equipment/${Equipment.inst.equipmentPerporty[index].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.node.getChildByName('equipIcon').getComponent(Sprite).spriteFrame=spriteFrame
            if(Equipment.inst.equipmentPerporty[index].hp!=0){
                equipProperty.string=`生命值:+${Equipment.inst.equipmentPerporty[index].hp}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].attack!=0){
                equipProperty.string+=`攻击力:+${Equipment.inst.equipmentPerporty[index].attack}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].defence!=0){
                equipProperty.string+=`防御力:+${Equipment.inst.equipmentPerporty[index].defence}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].speed!=0){
                equipProperty.string+=`移速:+${Equipment.inst.equipmentPerporty[index].speed*100}%\n`
            }
            if(Equipment.inst.equipmentPerporty[index].attackSpeed!=0){
                equipProperty.string+=`攻速:+${Equipment.inst.equipmentPerporty[index].attackSpeed*100}%\n`
            } if(Equipment.inst.equipmentPerporty[index].crit!=0){
                equipProperty.string+=`暴击率:+${Equipment.inst.equipmentPerporty[index].attackSpeed*100}%\n`
            }
        });
        }
     }
    
     //穿戴装备
     wearEquipment(event:Event){
        const node = event.target as Node;
        let equipSprite=node.parent.parent.getChildByName('UIbag').getChildByName(`${AssentManager.instance.equipCell}`).children[0].getComponent(Sprite).spriteFrame
        let equipIndex=equipSprite.name
        let index=Equipment.inst.equipIndex.indexOf(equipIndex)
        AssentManager.instance.barEquipCount.push(index);
        AssentManager.instance.throwEquip();
        equipBarManager.instance.waerEquip(Equipment.inst.equipType[index])    
        assetManager.resources.load(`UIicon/Spring_common_bac_54/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            node.parent.parent.getChildByName('UIbag').getChildByName(`${AssentManager.instance.equipCell}`).children[0].getComponent(Sprite).spriteFrame=spriteFrame
         
             //刷新背包
            BagStorage.instance.init()
        })  
     }
     //丢弃装备
     throwEquipment(event:Event){
        const node = event.target as Node;
        assetManager.resources.load(`UIicon/Spring_common_bac_54/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            node.parent.parent.getChildByName('UIbag').getChildByName(`${AssentManager.instance.equipCell}`).children[0].getComponent(Sprite).spriteFrame=spriteFrame
            AssentManager.instance.throwEquip();
            //刷新背包
            BagStorage.instance.init()
        })

     }
     //正在穿戴装备显示装备操作选项
     wearingShowEquipmentOperation(event:Event,equipCell:number){
        if(AssentManager.instance){
        AssentManager.instance.wearingEquipCeil=equipCell;
        }
        const node = event.target as Node;
        this.node.active=true;
        if(equipCell==0||equipCell==1||equipCell==2){
        this.node.worldPosition=v3(node.worldPosition.x+140,node.worldPosition.y,0)
        }else{
            this.node.worldPosition=v3(node.worldPosition.x-140,node.worldPosition.y,0)
        }
     }
      //正在穿戴装备显示装备说明
      wearingEquipmentShowEquipmentInfo(event:Event){
        const node = event.target as Node;
        let equipIndex=node.parent.parent.getChildByName('UIequipBar').children[AssentManager.instance.wearingEquipCeil].children[0].getComponent(Sprite).spriteFrame.name
        let index=Equipment.inst.equipIndex.indexOf(equipIndex)
        let equipProperty=this.node.getChildByName('equipProperty').getComponent(Label)
        let equipTitle=this.node.getChildByName('equipTitle').getComponent(Label)
        if(index!=-1){
           equipTitle.string=Equipment.inst.equipmentPerporty[index].name;
           assetManager.resources.load(`equipment/${Equipment.inst.equipmentPerporty[index].Index}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            this.node.getChildByName('equipIcon').getComponent(Sprite).spriteFrame=spriteFrame
            if(Equipment.inst.equipmentPerporty[index].hp!=0){
                equipProperty.string=`生命值:+${Equipment.inst.equipmentPerporty[index].hp}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].attack!=0){
                equipProperty.string+=`攻击力:+${Equipment.inst.equipmentPerporty[index].attack}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].defence!=0){
                equipProperty.string+=`防御力:+${Equipment.inst.equipmentPerporty[index].defence}\n`
            }
            if(Equipment.inst.equipmentPerporty[index].speed!=0){
                equipProperty.string+=`移速:+${Equipment.inst.equipmentPerporty[index].speed*100}%\n`
            }
            if(Equipment.inst.equipmentPerporty[index].attackSpeed!=0){
                equipProperty.string+=`攻速:+${Equipment.inst.equipmentPerporty[index].attackSpeed*100}%\n`
            } if(Equipment.inst.equipmentPerporty[index].crit!=0){
                equipProperty.string+=`暴击率:+${Equipment.inst.equipmentPerporty[index].attackSpeed*100}%\n`
            }
        });
        }
     }
     //取下装备
     takeOffEquipment(event:Event){
        const node = event.target as Node;
        let equipIndex=node.parent.parent.getChildByName('UIequipBar').children[AssentManager.instance.wearingEquipCeil].children[0].getComponent(Sprite).spriteFrame.name
        let index=Equipment.inst.equipIndex.indexOf(equipIndex)
        AssentManager.instance.getEquip(index);
        for(let i=0;i<AssentManager.instance.barEquipCount.length;i++){
            if(AssentManager.instance.barEquipCount[i]==index){
                AssentManager.instance.barEquipCount.splice(i,1);
                break;
            }
        }
        //移除装备栏装备
        assetManager.resources.load(`UIicon/${AssentManager.instance.wearingEquipCeil}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error(err);
                return;
            }
            node.parent.parent.getChildByName('UIequipBar').children[AssentManager.instance.wearingEquipCeil].children[0].getComponent(Sprite).spriteFrame=spriteFrame
            //对应装备栏装备为空
            AssentManager.instance.checkEmpty[AssentManager.instance.wearingEquipCeil]=false;
        })
        
        //刷新背包
        BagStorage.instance.init()
       

     }
     
    

     
}
