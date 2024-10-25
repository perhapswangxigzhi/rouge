import { _decorator, Component, Label, Node, Vec2, Vec3, EventTouch, UITransform, v3, UI, Color } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UIFont')
export class UIFont extends Component {
    @property(Label)
    label_001: Label = null; // 引用 Label 组件
    @property(Label)
    label_002: Label = null; // 引用 Label 组件
    @property(Label)
    label_003: Label = null; // 引用 Label 组件
    MiddleLabel: Label = null; // 引用 Label 组件
    LeftLabel: Label = null; // 引用 Label 组件
    RightLabel: Label = null; // 引用 Label 组件
    static MiddleIndex:number=0  //当前管卡的索引
    static canOpenLevel:boolean[]=[true,false,false,false,false]  //是否可以打开关卡
    LeftIndex:number=4
    RightIndex:number=1
    currentDirection:number=0;  //0:不移动 1:向左移动 2:向右移动
    LevelTest:string[]=["第一关","第二关","第三关","第四关","第五关"]
    private MiddlePosition: Vec3 = new Vec3(); // 存储起始位置
    private LeftPosition: Vec3 = new Vec3(); // 存储起始位置
    private RightPosition: Vec3 = new Vec3(); // 存储起始位置
    private startTouchX: number = 0; // 记录触摸开始时的X坐标

    start() {
        // 监听触摸事件
        this.MiddlePosition =v3(0,0,0)
        this.LeftPosition =v3(-250,0,0)
        this.RightPosition =v3(250,0,0)
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchCancel, this);
        this.label_001.string = this.LevelTest[this.LeftIndex];
        this.label_002.string = this.LevelTest[UIFont.MiddleIndex];
        this.label_003.string = this.LevelTest[this.RightIndex];
        this.MiddleLabel = this.label_002;
        this.LeftLabel = this.label_001;
        this.RightLabel = this.label_003;
    }
    onTouchStart(event: EventTouch) {
        // 记录触摸开始位置
        this.startTouchX = event.getLocation().x;
    }


    onTouchMove(event: EventTouch) {
        // 获取触摸点的位置变化
        const touchDelta = event.getDelta();
        this.MiddleLabel.node.position = new Vec3(
            this.MiddleLabel.node.position.x + touchDelta.x,
            this.MiddleLabel.node.position.y,
            this.MiddleLabel.node.position.z
        );
        this.RightLabel.node.position = new Vec3(
            this.RightLabel.node.position.x + touchDelta.x,
            this.RightLabel.node.position.y,
            this.RightLabel.node.position.z
        );
        this.LeftLabel.node.position = new Vec3(
            this.LeftLabel.node.position.x + touchDelta.x,
            this.LeftLabel.node.position.y,
            this.LeftLabel.node.position.z
        );      
        
    }
    onTouchCancel(event: EventTouch) {
        // 获取触摸结束时的位置
        const endTouchX = event.getLocation().x;
        const distanceMoved = this.startTouchX - endTouchX;   // 获取节点移动距离的绝对值
        const width = this.label_002.node.getComponent(UITransform).width; // 获取节点宽度
        // 先将当前标签的记录保存在一个临时变量中
        const oldMiddleLabel = this.MiddleLabel;
        const oldRightLabel = this.RightLabel;
        const oldLeftLabel = this.LeftLabel;
        //向左移动
        if(distanceMoved>0){
            if (Math.abs(distanceMoved) > width / 4) {
                this.MiddleLabel.node.position = this.LeftPosition.clone();
                this.MiddleLabel=oldRightLabel;
                this.RightLabel.node.position = this.MiddlePosition.clone();
                this.RightLabel=oldLeftLabel;
                this.LeftLabel.node.position = this.RightPosition.clone();
                this.LeftLabel=oldMiddleLabel;
            }else{
                //维持初始位置不变
                this.LeftLabel.node.position = this.LeftPosition.clone();
                this.MiddleLabel.node.position = this.MiddlePosition.clone();
                this.RightLabel.node.position = this.RightPosition.clone();
            }
        }else{
            //向右移动
            if (Math.abs(distanceMoved) > width / 4) {
                this.MiddleLabel.node.position = this.RightPosition.clone();
                this.MiddleLabel=oldLeftLabel;
                this.LeftLabel.node.position = this.MiddlePosition.clone();
                this.LeftLabel=oldRightLabel;
                this.RightLabel.node.position = this.LeftPosition.clone();
                this.RightLabel=oldMiddleLabel;
            }else{  
                //维持初始位置不变
                this.LeftLabel.node.position = this.LeftPosition.clone();
                this.MiddleLabel.node.position = this.MiddlePosition.clone();
                this.RightLabel.node.position = this.RightPosition.clone();
            }
        }
    this.chageIndex(distanceMoved)   
       
    }
    chageIndex(distanceMoved:number){
        if(distanceMoved>0){
            //向左移动
            UIFont.MiddleIndex++;
            this.RightIndex++;
            this.LeftIndex++;
            if(this.RightIndex>this.LevelTest.length-1){
                this.RightIndex=0;
            }
            if(UIFont.MiddleIndex>this.LevelTest.length-1){
                UIFont.MiddleIndex=0;
            }
            if(this.LeftIndex>this.LevelTest.length-1){
                this.LeftIndex=0;
            }
            this.LeftLabel.string = this.LevelTest[this.LeftIndex];
            this.MiddleLabel.string = this.LevelTest[UIFont.MiddleIndex];
            this.RightLabel.string = this.LevelTest[this.RightIndex];
            if(UIFont.canOpenLevel[UIFont.MiddleIndex]==false){
                this.MiddleLabel.color = new Color(255,255,255,150);
            }else{
                this.MiddleLabel.color = new Color(255,255,255,255);
            }
        }else{
            //向右移动
            UIFont.MiddleIndex--;
            this.RightIndex--;
            this.LeftIndex--;
            if(this.RightIndex<0){
                this.RightIndex=this.LevelTest.length-1;
            }
            if(UIFont.MiddleIndex<0){
                UIFont.MiddleIndex=this.LevelTest.length-1;
            }
            if(this.LeftIndex<0){
                this.LeftIndex=this.LevelTest.length-1;
            }
            this.LeftLabel.string = this.LevelTest[this.LeftIndex];
            this.MiddleLabel.string = this.LevelTest[UIFont.MiddleIndex];
            if(UIFont.canOpenLevel[UIFont.MiddleIndex]==false){
                this.MiddleLabel.color = new Color(255,255,255,150);
            }else{
                this.MiddleLabel.color = new Color(255,255,255,255);
            }
        }
    }

  
}
