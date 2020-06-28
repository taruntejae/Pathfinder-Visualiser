export class GridNode {
    x: number;
    y: number;
    isSource: boolean = false;
    isTarget: boolean = false;
    isWall: boolean = false;
    isInPath: boolean = false;
    isVisited: boolean = false;

    constructor(x:number, y:number,){
        this.x = x;
        this.y = y;
    }
}
