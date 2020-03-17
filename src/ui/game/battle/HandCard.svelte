<script>
    import { State } from '../../../stores';
    import { DataUnits } from '../../../data/units';
    
    export let index;
    export let card;
    export let isPlayer;

    $: selected = isPlayer && $State.ui.selectedHandCard && $State.ui.selectedHandCard.index === index;

</script>

<style>
    .hand-card {
        background-color: rgb(83, 83, 83);
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 6px;
        color: white;
        padding: 2px 20px;
        margin-right: 5px;
    }
</style>

<div class="hand-card"
    draggable="true"
    on:dragstart={() => State.clickHandCard(card, index, isPlayer)}
    style="border-color: {selected ? 'blue' : '#ccc'};"
    on:click={() => State.clickHandCard(card, index, isPlayer)}
>
     {DataUnits[card.name].cost} - {card.name}
</div>
