<script>
    import { fly } from 'svelte/transition';

    import { State } from '../../../stores';
    import { DELAYS } from './config';
    import { TriggerType } from '../../../engine/battle/ability';
    
    export let unit;
    export let abilityPending;
    export let selected;

    $: unitAbilities = unit.abilities;

    $: selected = $State.ui.selectedUnit && $State.ui.selectedUnit.id === unit.id;

    function isDisabled(ability) {
        return unit.cc.mezz > 0
            || unit.cc.stun > 0;
    }

    $: dotTurnValue = unit.endOfTurn.hot - unit.endOfTurn.dot;
    $: dotRoundValue = unit.endOfRound.hot - unit.endOfRound.dot;

</script>

<style>
    .unit {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
    .unit-inner {
        padding: 10px;
        height: 90%;
    }
    .name {
        text-align: center;
        font-weight: bold;
        cursor: pointer;
    }
    .abilities {
        position: absolute;
        width: 100%;
        bottom: 35px;
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
        border: 1px solid #ccc;
        margin: -1px 0px 0px 0px;
        padding: 5px 10px;
    }
    .owned button:hover {
        cursor: pointer;
        background-color: #ddd;
    }
    .stats {
        position: absolute;
        width: 100%;
        bottom: 0px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .stats div {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100px;
        width: 25px;
        height: 25px;
        color: white;
        margin: 5px;
        font-size: 14px;
    }
    .atk {
        background-color: rgb(40, 72, 98);
    }
    .hp {
        background-color: rgb(117, 33, 7);
    }
    .armor {
        background-color: rgb(71, 71, 70);
    }
    .retaliate {
        background-color: rgb(233, 25, 70);
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

<div class="unit" style="
    background-color: {unit.exhausted ? '#ddd' : '#f9f9f9'};
    border-color: {selected ? 'blue' : '#ccc'};
    ">
    <div class="unit-inner" on:click={() => State.clickBoardUnit(unit)}>
        <div class="name">
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
    </div>
    <div class="abilities">
    {#each unitAbilities as ability (ability.name) }
        {#if ability.trigger.type === TriggerType.Activated && unit.owned}
            <div class='ability owned' title="{ability.text}">
                <button
                    on:click={() => State.activateAbility(unit, ability)}
                    style="font-weight: {abilityPending && ability.name === abilityPending.ability.name && unit.id === abilityPending.unit.id ? 'bold' : null}"
                    disabled="{isDisabled(ability)}">
                    {ability.name}
                </button>
            </div>
        {/if}
        {#if ability.trigger.type !== TriggerType.Activated || !unit.owned}
            <div class="ability-passive" title="{ability.text}">
                {ability.name}
            </div>
        {/if}
    {/each}
    </div>
    <div class="stats">
        <div class="atk">
            {unit.atk}
        </div>
        {#if unit.armor !== 0}
        <div class="armor">
            {unit.armor}
        </div>
        {/if}
        {#if unit.armor !== 0}
        <div class="retaliate">
            {unit.retaliate}
        </div>
        {/if}
        <div class="hp" title="{unit.hp}/{unit.hpMax}">
            {unit.hp}
        </div>
    </div>
</div>
