/**
 * @param  {Uint8Array} bytes
 * @return {string} - return base64 string
 */
/* eslint-disable no-multi-spaces */
export function base64FromUint8Array(bytes) {
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const { byteLength } = bytes;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    // eslint-disable-next-line one-var, one-var-declaration-per-line
    let a, b, c, d, chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
        d =  chunk & 63;              // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4; // 3   = 2^2 - 1

        // base64 += encodings[a] + encodings[b] + '==';
        base64 += `${encodings[a]}${encodings[b]}==`;
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

        base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
    }
    return base64;
}
/* eslint-enable */

/**
 * @param {any[]} anyArray - any type of array, should not null
 * @param {number} index - index number
 * @return {boolean} - return true if index is between >= 0 && < array.length
 */
export function isValidIndex(anyArray, index) {
    return index >= 0 && index < anyArray.length;
}
