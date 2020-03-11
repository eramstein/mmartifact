import { Unit } from "../engine/battle/unit";
import { DataAbilities } from "./abilities";

export const DataUnits : { [key:string]:Unit } = {   
    Bob: {
        name: "Bob",
        hpMax: 35,
        atk: 2,
        abilities: [DataAbilities.aimedShot],            
    },
}