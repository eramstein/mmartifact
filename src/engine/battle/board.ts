import { GameState } from "../game";
import { Unit } from "./unit";

export const REGION_COUNT = 3;
export const REGION_LINES = 4;
export const REGION_COLUMNS = 4;

export interface BoardPosition {    
    region: number,
    line: number,
    column: number,
}

export function isPosOnCurrentPlayerSide(gs : GameState, pos : BoardPosition) : boolean {
    return gs.battle.playersRound && pos.line >= REGION_LINES/2 || !gs.battle.playersRound && pos.line < REGION_LINES/2;
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

export function isBlocked(gs : GameState, attacker : Unit, defender? : Unit) : boolean {
    const ennemies = attacker.owned ? gs.battle.foe.board : gs.battle.player.board;
    const ennemiesMelee = ennemies.filter(e =>
        e.pos.region === attacker.pos.region &&
        e.pos.column === attacker.pos.column &&
        e.pos.line !== 0 && e.pos.line !== REGION_LINES - 1
    );
    const ennemiesRange = ennemies.filter(e =>
        e.pos.region === attacker.pos.region &&
        e.pos.column === attacker.pos.column &&
        (e.pos.line === 0 || e.pos.line === REGION_LINES - 1)
    );    
    if (defender) {
        return ennemiesMelee.length > 0;
    } else {
        return ennemiesMelee.length + ennemiesRange.length > 0;
    }
}