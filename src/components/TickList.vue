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
    data() {
        return {
            oldSelIndex: -1,
            itemStyles: [],
        };
    },
    watch: {
        items(newItems) {
            console.log('===> watch:items');
            const len = newItems.length;
            // console.log(len);
            this.itemStyles = [];
            for (let i = 0; i < len; ++i) {
                this.itemStyles.push({ color: 'black', fontStyle: 'normal' });
            }
        },
        selIndex(newIndex) {
            console.log('===> watch:selIndex');
            const stylesLen = this.itemStyles.length;

            if (this.oldSelIndex >= 0 && this.oldSelIndex < stylesLen) {
                this.itemStyles[this.oldSelIndex].color = 'black';
                this.itemStyles[this.oldSelIndex].fontStyle = 'normal';
            }
            if (newIndex >= 0 && newIndex < stylesLen) {
                this.itemStyles[newIndex].color = 'red';
                this.itemStyles[newIndex].fontStyle = 'italic';

                this.oldSelIndex = newIndex;
            }
        },
    },
    mounted() {
        console.log('@@@mounted');
    },
    beforeUpdate() {
        console.log('@@@beforeUpdate');
    },
    updated() {
        console.log('@@@updated');
    },
};
</script>
<template>
    <div class="tick-list">
        <ul>
            <li
                v-for="(item, index) in items"
                :key="index"
                :style="itemStyles[index]"
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
    }
    .tick-list > ul {
        list-style-type: none;
    }
    .tick-list li:hover {
        background: #e3f4bb;
        cursor: pointer;
    }
</style>
