export interface Tower {
    destroyed: boolean,
    hp: number,
    gold: number,
    goldMax: number,
}

export const TOWER_HP = [40, 80];
export const TOWER_GOLD_INIT = 2;