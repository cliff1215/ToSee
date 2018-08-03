<script>
import { base64FromUint8Array } from './libraries/lib.js';
import JSZip from 'jszip';
import TickList from './components/TickList.vue';

export default {
    name: 'app',
    components: {
        'entry-list': TickList,
    },
    data () {
        return {
            zipObject: null,
            zipEntries: [],
            imgSource: '',
            currentIndex: -1,
        }
    },
    methods: {
        initData() {
            this.imgSource = ''; 
            this.currentIndex = -1;
            this.zipObject = null;
            this.zipEntries = [];
        },
        isExcludedItem(itemName) {
            return itemName.includes('__MACOSX') || itemName.includes('/.'); 
        },
        loadZipFile(evt) {
            this.initData();

            let file = evt.target.files[0];
            JSZip.loadAsync(file).then((zip) => {
                zip.forEach((relativePath, zipEntry) => {
                    if (!this.isExcludedItem(zipEntry.name)) {
                        this.zipEntries.push(zipEntry.name);
                    }
                });
                if (this.zipEntries.length > 0) {
                    this.zipObject = zip;
                    this.currentIndex = 0;
                }
            })
        },
        showImage() {
            if (this.zipObject === null
                || this.currentIndex < 0 
                || this.currentIndex >= this.zipEntries.length) return;

            this.zipObject
                .file(this.zipEntries[this.currentIndex])
                .async('uint8array')
                .then((data) => {
                    this.imgSource = "data:image/jpg;base64," 
                        + base64FromUint8Array(data);
                })
        },
    }
}
</script>

<template>
    <div id="app">
        <h3>Choose the local(s) zip file(s)</h3>
        <input 
            type="file" 
            id="file" 
            name="file" 
            v-on:change="loadZipFile" 
        />
        <hr />
        <button 
            v-on:click="showImage"
        >
            Show Image
        </button>
        <br />
        <div class="content">
            <entry-list v-bind:items="zipEntries"></entry-list>
            <img v-bind:src="imgSource" />
        </div>
    </div>
</template>

<style>
</style>
