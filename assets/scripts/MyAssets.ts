import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { Shape } from './Shape';
const { ccclass, property } = _decorator;

@ccclass('MyAssets')
export class MyAssets extends Component {
    @property({ type: SpriteFrame })
    L: SpriteFrame;
    @property({ type: SpriteFrame })
    R: SpriteFrame;
    @property({ type: SpriteFrame })
    T: SpriteFrame;
    @property({ type: SpriteFrame })
    B: SpriteFrame;
    @property({ type: SpriteFrame })
    LR: SpriteFrame;
    @property({ type: SpriteFrame })
    LT: SpriteFrame;
    @property({ type: SpriteFrame })
    LB: SpriteFrame;
    @property({ type: SpriteFrame })
    RT: SpriteFrame;
    @property({ type: SpriteFrame })
    RB: SpriteFrame;
    @property({ type: SpriteFrame })
    TB: SpriteFrame;
    @property({ type: SpriteFrame })
    LRT: SpriteFrame;
    @property({ type: SpriteFrame })
    LRB: SpriteFrame;
    @property({ type: SpriteFrame })
    LTB: SpriteFrame;
    @property({ type: SpriteFrame })
    RTB: SpriteFrame;
    @property({ type: SpriteFrame })
    LRTB: SpriteFrame;

    ////
    
    @property({ type: SpriteFrame })
    L2: SpriteFrame;
    @property({ type: SpriteFrame })
    R2: SpriteFrame;
    @property({ type: SpriteFrame })
    T2: SpriteFrame;
    @property({ type: SpriteFrame })
    B2: SpriteFrame;
    @property({ type: SpriteFrame })
    LR2: SpriteFrame;
    @property({ type: SpriteFrame })
    LT2: SpriteFrame;
    @property({ type: SpriteFrame })
    LB2: SpriteFrame;
    @property({ type: SpriteFrame })
    RT2: SpriteFrame;
    @property({ type: SpriteFrame })
    RB2: SpriteFrame;
    @property({ type: SpriteFrame })
    TB2: SpriteFrame;
    @property({ type: SpriteFrame })
    LRT2: SpriteFrame;
    @property({ type: SpriteFrame })
    LRB2: SpriteFrame;
    @property({ type: SpriteFrame })
    LTB2: SpriteFrame;
    @property({ type: SpriteFrame })
    RTB2: SpriteFrame;
    @property({ type: SpriteFrame })
    LRTB2: SpriteFrame;

    ////
    
    @property({ type: SpriteFrame })
    L3: SpriteFrame;
    @property({ type: SpriteFrame })
    R3: SpriteFrame;
    @property({ type: SpriteFrame })
    T3: SpriteFrame;
    @property({ type: SpriteFrame })
    B3: SpriteFrame;
    @property({ type: SpriteFrame })
    LR3: SpriteFrame;
    @property({ type: SpriteFrame })
    LT3: SpriteFrame;
    @property({ type: SpriteFrame })
    LB3: SpriteFrame;
    @property({ type: SpriteFrame })
    RT3: SpriteFrame;
    @property({ type: SpriteFrame })
    RB3: SpriteFrame;
    @property({ type: SpriteFrame })
    TB3: SpriteFrame;
    @property({ type: SpriteFrame })
    LRT3: SpriteFrame;
    @property({ type: SpriteFrame })
    LRB3: SpriteFrame;
    @property({ type: SpriteFrame })
    LTB3: SpriteFrame;
    @property({ type: SpriteFrame })
    RTB3: SpriteFrame;
    @property({ type: SpriteFrame })
    LRTB3: SpriteFrame;

    @property({ type: SpriteFrame })
    rocket: SpriteFrame;

    spriteFrameMap: Map<string, SpriteFrame> = null;
    public GetSpriteFrame(name: string): SpriteFrame {
        if (this.spriteFrameMap == null) {
            this.spriteFrameMap = new Map<string, SpriteFrame>();
            this.spriteFrameMap[Shape[Shape.L]] = this.L;
            this.spriteFrameMap[Shape[Shape.R]] = this.R;
            this.spriteFrameMap[Shape[Shape.T]] = this.T;
            this.spriteFrameMap[Shape[Shape.B]] = this.B;
            this.spriteFrameMap[Shape[Shape.LR]] = this.LR;
            this.spriteFrameMap[Shape[Shape.LT]] = this.LT;
            this.spriteFrameMap[Shape[Shape.LB]] = this.LB;
            this.spriteFrameMap[Shape[Shape.RT]] = this.RT;
            this.spriteFrameMap[Shape[Shape.RB]] = this.RB;
            this.spriteFrameMap[Shape[Shape.TB]] = this.TB;
            this.spriteFrameMap[Shape[Shape.LRT]] = this.LRT;
            this.spriteFrameMap[Shape[Shape.LRB]] = this.LRB;
            this.spriteFrameMap[Shape[Shape.LTB]] = this.LTB;
            this.spriteFrameMap[Shape[Shape.RTB]] = this.RTB;
            this.spriteFrameMap[Shape[Shape.LRTB]] = this.LRTB;

            
            this.spriteFrameMap[Shape[Shape.L]] = this.L2;
            this.spriteFrameMap[Shape[Shape.R]] = this.R2;
            this.spriteFrameMap[Shape[Shape.T]] = this.T2;
            this.spriteFrameMap[Shape[Shape.B]] = this.B2;
            this.spriteFrameMap[Shape[Shape.LR]] = this.LR2;
            this.spriteFrameMap[Shape[Shape.LT]] = this.LT2;
            this.spriteFrameMap[Shape[Shape.LB]] = this.LB2;
            this.spriteFrameMap[Shape[Shape.RT]] = this.RT2;
            this.spriteFrameMap[Shape[Shape.RB]] = this.RB2;
            this.spriteFrameMap[Shape[Shape.TB]] = this.TB2;
            this.spriteFrameMap[Shape[Shape.LRT]] = this.LRT2;
            this.spriteFrameMap[Shape[Shape.LRB]] = this.LRB2;
            this.spriteFrameMap[Shape[Shape.LTB]] = this.LTB2;
            this.spriteFrameMap[Shape[Shape.RTB]] = this.RTB2;
            this.spriteFrameMap[Shape[Shape.LRTB]] = this.LRTB2;

            
            this.spriteFrameMap[Shape[Shape.L]] = this.L3;
            this.spriteFrameMap[Shape[Shape.R]] = this.R3;
            this.spriteFrameMap[Shape[Shape.T]] = this.T3;
            this.spriteFrameMap[Shape[Shape.B]] = this.B3;
            this.spriteFrameMap[Shape[Shape.LR]] = this.LR3;
            this.spriteFrameMap[Shape[Shape.LT]] = this.LT3;
            this.spriteFrameMap[Shape[Shape.LB]] = this.LB3;
            this.spriteFrameMap[Shape[Shape.RT]] = this.RT3;
            this.spriteFrameMap[Shape[Shape.RB]] = this.RB3;
            this.spriteFrameMap[Shape[Shape.TB]] = this.TB3;
            this.spriteFrameMap[Shape[Shape.LRT]] = this.LRT3;
            this.spriteFrameMap[Shape[Shape.LRB]] = this.LRB3;
            this.spriteFrameMap[Shape[Shape.LTB]] = this.LTB3;
            this.spriteFrameMap[Shape[Shape.RTB]] = this.RTB3;
            this.spriteFrameMap[Shape[Shape.LRTB]] = this.LRTB3;

            this.spriteFrameMap["rocket"] = this.rocket;
        }

        return this.spriteFrameMap[name];
    }
}