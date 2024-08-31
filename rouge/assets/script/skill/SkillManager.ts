
import { _decorator, assetManager, Component, Label, resources, Sprite, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkillManager')
export class SkillManager extends Component {
    // @property(SpriteFrame)
    // skillIcon: SpriteFrame = null;
    // @property(Label)
    // skillName_Label: Label = null;
    // @property(Label)
    // skillExplain_Label: Label = null;
    static instance: SkillManager | null = null;
    skillIconGetName: string[] = [];
    skillIconName: string[] = [];

    onLoad() {
        SkillManager.instance = this;
        this.skillIconGetName = [
            'HolySpring_skillicon_30011',
            'HolySpring_skillicon_30011a',
            'HolySpring_skillicon_30021',
            'HolySpring_skillicon_30021a',
            'HolySpring_skillicon_30031',
            'HolySpring_skillicon_30031a',
            'HolySpring_skillicon_30102',
            'HolySpring_skillicon_30102a',
            'HolySpring_skillicon_30106',
            'HolySpring_skillicon_30106a',
            'HolySpring_skillicon_30130',
            'HolySpring_skillicon_30130a',
            'HolySpring_skillicon_30203',
            'HolySpring_skillicon_30203a',
            'HolySpring_skillicon_30204',
            'HolySpring_skillicon_30204a',
            'HolySpring_skillicon_30205',
            'HolySpring_skillicon_30205a',
            'HolySpring_skillicon_30207',
            'HolySpring_skillicon_30207a',
            'HolySpring_skillicon_30208',
            'HolySpring_skillicon_30208a',
            'HolySpring_skillicon_30212',
            'HolySpring_skillicon_30212a',
            'HolySpring_skillicon_30217',
            'HolySpring_skillicon_30217a',
            'HolySpring_skillicon_30218',
            'HolySpring_skillicon_30218a',
            'HolySpring_skillicon_30223',
            'HolySpring_skillicon_30223a',
            'HolySpring_skillicon_30224',
            'HolySpring_skillicon_30224a',
            'HolySpring_skillicon_30229',
            'HolySpring_skillicon_30309',
            'HolySpring_skillicon_30309a',
            'HolySpring_skillicon_30310',
            'HolySpring_skillicon_30310a',
            'HolySpring_skillicon_30311',
            'HolySpring_skillicon_30311a',
            'HolySpring_skillicon_30312',
            'HolySpring_skillicon_30312a',
            'HolySpring_skillicon_30313',
            'HolySpring_skillicon_30313a',
            'HolySpring_skillicon_30314',
            'HolySpring_skillicon_30314a',
            'HolySpring_skillicon_30315',
            'HolySpring_skillicon_30315a',
            'HolySpring_skillicon_30316',
            'HolySpring_skillicon_30316a',
            'HolySpring_skillicon_30317',
            'HolySpring_skillicon_30317a',
            'HolySpring_skillicon_30319',
            'HolySpring_skillicon_30319a',
            'HolySpring_skillicon_30321',
            'HolySpring_skillicon_30322',
            'HolySpring_skillicon_31001',
            'HolySpring_skillicon_31002',
            'HolySpring_skillicon_31003',
            'HolySpring_skillicon_31004',
            'HolySpring_skillicon_31005',
            'HolySpring_skillicon_31006',
            'HolySpring_skillicon_31007',
            'HolySpring_skillicon_31011',
            'HolySpring_skillicon_31021',
            'HolySpring_skillicon_31031',
            'HolySpring_skillicon_50106',
            'HolySpring_skillicon_50107',
            'HolySpring_skillicon_50208',
            'HolySpring_skillicon_50210',               
        ];
        this.skillIconName = [
            '冰刃斩击',
            '烈刃斩击',
            '霜雷震荡',
            '狂雷震击',
            '速影飞矢',
            '炽焰冲击',
            '灵能漩涡',
            '紫电旋风',
            '生命之盾',
            '磐石之盾',
            '雷霆重锤',
            '烈焰重锤',
            '火流星击',
            '烈焰陨石',
            '水晶裂弹',
            '晶石飞弹',
            '金刺突袭',
            '螺旋钻击',
            '刀锋疾影',
            '火旋刃舞',
            '金龙狂舞',
            '银蛇乱舞',
            '紫能连击',
            '破空猛击',
            '水影斩击',
            '炽热波涛',
            '岩砾冲击',
            '破甲猛袭',
            '月刃斩击',
            '烈刃斩波',
            '地裂喷涌',
            '炎爆裂地',
            '金光涌流',
            '飞驰步影',
            '迅捷如风',
            '治愈之心',
            '强心复苏',
            '碧影剑气',
            '圣光剑影',
            '能量之壁',
            '光耀之壁',
            '能量激发',
            '狂焰战意',
            '愈合祝福',
            '金辉复苏',
            '勇者之力',
            '勇者之威',
            '碧影疾行',
            '金影疾行',
            '财富增益',
            '黄金聚财',
            '时光缓流',
            '时间凝滞',
            '力射冲击',
            '炽焰集结',
            '星辉法印',
            '魂灵侵袭',
            '紫影刀锋',
            '紫旋之力',
            '暗能回复',
            '能量爆裂',
            '暗能之盾',
            '攻防一体',
            '战意爆发',
            '紫电飞掠',
            '破空飞剑',
            '力压千钧',
            '霜冻扩散',
            '多重箭雨',
            '灵魂碎裂',
        ];
        console.log(this.skillIconGetName[0]);
        
    }

   



    randomSkill(skillIcon:Sprite, skillName:Label){
       const randomIndex = Math.floor(Math.random() * this.skillIconGetName.length);
       console.log("randomIndex的大小",randomIndex);
       console.log("获取的技能索引",this.skillIconGetName[11]);
        assetManager.resources.load(`skill/${this.skillIconGetName[randomIndex]}/spriteFrame`, SpriteFrame, (err, spriteFrame ) => {
            if (err) {
                console.error(err);
                return;
            }
        skillIcon.spriteFrame= spriteFrame;
        skillName.string = this.skillIconName[randomIndex];
        })
        
}
}