import { TriggerType, TargetType } from "../engine/battle/ability";
import { TargetEligibilityTemplates } from "../engine/battle/targets";
import { ConditionTemplates } from "../engine/battle/conditions";

// Trigerrs
//-------------------------------------------------
export const ACT = {
    type: TriggerType.Activated,
};

export const BEFORE_DAMAGE = {
    type: TriggerType.BeforeDamage,
};

export const BEFORE_DAMAGE_ME = {
    type: TriggerType.BeforeDamage,
    condition: ConditionTemplates.damageOnMe(),
};

export const BEFORE_ENEMY_MOVE = {
    type: TriggerType.BeforeMove,
    condition: ConditionTemplates.ennemyMove(),
};

export const AFTER_ATTACKED_ME = {
    type: TriggerType.AfterCombat,
    condition: ConditionTemplates.attackOnMe(),
};

export const AFTER_DEATH_OF_ME = {
    type: TriggerType.AfterDeath,
    condition: ConditionTemplates.deathOfMe(),
};

// Targets
//-------------------------------------------------

export const MYSELF = {
    type: TargetType.Self,
};

export function FOE(n) {
    return {
        type: TargetType.Foe,
        count: n,
    };    
};

export function ALLY(n) {
    return {
        type: TargetType.Ally,
        count: n,
    };    
};

export function ANY(n) {
    return {
        type: TargetType.Any,
        count: n,
    };    
};

export const MELEE = {
    type: TargetType.Foe,
    count: 1,
    eligible: TargetEligibilityTemplates.melee(),
};