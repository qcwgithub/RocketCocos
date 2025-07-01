import { Shape } from "./Shape";

export class CellData {
    public shape: Shape = 0;
    public forbidLink: boolean = false;
    public linkedL: boolean = false;
    public linkedR: boolean = false;
    public get linkedLR(): boolean {
        return this.linkedL && this.linkedR;
    }
    public linkedLRHandled: boolean = false;
}