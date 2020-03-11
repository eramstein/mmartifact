import { GameState } from "../game";
import { Unit, damageUnit, TemporaryEffects, healUnit, mezzUnit, stunUnit } from "./unit";
import { combat } from "./combat";
import { RangeType, unitsInRange } from "./range";

export const EffectTemplates : { [key:string]: (...any) => (gs : GameState, unit : Unit, targets : Unit[], params : any) => void } = {
    combat: (bonus : number, range : RangeType) => {
        return (gs : GameState, unit : Unit, targets : Unit[]) => {            
            if (!targets) { return }
            unit.atk += bonus;
            unit.endOfRound.atk += bonus;
            targets.forEach(t => {
                if (range) {
                    const units = unitsInRange(gs, t, range);
                    units.forEach(u => {
                        combat(gs, unit, u);
                    });
                } else {                    
                    combat(gs, unit, t);
                }
            });
        };
    },
    damage: (damage : number, range : RangeType) => {
        return (gs : GameState, unit : Unit, targets : Unit[]) => {            
            if (!targets) { return }
            targets.forEach(t => {
                if (range) {
                    const units = unitsInRange(gs, t, range);
                    units.forEach(u => {
                        damageUnit(gs, u, damage, false);               
                    });
                } else {
                    damageUnit(gs, t, damage, false);
                }
            });
        };
    },
    damageAttacker: (damage : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], params : { attacker : Unit }) => {
            if (!params || !params.attacker) { return }
            damageUnit(gs, params.attacker, damage, false);
        };
    },
    damageMover: (damage : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[], params : { mover : Unit }) => {
            if (!params || !params.mover) { return }
            damageUnit(gs, params.mover, damage, false);
        };
    },
    heal: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                healUnit(gs, t, value);
            });
        };
    },
    mezz: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                mezzUnit(gs, t, value);
            });
        };
    },
    stun: (value : number) => {
        return (gs : GameState, unit : Unit, targets : Unit[]) => {
            if (!targets) { return }
            targets.forEach(t => {
                stunUnit(gs, t, value);
            });
        };
    },
    temporaryEffect: (effect : TemporaryEffects, endOfTurn : boolean) => {
        function mergeEffects(current : TemporaryEffects, added : TemporaryEffects) : TemporaryEffects {
            return {
                atk: (current.atk || 0) + (added.atk || 0),
                damageShield: (current.damageShield || 0) + (added.damageShield || 0),
                dot: (current.dot || 0) + (added.dot || 0),
                hot: (current.hot || 0) + (added.hot || 0),
            }
        }
        return (gs : GameState, unit : Unit, targets : Unit[]) => {
            if (!targets || targets.length === 0) { return }                       
            targets.forEach(t => {                
                if (effect.atk) {
                    t.atk += effect.atk;
                }
                if (endOfTurn) {
                    t.endOfTurn = mergeEffects(t.endOfTurn, effect);
                } else {
                    t.endOfRound = mergeEffects(t.endOfRound, effect);
                }
            });            
        };
    },
}