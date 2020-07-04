import { Component } from '@angular/core';
import { GridNode } from './node.model';
import { PathfinderService } from './pathfinder.service';
import { templateJitUrl } from '@angular/compiler';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public grid: any[] = null;
  readonly gridRows = 16;
  readonly gridCols = 38;

  public source: GridNode;
  public target: GridNode;

  public isMousePressed: boolean;
  private mousePressSubject = new BehaviorSubject(false);
  private mousePress$ = this.mousePressSubject.asObservable();

  public isMoveInProgress: boolean;
  private moveInProgressSub = new BehaviorSubject(false);
  private moveInProgress$ = this.moveInProgressSub.asObservable();

  private fromNode: GridNode;
  private toNode: GridNode;

  private timeouts: any[] = [];

  constructor(private pathFinder: PathfinderService) {
    this.grid = this.generateGrid();
    this.mousePress$.subscribe((val) => {
      this.isMousePressed = val;
    });
    this.moveInProgress$.subscribe((val) => {
      this.isMoveInProgress = val;
    });
  }

  ngOnInit() {
    this.setSourceAndTarget();
  }

  run() {
    console.log(this.timeouts);
    this.clearPath();
    const { visited, prev } = this.pathFinder.solveBFS(
      this.grid,
      this.source,
      this.target,
      this.gridRows,
      this.gridCols
    );
    this.visualiseSearch(visited, prev);
  }

  setSourceAndTarget() {
    let source = { x: null, y: null };
    source['x'] = 6;
    source['y'] = 20;
    // source['x'] = Math.floor(Math.random() * (this.gridRows - 1));
    // source['y'] = Math.floor(Math.random() * (this.gridCols - 1));

    let target = { x: null, y: null };
    target['x'] = 9;
    target['y'] = 12;
    // target['x'] = Math.floor(Math.random() * (this.gridRows - 1));
    // target['y'] = Math.floor(Math.random() * (this.gridCols - 1));

    this.grid[source.x][source.y].isSource = true;
    this.grid[target.x][target.y].isTarget = true;

    this.source = this.grid[source.x][source.y];
    this.target = this.grid[target.x][target.y];
  }

  private generateGrid() {
    let temp = [];
    for (let i = 0; i < this.gridRows; i++) {
      let row: GridNode[] = [];
      for (let j = 0; j < this.gridCols; j++) {
        row.push(new GridNode(i, j));
      }
      temp.push(row);
    }
    return temp;
  }

  public clearPath() {
    this.timeouts.forEach((kTimer) => {
      clearTimeout(kTimer);
    });
    this.timeouts.length = 0;
    let newGrid = this.grid.slice();
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        if (newGrid[row][col].isVisited || newGrid[row][col].isInPath)
          newGrid[row][col] = {
            ...newGrid[row][col],
            isVisited: false,
            isInPath: false,
          };
      }
    }
    this.grid = newGrid;
  }

  public clean() {
    this.timeouts.forEach((kTimer) => {
      clearTimeout(kTimer);
    });
    this.timeouts.length = 0;
    this.grid = this.generateGrid();
    this.setSourceAndTarget();
    this.mousePressSubject.next(false);
    this.moveInProgressSub.next(false);
    this.fromNode = null;
    this.toNode = null;
  }
  private visualiseSearch(visited, prev) {
    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        this.timeouts.push(
          setTimeout(() => {
            this.constructPathAndVisualise(prev);
          }, i * 15)
        );
        return;
      }
      this.timeouts.push(
        setTimeout(() => {
          let node = visited[i];
          this.grid[node.x][node.y] = node;
        }, i * 15)
      );
    }
  }
  private constructPathAndVisualise(previousNodes) {
    let path: GridNode[] = [];
    let at = previousNodes[`${this.target.x}_${this.target.y}`];
    if (at == undefined) {
      console.log('no path found');
      return;
    }
    while (at != `${this.source.x}_${this.source.y}`) {
      let [x, y] = at.split('_');
      let node: GridNode = { ...this.grid[x][y] };
      node.isInPath = true;
      path.push(node);
      at = previousNodes[at];
    }
    path.reverse();
    const newGrid = this.grid.slice();
    for (let i in path) {
      this.timeouts.push(
        setTimeout(() => {
          newGrid[path[i].x][path[i].y] = path[i];
        }, 25 * parseInt(i))
      );
    }
    this.grid = newGrid;
  }

  toggleWall(grid, row, col) {
    if (this.isSourceOrTarget(grid[row][col])) {
      return grid;
    }
    const newGrid = grid.slice();
    const node: GridNode = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
  isSourceOrTarget(node: GridNode) {
    if (node == undefined) return true;
    if (node.x == this.source.x && node.y == this.source.y) return true;
    if (node.x == this.target.x && node.y == this.target.y) return true;
    if (node.isInPath) return true;
    return false;
  }
  handleMouseClick(node) {
    this.handleMouseDown(node);
    this.handleMouseLeave(node);
    this.handleMouseUp(node);
  }
  handleMouseDown(node) {
    if (this.isSourceOrTarget(node)) {
      this.moveInProgressSub.next(true);
      this.fromNode = { ...node };

      const newGrid = this.grid.slice();
      newGrid[node.x][node.y] = node;
      this.grid = newGrid;
    } else {
      this.mousePressSubject.next(true);
    }
  }
  handleMouseLeave(node) {
    let { x, y } = node;

    if (this.isSourceOrTarget(node)) {
    }
    if (this.isMousePressed) {
      this.grid = this.toggleWall(this.grid, x, y);
    } else return;
  }
  handleMouseUp(node) {
    if (this.isMoveInProgress) {
      this.toNode = { ...node };
      this.moveInProgressSub.next(false);
      this.moveSpecialNodes();
    }
    this.mousePressSubject.next(false);
  }
  moveSpecialNodes() {
    this.clearPath();
    const newGrid = this.grid.slice();

    if (this.fromNode.isSource) {
      this.source = { ...this.toNode, isSource: true };
      newGrid[this.source.x][this.source.y] = { ...this.source };
      newGrid[this.fromNode.x][this.fromNode.y] = new GridNode(
        this.fromNode.x,
        this.fromNode.y
      );
      this.grid = newGrid;
    } else if (this.fromNode.isTarget) {
      this.target = { ...this.toNode, isTarget: true };
      newGrid[this.target.x][this.target.y] = { ...this.target };
      newGrid[this.fromNode.x][this.fromNode.y] = new GridNode(
        this.fromNode.x,
        this.fromNode.y
      );
      this.grid = newGrid;
    }

    this.fromNode = null;
    this.toNode = null;
  }
}
