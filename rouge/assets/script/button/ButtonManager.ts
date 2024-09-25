import { _decorator, assetManager, Button, Component, director, Event, find,  Label,  Node, ProgressBar, Sprite, SpriteFrame } from 'cc';
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
        const button = node.getComponent(Button);
    //    console.log(node.name); // 获取当前节点名字
    //当前节点按下时，另一个节点的图标切换至初始状态
       if(node.name=='Mail'){
        assetManager.resources.load('UIicon/HolySpring_common_btn_9/spriteFrame',SpriteFrame,(err,spriteFrame)=>{
            if(err){
                console.error(err);
                return;
            }
            this.node.children[0].getChildByName('Announcement').getComponent(Sprite).spriteFrame=spriteFrame
        })
       
       }else if(node.name=='Announcement'){
        assetManager.resources.load('UIicon/HolySpring_common_btn_9/spriteFrame',SpriteFrame,(err,spriteFrame)=>{
            if(err){
                console.error(err);
                return;
            }
            this.node.children[0].getChildByName('Mail').getComponent(Sprite).spriteFrame=spriteFrame
        })
       }



       assetManager.resources.load(`UIicon/HolySpring_common_btn_8/spriteFrame`, SpriteFrame, (err, spriteFrame ) => {
        if (err) {
            console.error(err);
            return;
        }
        node.getComponent(Sprite).spriteFrame=spriteFrame
       })
        this.node.children[0].getChildByName('Title').children[0].getComponent(Label).string = customEventData;
    }
    //切换场景
    chageScence(){
        find('LevelCanvas/Mask').active = true;
        let progressBar = find('LevelCanvas/Mask/ProgressBar').getComponent(ProgressBar);;
        let label=find('LevelCanvas/Mask/ProgressBar/Label').getComponent(Label);
       
        director.preloadScene("game",(completedCount:number,totalCount:number,item:any) =>{

            let progress = completedCount/totalCount;
            progressBar.progress = progress;
            label.string=`${progress.toFixed(3)}%`;
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
    
}


