import { Unit } from "../engine/battle/unit";
import { DataAbilities } from "./abilities";

export const DataUnits : { [key:string]:Unit } = {   
    Bob: {
        name: "Bob",
        cost: 1,
        hpMax: 35,
        atk: 5,
        abilities: [DataAbilities.aimedShot],
        retaliate: 2,
        armor: 1,
    },
}