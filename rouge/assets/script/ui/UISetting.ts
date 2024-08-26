import { _decorator, Button, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {
  @property(Button)
  startBtn: Button = null;
  @property(Node)
  announcement: Node = null;
  start() {
    
    this.startBtn.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
    
}
onCloseButtonClicked(){
   
    this.announcement.active = true;

    this.scheduleOnce(()=>{;
    director.pause();
    },0.1);
}
}


