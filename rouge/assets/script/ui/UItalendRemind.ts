import { _decorator, Button, Component, director, find, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UItalendRemind')
export class UItalendRemind extends Component {
    @property(Button)
    startBtn: Button = null;
    @property(Node)
    talentNode: Node = null;
    start() {
      
      this.startBtn.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
      
  }
  onCloseButtonClicked(){
     
      this.talentNode.active = true;
  
      // this.scheduleOnce(()=>{;
      // // director.pause();
      // },0.1);
  }
}


