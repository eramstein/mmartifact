import { Ability, TriggerType, TargetType } from "../engine/battle/ability";
import { EffectTemplates as ET } from "../engine/battle/effects";
import { DataAbilityTemplates as AT } from "./abilityTemplates";
import { FOE, ACT, MYSELF, BEFORE_ENEMY_MOVE } from "./shortcuts";
import { RangeType } from "../engine/battle/range";

export const DataAbilities : { [key:string]:Ability } = {
    aimedShot: AT.rangeAttack({ name: 'Aimed Shot' }, { bonus: 2, range: null }),
}
