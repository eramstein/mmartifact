<script>
    import { fly } from 'svelte/transition';

    import { State } from '../../../stores';
    import { DELAYS } from './config';
    import Unit from './Unit.svelte';
    import HandUnit from './HandUnit.svelte';
    
    $: battle = $State.game.battle;
    $: pending = $State.ui.abilityPending;
    $: selectedTargets = $State.ui.selectedTargets;
    $: {
        //console.log("NEW STATE", $State.game);
    }
    
    let unitSize = 200;

</script>

<style>
    .battle {
        display: flex;
        width: 100%;
    }
    .board {
        padding-left: 50px;
        width: 100%;
    }
    .board-row {
        position: relative;
        height: 300px;
        margin-bottom: 4px;
    }
    .hand-row {
        display: flex;
        padding: 20px 0px;
    }
</style>

<div class="battle">    
    <div class="board">
        <div>Turn {battle.turn} Round {battle.round} {battle.playersRound ? 'Players Round' : ''}</div>
        <div class="hand-row">
            {#each battle.foe.hand as unit (unit.id) }
            <HandUnit unit={unit}>
            </HandUnit>
            {/each}
        </div>
        <div class="board-row">
            {#each battle.foe.board as unit (unit.id) }
            <div out:fly="{{ duration: 400, delay: DELAYS.FOE_OUT, y: -100 }}" in:fly="{{ duration: 400, delay: DELAYS.FOE_IN, y: - 100 }}">
                <Unit unit={unit} unitSize={unitSize} pending="" selected="{selectedTargets.map(u => u.id).indexOf(unit.id)>=0}">
                </Unit>
            </div>
            {/each}
        </div>
        <div class="board-row">
            {#each battle.player.board as unit (unit.id) }
            <div out:fly="{{ duration: 400, delay: DELAYS.MY_OUT, y: 100 }}" in:fly="{{ duration: 400, delay: DELAYS.MY_IN, y: 100 }}">
                <Unit unit={unit} unitSize={unitSize} pending={pending} selected="{selectedTargets.map(u => u.id).indexOf(unit.id)>=0}">
                </Unit>
            </div>
            {/each}
        </div>
        <div class="hand-row">
            {#each battle.player.hand as unit (unit.id) }
            <HandUnit unit={unit}>
            </HandUnit>
            {/each}
        </div>
    </div>
</div>

