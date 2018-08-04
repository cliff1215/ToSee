<script>
import base64FromUint8Array from './libraries/lib.js';
import imageType from 'image-type';
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
            return itemName[itemName.length - 1] === '/'
                || itemName.includes('__MACOSX') 
                || itemName.includes('/.'); 
        },
        isImageType(itemName) {
            const exts = ['.png', '.jpg', '.gif'];

            itemName = itemName.toLowerCase();
            for (let ext of exts) {
                if (itemName.includes(ext)) return true;
            }
            return false;
        },
        loadZipFile(evt) {
            this.initData();

            let file = evt.target.files[0];
            JSZip.loadAsync(file, {createFolders: false}).then((zip) => {
                zip.forEach((relativePath, zipEntry) => {
                    if (!this.isExcludedItem(zipEntry.name) 
                        && this.isImageType(zipEntry.name)) {
                        this.zipEntries.push(zipEntry.name);
                    }
                });
                if (this.zipEntries.length > 0) {
                    this.zipObject = zip;
                    this.currentIndex = 0;
                    this.showImage();
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
                    let imgInfo = imageType(data);
                    console.log(imgInfo)
                    if (imgInfo === null) return;
                    //this.imgSource = "data:image/jpg;base64," 
                    this.imgSource = "data:" + imgInfo.mime + ";base64," 
                        + base64FromUint8Array(data);
                })
        },
        showPrevNextImage(delta) {
            let temp = this.currentIndex + delta;
            if (temp < 0 || temp >= this.zipEntries.length) return;

            this.currentIndex = temp;
            this.showImage();
        }
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
            v-on:click="showPrevNextImage(-1)"
        >
            prev Image
        </button>
        <button 
            v-on:click="showPrevNextImage(+1)"
        >
            next image
        </button>
        <hr />
        <div class="content">
            <entry-list v-bind:items="zipEntries"></entry-list>
            <div class="img-container">
                <img v-bind:src="imgSource" />
            </div>
        </div>
    </div>
</template>

<style>
.content {
    display: grid;
    grid-template-columns: 30% auto;
    grid-auto-rows: minmax(300px, auto);
}
.img-container {
    background: black;
    border: solid 1px black;
}
.img-container > img {
    width: 100%;
    height: 100%; 
    object-fit: contain;
}
</style>
