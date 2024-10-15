import { _decorator, Button, Component, director, find, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UItalendRemind')
export class UItalendRemind extends Component {
    @property(Button)
    startBtn: Button = null;
    @property(Node)
    talentNode: Node = null;
    @property(Label)
    talentLabel: Label = null;
    levelCount: number = 0;    //等级
    talentInitCount: number = 0;   //初始天赋数量
    reflashCount: number = 0;   //刷新天赋数量
    Count:number=0;   //天赋总数量
    static instance : UItalendRemind = null;
  onLoad() {
      UItalendRemind.instance = this;
      this.startBtn.node.on(Button.EventType.CLICK, this.onCloseButtonClicked, this);
      this.talentInitCount= parseInt(this.talentLabel.string, 10);
  }
  onCloseButtonClicked(){
      this.talentNode.active = true;
      find('LevelCanvas/Player').pauseSystemEvents(true);
  }
 
  update(dt: number) {
    this.Count=this.talentInitCount+this.levelCount-this.reflashCount;
    this.talentLabel.string = this.Count.toString();
  }
}


