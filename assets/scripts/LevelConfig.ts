import { Shape } from "./Shape";

export class LevelConfig {
    public level: number;
    public width: number;
    public height: number;
    public rocket: number; // 需要消除几个火箭
    public time: number; // 时间多长
    public L_R_T_B: number;
    public LR_TB: number;
    public LB_RT_RB_TB: number;
    public LRT_LRB_LTB_RTB: number;
    public LRTB: number;

    public fixedStart: Shape[][];
}