// https://developer.mozilla.org/en-US/docs/Tools/Performance/Scenarios/Intensive_JavaScript

self.addEventListener("message", go);

/**
 * 
 */
function go(message) {
    const imageData = message.data.imageData;
    const colorCounts = countPixels(imageData);

    self.postMessage({
        "command": "done",
        colorCounts
    });
}

/**
 * Counts the number of pixels per a unique color
 * https://stackoverflow.com/questions/19499500/canvas-getimagedata-for-optimal-performance-to-pull-out-all-data-or-one-at-a
 */
function countPixels(data) {   
    const colorCounts = {};
    for(let index = 0; index < data.length; index += 4) {
        const rgba = `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${(data[index + 3] / 255)})`;

        if (rgba in colorCounts) {
            colorCounts[rgba] += 1;
        } else {
            colorCounts[rgba] = 1;
        }
    }    
    return colorCounts;
}