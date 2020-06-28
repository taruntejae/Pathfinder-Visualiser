import { Injectable } from '@angular/core';
import { GridNode } from './node.model';

@Injectable({
  providedIn: 'root',
})
export class PathfinderService {
  constructor() {}

  solveBFS(grid: any[], s: GridNode, t: GridNode, rows, cols) {
    grid = JSON.parse(JSON.stringify(grid));
    const dr = [1, 0, -1, 0];
    const dc = [0, -1, 0, 1];

    const visited = [];
    const prev = {};

    let reachedTarget = false;

    const q = [];
    q.unshift(s);
    while (q.length > 0) {
      let current: GridNode = q.pop();
      if (current.x === t.x && current.y === t.y) {
        reachedTarget = true;
        break;
      }

      for (let i = 0; i < dr.length; i++) {
        const nextx = current.x + dr[i];
        const nexty = current.y + dc[i];

        if (nextx < 0 || nexty < 0) {
          continue;
        }
        if (nextx >= rows || nexty >= cols) {
          continue;
        }
        if (grid[nextx][nexty].isVisited) {
          continue;
        }
        if (grid[nextx][nexty].isWall) {
          continue;
        }

        grid[nextx][nexty].isVisited = true;
        visited.push(grid[nextx][nexty]);

        prev[nextx + '_' + nexty] = current.x + '_' + current.y;

        q.unshift(grid[nextx][nexty]);
      }
    }
    return { visited, prev };
  }

  solveBiDirectionalBFS(grid: any[], s: GridNode, t: GridNode, rows, cols) {
    grid = JSON.parse(JSON.stringify(grid));
    const dr = [1, -1, 0, 0];
    const dc = [0, 0, 1, -1];

    const visited = [];
    const prev = {};

    const sq = [];
    const tq = [];
  }
}
