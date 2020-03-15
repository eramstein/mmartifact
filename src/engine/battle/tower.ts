import { GameState } from "../game";
import { WinState } from "./battle";

export interface Tower {
    isPlayer: boolean,
    pos: number,
    destroyed: boolean,
    hp: number,
    gold: number,
    goldMax: number,
}

export const TOWER_HP = [40, 80];
export const TOWER_GOLD_INIT = 2;

export function initTowers(isPlayer : boolean) : Tower[] {
    return Array(3).fill(0).map((e, i) => { return { 
        hp: TOWER_HP[0],
        destroyed: false,
        gold: TOWER_GOLD_INIT,
        goldMax: TOWER_GOLD_INIT,
        isPlayer,
        pos: i,
    } });
}

export function damageTower(gs : GameState, tower : Tower, damage : number) {
    tower.hp -= damage;
    if (tower.hp < 0) {
        if (tower.destroyed) {
            destroyAncient(gs, tower);
        } else {
            destroyTower(gs, tower);
        }
    }
}

export function destroyAncient(gs : GameState, tower : Tower) {
    if (tower.isPlayer) {
        gs.battle.winState = WinState.Lost;
    } else {
        gs.battle.winState = WinState.Won;
    } 
}

export function destroyTower(gs : GameState, tower : Tower) {
    tower.destroyed = true;
    tower.hp = TOWER_HP[1];
} 