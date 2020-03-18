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

export function getEmptyPosInRegion(gs : GameState, region : number, isPlayer : boolean) : BoardPosition[] {
    const board = isPlayer ? gs.battle.player.board : gs.battle.foe.board;
    const allPos = [];
    const busyPos = {};
    const minLine = isPlayer ? REGION_LINES/2 : 0;
    const maxLine = isPlayer ? REGION_LINES : REGION_LINES/2;

    board.forEach(u => {
        busyPos[u.pos.region + "-" + u.pos.line + "-" + u.pos.column] = true;
    });

    for (let l = minLine; l < maxLine; l++) {
        for (let c = 0; c < REGION_COLUMNS; c++) {
            if (!busyPos[region + "-" + l + "-" + c]) {
                allPos.push({ region, column: c, line: l });
            }            
        }        
    }

    return allPos;
}

export function getEmptyPosCountInRegion(gs : GameState, region : number, isPlayer : boolean) : number {
    const board = isPlayer ? gs.battle.player.board : gs.battle.foe.board;
    return REGION_LINES / 2 * REGION_COLUMNS - board.filter(u => u.pos.region === region).length;
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
    const ennemiesMelee = getMeleeInFrontOfMe(ennemies, attacker);
    const ennemiesRange = getRangeInFrontOfMe(ennemies, attacker);
    if (defender) {
        return ennemiesMelee.length > 0;
    } else {
        return ennemiesMelee.length + ennemiesRange.length > 0;
    }
}

export function getBlocker(gs : GameState, attacker : Unit) : Unit {
    const ennemies = attacker.owned ? gs.battle.foe.board : gs.battle.player.board;
    const ennemiesMelee = getMeleeInFrontOfMe(ennemies, attacker);
    const ennemiesRange = getRangeInFrontOfMe(ennemies, attacker);  
    if (ennemiesMelee.length > 0) {
        return ennemiesMelee[0];
    } else if (ennemiesRange.length > 0) {
        return ennemiesRange[0];
    } else {
        return null;
    }
}

function getMeleeInFrontOfMe(ennemies : Unit[], attacker : Unit) : Unit[] {
    return ennemies.filter(e =>
        e.pos.region === attacker.pos.region &&
        e.pos.column === attacker.pos.column &&
        e.pos.line !== 0 && e.pos.line !== REGION_LINES - 1
    );
}

function getRangeInFrontOfMe(ennemies : Unit[], attacker : Unit) : Unit[] {
    return ennemies.filter(e =>
        e.pos.region === attacker.pos.region &&
        e.pos.column === attacker.pos.column &&
        (e.pos.line === 0 || e.pos.line === REGION_LINES - 1)
    );
}