<script>
export default {
    name: 'TickList',
    props: {
        items: {
            type: Array,
            default: null,
        },
        selIndex: {
            type: Number,
            default: -1,
        },
    },
    mounted() {
        // console.log(`mounted: ${this.selIndex}`);
    },
    beforeUpdate() {
        // console.log(`beforeUpdate: ${this.selIndex}`);
    },
    updated() {
        // console.log(`updated: ${this.selIndex}`);
        const elmt = this.$el.querySelector('.active');
        if (elmt) {
            elmt.scrollIntoView({ block: 'center', inline: 'center' });
        }
    },
    methods: {
        clickListItem(index) {
            this.$emit('select-ticklist-item', index);
        },
    },
};
</script>
<template>
    <div class="tick-list">
        <ul>
            <li
                v-for="(item, index) in items"
                :key="index"
                :class="{ 'active': index === selIndex }"
                @click="clickListItem(index)"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>
<style scoped>
    @import url("https://fonts.googleapis.com/css?family=Lato|Raleway");
    .tick-list {
        font-family: 'Lato', sans-serif;
        line-height: 2;
        overflow-y: auto;
    }
    .tick-list > ul {
        list-style-type: none;
        word-wrap: break-word;
    }
    .tick-list li.active {
        color: red;
        font-style: italic;
    }
    .tick-list li:hover {
        background: #e3f4bb;
        font-weight: bolder;
        text-shadow: 1px 1px 1px gray;
        cursor: pointer;
    }
</style>
