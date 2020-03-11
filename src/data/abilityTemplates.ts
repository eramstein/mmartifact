import { TriggerType, TargetType, Ability, Target, Trigger } from "../engine/battle/ability";
import { EffectTemplates as ET } from "../engine/battle/effects";
import { TargetEligibilityTemplates as TGT } from "../engine/battle/targets";
import { ConditionTemplates as CT } from "../engine/battle/conditions";
import { ACT, FOE, MELEE, ANY, ALLY, BEFORE_DAMAGE, BEFORE_DAMAGE_ME, MYSELF, AFTER_ATTACKED_ME, AFTER_DEATH_OF_ME } from "./shortcuts";
import { Unit } from "../engine/battle/unit";

export interface AbilityParams { 
    name : string,
    cost?: number,
    target?: Target,
    trigger?: Trigger,
    fast?: boolean,
    exhausts?: boolean,
}

export const DataAbilityTemplates : { [key:string]:(AbilityParams, ...any) => Ability } = {
    rangeAttack: (p, { bonus, range }) => {        
        return {            
            text: "PING +" + bonus,
            trigger: ACT,
            target: FOE(1),
            effect: ET.combat(bonus, range),
            ...p,
        };
    },
}