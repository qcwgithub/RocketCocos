import { MyGame } from "./MyGame";

export class MyInput {
    game: MyGame;
    public init(game: MyGame): void {
        this.game = game;
    }

    public myUpdate(dt: number): void {

    }
}