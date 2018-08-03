<script>
export default {
    name: 'TickList',
    props: {
        items: Array,
    },
}    
</script>
<template>
    <div>
        <ul>
            <li 
                v-for="(item, index) in items" 
                v-bind:key="index"
            >
                {{ item }}
            </li>
        </ul>
    </div>
</template>
<style scoped>

</style>
