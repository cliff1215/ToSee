<script>
import JSZip from 'jszip';
import imageType from 'image-type';
import { base64FromUint8Array, isValidIndex } from './libraries/lib';
import TickList from './components/TickList.vue';

export default {
    // eslint-disable-next-line vue/name-property-casing
    name: 'app',
    components: {
        'entry-list': TickList,
    },
    data() {
        return {
            zipObject: null,
            zipEntries: [],
            imgSource: require('./assets/Impossible-is-nothing-adidas.jpg'),
            currentIndex: -1,
        };
    },
    mounted() {
        this.$nextTick(function () {
            window.addEventListener('resize', this.windowResized);
            // initial resize
            this.windowResized();
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.windowResized);
    },
    methods: {
        initData() {
            this.imgSource = '';
            this.currentIndex = -1;
            this.zipObject = null;
            this.zipEntries = [];
        },
        /**
         * @param {string} itemName - zip entry name in a zip file
         * @return {boolean} - return true if itemName is a folder
         *                      or contains '__MACOSX' or is a hidden file
         */
        isExcludedItem(itemName) {
            return itemName[itemName.length - 1] === '/'
                || itemName.includes('__MACOSX')
                || itemName.includes('/.');
        },
        /**
         * @param {string} itemName - zip entry name in a zip file
         * @return {boolean} - return true if itemName's file extension
         *                      contains '.png', '.jpg', and '.gif'
         */
        isImageType(itemName) {
            const exts = ['.png', '.jpg', '.gif'];

            const lowcaseName = itemName.toLowerCase();
            let ext = '';
            for (ext of exts) {
                if (lowcaseName.includes(ext)) return true;
            }
            return false;
        },
        loadZipFile(evt) {
            this.initData();

            const file = evt.target.files[0];
            JSZip.loadAsync(file).then((zip) => {
                zip.forEach((relativePath, zipEntry) => {
                    if (!this.isExcludedItem(zipEntry.name)
                        && this.isImageType(zipEntry.name)) {
                        this.zipEntries.push(zipEntry.name);
                    }
                });
                if (this.zipEntries.length > 0) {
                    this.zipEntries.sort();
                    this.zipObject = zip;
                    this.currentIndex = 0;
                    this.showImage();
                }
            });
        },
        windowResized() {
            // const width = document.documentElement.clientWidth;
            let height = document.documentElement.clientHeight - 200;
            if (height < 300) height = 300;
            // console.log(`Height: ${height}`);

            // const elements = document.getElementsByClassName('content');
            const elmt = this.$el.querySelector('.content');
            // console.log(elmt);
            elmt.style.gridTemplateRows = `${height}px`;
            // elements[0].style.gridTemplateRows = `${height}px`;
        },
        showImage() {
            if (this.zipObject === null
                || this.currentIndex < 0
                || this.currentIndex >= this.zipEntries.length) return;

            this.zipObject
                .file(this.zipEntries[this.currentIndex])
                .async('uint8array')
                .then((data) => {
                    const imgInfo = imageType(data);
                    if (imgInfo === null) return;
                    // this.imgSource = "data:image/jpg;base64,"
                    this.imgSource = `data:${imgInfo.mime};base64,${base64FromUint8Array(data)}`;
                });
        },
        /**
         * Showing the next or previous image
         * @param {number} delta - +1 or -1 means next or prev
         */
        showPrevNextImage(delta) {
            const temp = this.currentIndex + delta;
            if (temp < 0 || temp >= this.zipEntries.length) return;

            this.currentIndex = temp;
            this.showImage();
        },
        /**
         * Event handler for the list item selected by user
         * @param {number} selectedIndex - the list item index selected by user
         */
        onSelectListItem(selectedIndex) {
            if (isValidIndex(this.zipEntries, selectedIndex)) {
                this.currentIndex = selectedIndex;
                this.showImage();
            }
        },
        onWheelHandler(evt) {
            // console.log(evt.deltaY);
            this.showPrevNextImage(evt.deltaY > 0 ? 1 : -1);
        },
    },
};
</script>

<template>
    <div id="app">
        <h3>Choose the local(s) zip file(s)</h3>
        <input
            id="file"
            type="file"
            name="file"
            @change="loadZipFile"
        >
        <hr>
        <button
            @click="showPrevNextImage(-1)"
        >
            prev Image
        </button>
        <button
            @click="showPrevNextImage(+1)"
        >
            next image
        </button>
        <hr>
        <div class="content">
            <entry-list
                :items="zipEntries"
                :sel-index="currentIndex"
                @select-ticklist-item="onSelectListItem"
            />
            <div class="img-container">
                <img
                    :src="imgSource"
                    @wheel="onWheelHandler" >
            </div>
        </div>
    </div>
</template>

<style>
.content {
    display: grid;
    grid-template-columns: 20% auto;
    grid-column-gap: 5px;
    /* grid-auto-rows: minmax(300px, auto); */
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
