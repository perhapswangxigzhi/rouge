import { _decorator, Button, Component, director, find, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UItalendRemind')
export class UItalendRemind extends Component {
    @property(Button)
    startBtn: Button = null;
    @property(Node)
    talentNode: Node = null;
    @property(Label)
    talentReflashCount: Label = null;
    levelCount: number = 0;
    talentCurrentCount: number = 0;
    Count:number=0;
    static instance : UItalendRemind = null;
  onLoad() {
      UItalendRemind.instance = this;
      this.startBtn.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
      this.talentCurrentCount= parseInt(this.talentReflashCount.string, 10);
  }
  onCloseButtonClicked(){
     
      this.talentNode.active = true;
  
  }
  update(deltaTime: number){
    let talentCount=this.talentCurrentCount+this.levelCount
    this.Count=talentCount;
    this.talentReflashCount.string = talentCount.toString();
  }
}


