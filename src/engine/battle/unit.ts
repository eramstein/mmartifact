import { Ability, newAbility } from "./ability";
import { GameState } from "../game";
import { onDamageUnit, onMoveUnit, onUnitDeath, onSummonUnit } from "./listeners";
import { BoardPosition, isPosOnCurrentPlayerSide } from "./board";
import { nextRound } from "./turn";

export interface Unit {

    id?: string,
    name: string,
    owned?: boolean,
    exhausted?: boolean,
    pos?: BoardPosition,
    cost: number,

    hp?: number,
    hpMax: number,
    atk: number,
    armor?: number,
    retaliate?: number,
    
    abilities: Ability[],
    travel?: boolean,

    endOfRound?: TemporaryEffects,
    endOfTurn?: TemporaryEffects,
    cc?: CrowdControl,   

}

export interface TemporaryEffects {
    atk: number,
    damageShield: number,
    dot: number,
    hot: number,
}

export interface CrowdControl {
    mezz: number,
    stun: number,
    root: number,
    dazed: boolean,
}

export const defaultTempEffects = () => {
    return {
        atk: 0,
        damageShield: 0,
        dot: 0,
        hot: 0,        
    };    
};

export const defaultCrowdControl = () => {
    return {
        mezz: 0,
        stun: 0,
        root: 0,
        dazed: false,
    };    
};


export function newUnit(template : Unit) : Unit {
    return {
        armor: 0,
        retaliate: 0,

        ...template,

        abilities: template.abilities.map(newAbility),
        id: Math.random() + "",
        endOfRound: defaultTempEffects(),
        endOfTurn: defaultTempEffects(),
        cc: defaultCrowdControl(),
        hp: template.hpMax,
    }
}

export function summonUnit(gs : GameState, template : Unit, pos : BoardPosition, owned : boolean) {
    const board = owned ? gs.battle.player.board : gs.battle.foe.board;

    // check if pos is valid
    if (owned && !isPosOnCurrentPlayerSide(gs, pos)) {
        console.log("Can't summon on opponent's board");        
        return;
    }
    board.forEach(u => {
        if (u.pos === pos) {
            console.log("Can't summon on this pos, already occupied", pos, u);        
            return;
        }
    });

    // add unit to board
    const unit = newUnit(template);
    unit.owned = owned;
    unit.pos = pos;
    unit.exhausted = true;
    board.push(unit);

    // listeners
    onSummonUnit(gs, unit, pos, owned);
}

export function moveUnit(gs : GameState, unit : Unit, pos : BoardPosition) {
    if (isCurrentPlayerUnit(gs, unit) === false ||
        isPosOnCurrentPlayerSide(gs, pos) === false ||
        unit.pos.region !== pos.region && !unit.travel ||
        unit.exhausted
        ) {
        console.log("can't move here", unit, pos);        
        return false;
    }

    unit.pos = pos;
    unit.exhausted = true;

    onMoveUnit(gs, unit, pos);

    nextRound(gs, false);
}

export function damageUnit(gs : GameState, unit : Unit, damage : number, isCombatDamage : boolean) {    
    onDamageUnit(gs, unit, damage, isCombatDamage);

    const damageShield = unit.endOfRound.damageShield + unit.endOfTurn.damageShield;
    
    unit.hp -= Math.max(damage - damageShield, 0);

    unit.cc.mezz = 0;
    
    if (unit.hp <= 0) {
        destroyUnit(gs, unit);
    }
}

export function healUnit(gs : GameState, unit : Unit, value : number) {        
    unit.hp += value;
    unit.hp = Math.min(unit.hp, unit.hpMax);
}

export function mezzUnit(gs : GameState, unit : Unit, value : number) {        
    unit.cc.mezz += value;
}

export function stunUnit(gs : GameState, unit : Unit, value : number) {        
    unit.cc.stun += value;
}

export function isCurrentPlayerUnit(gs : GameState, unit : Unit) : boolean {
    return gs.battle.playersRound && unit.owned || !gs.battle.playersRound && !unit.owned;
}

export function destroyUnit(gs : GameState, unit : Unit) {
    let units;
    if (unit.owned) {
        units = gs.battle.player.board;        
    } else {
        units = gs.battle.foe.board;        
    }

    onUnitDeath(gs, unit);
    
    let index = units.reduce((agg, curr, i) => {        
        if (curr.id === unit.id) { 
            agg = i;            
        }
        return agg;
    }, -1);
    
    if (index > -1) {
        units.splice(index, 1);
    }
}

export function transformUnit(gs : GameState, fromUnit : Unit, toUnit : Unit) {    
    const newUnit = {
        ...toUnit,
        pos: fromUnit.pos,
        owned: fromUnit.owned,
    };
    
    let units;
    if (fromUnit.owned) {
        units = gs.battle.player.board;        
    } else {
        units = gs.battle.foe.board;        
    }

    let fromIndex;
    units.forEach((u, i) => {
        if (u.id === fromUnit.id) {
            fromIndex = i;
        }
    });

    units[fromIndex] = newUnit;
}

export function canUnitAttack(gs : GameState, unit : Unit) : boolean {        
    return true;
}