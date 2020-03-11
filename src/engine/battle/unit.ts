import { Ability, newAbility, TriggerType } from "./ability";
import { GameState } from "../game";
import { onDamageUnit, onMoveUnit, onUnitDeath } from "./listeners";
import { BoardPosition } from "./board";

export interface Unit {
    id?: string,
    name: string,
    owned?: boolean,
    hp?: number,
    hpMax: number,
    atk: number,
    pos?: BoardPosition,
    queueTime?: number,
    abilities: Ability[],
    endOfRound?: TemporaryEffects,
    endOfTurn?: TemporaryEffects,
    cc?: CrowdControl,
    exhausted?: boolean,
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
        ...template,
        abilities: template.abilities.map(newAbility),
        id: Math.random() + "",
        endOfRound: defaultTempEffects(),
        endOfTurn: defaultTempEffects(),
        cc: defaultCrowdControl(),
        hp: template.hpMax,
    }
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

export function dazeUnit(gs : GameState, unit : Unit) {        
    unit.cc.dazed = true;
}

export function delayUnit(gs : GameState, unit : Unit, value : number) {
    if (unit.queueTime) {
        unit.queueTime += value;
    }    
}

export function moveUnit(gs : GameState, unit : Unit, pos : BoardPosition) {
    unit.pos = pos;

    onMoveUnit(gs, unit, pos);
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