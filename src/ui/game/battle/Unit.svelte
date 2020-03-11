<script>
    import { fly } from 'svelte/transition';

    import { State } from '../../../stores';
    import { DELAYS } from './config';
    import { TriggerType } from '../../../engine/battle/ability';
    import { REGION_COLUMNS } from '../../../engine/battle/board';
    
    export let unit;
    export let unitSize;
    export let pending;
    export let selected;
    
    let oldPositions = {};

    $: unitAbilities = unit.abilities;
    
    $: hpPercent = Math.floor(unit.hp / unit.hpMax * 100);

    function isDisabled(ability) {
        return unit.cc.mezz > 0
            || unit.cc.stun > 0;
    }

    $: dotTurnValue = unit.endOfTurn.hot - unit.endOfTurn.dot;
    $: dotRoundValue = unit.endOfRound.hot - unit.endOfRound.dot;

    $: left = ((unit.pos.region - 1) * REGION_COLUMNS + unit.pos.column) * (unitSize + 4) + unit.pos.region * 20;

</script>

<style>
    .unit {
        position: absolute;
        background-color: #f9f9f9;
        height: 300px;
        border: 1px solid #ccc;
        transition: left 750ms ease-in-out;
    }
    .name {
        text-align: center;
        font-weight: bold;
        margin: 10px 0px;
        cursor: pointer;
    }
    .ability {
        position: relative;
    }
    .ability-passive {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        padding: 10px 0px 0px 0px;
    }
    .ability button {
        width: 100%;
        border: none;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        transition: background 2000ms ease-in-out;
        margin: -1px 0px 0px 0px;
        padding: 10px;
    }
    .owned button:hover {
        cursor: pointer;
        font-weight: bold;
    }
    .stats {
        display: flex;
        padding-bottom: 20px;
        align-items: center;
        justify-content: center;
    }
    .atk {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        width: 25px;
        height: 25px;
        background-color: rgb(40, 72, 98);
        color: white;
        margin-right: 10px;
    }
    .atk div {
        padding-bottom: 2px;
    }
    .hp {
        height: 25px;
        width: 120px;
        border: 1px solid #ccc;
        position: relative;
    }
    .hpBar {
        position: absolute;
        height: 100%;
        background-color: rgb(243, 71, 71);
        text-align: center;
        font-weight: bold;
        transition: all 250ms ease-out;
    }
    .cc {
        position: absolute;
        top: 0px;
        right: 5px;
    }
    .alert {
        color: red;
    }
</style>

<div class="unit" style="left: {left}px;border-width: {selected ? '2px' : '1px'}">
    <div style="width: {unitSize}px">
        <div class="name" on:click={() => State.clickBoardUnit(unit)}>
            {unit.name}
        </div>
        {#if unit.cc.mezz > 0}
            <div class="cc">
                mezz {unit.cc.mezz}
            </div>
        {/if}
        {#if unit.cc.stun > 0}
            <div class="cc">
                stun {unit.cc.stun}
            </div>
        {/if}
        {#if dotTurnValue && dotTurnValue > 0}
            <div class="cc">
                +{dotTurnValue} HP
            </div>
        {/if}
        {#if dotTurnValue && dotTurnValue < 0}
            <div class="cc alert">
                {dotTurnValue} HP
            </div>
        {/if}
        <div class="stats">
            <div class="atk">
                <div>{unit.atk}</div>                
            </div>
            <div class="hp">
                <div class="hpBar" style="width: {hpPercent}%;transition-delay: {unit.owned ? DELAYS.HP : DELAYS.HP}ms">
                    {unit.hp}/{unit.hpMax}
                </div>
            </div>
        </div>
        <div class="abilities">
        {#each unitAbilities as ability (ability.name) }
            {#if ability.trigger.type === TriggerType.Activated}
                <div class='{unit.owned ? "ability owned": "ability"}' title="{ability.text}">
                    <button
                        on:click={() => State.activateAbility(unit, null, ability)}
                        style="font-weight: {pending && ability.name === pending.ability.name && unit.id === pending.unit.id ? 'bold' : null}"
                        disabled="{isDisabled(ability)}">
                        {ability.name}
                    </button>
                </div>
            {/if}
            {#if ability.trigger.type !== TriggerType.Activated}
                <div class="ability-passive" title="{ability.text}">
                    {ability.name}
                </div>
            {/if}
        {/each}
        </div>
    </div>    
</div>
