import { GameState } from "../game";
import { Unit } from "./unit";

export const REGION_LINES = 4;
export const REGION_COLUMNS = 4;

export interface BoardPosition {    
    region: number,
    line: number,
    column: number,
}

export function getFoesInRegion(gs : GameState, region : number) : Unit[] {
    return gs.battle.foe.board.filter(u => u.pos.region === region);
}

export function getAlliesInRegion(gs : GameState, region : number) : Unit[] {
    return gs.battle.player.board.filter(u => u.pos.region === region);
}

export function getUnitsInRegion(gs : GameState, region : number) : Unit[] {
    return gs.battle.foe.board.concat(gs.battle.player.board).filter(u => u.pos.region === region);
}

export function getUnitAtPosition(gs : GameState, pos : BoardPosition) : Unit {
    const units = gs.battle.foe.board.concat(gs.battle.player.board).filter(
        u => u.pos.region === pos.region && u.pos.line === pos.line && u.pos.column === pos.column
    );
    if (units.length > 0) {
        return units[0];
    }
    return null;
}