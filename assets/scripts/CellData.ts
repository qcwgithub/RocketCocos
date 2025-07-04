import { Shape } from "./Shape";

export class CellData {
    public shape: Shape;
    public forbidLink: boolean;
    public linkedL: boolean;
    public linkedR: boolean;
    public get linkedLR(): boolean {
        return this.linkedL && this.linkedR;
    }
    public previewHandled: boolean;
    // public fireHandled: boolean;
}