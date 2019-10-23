/**
 * Event listener for when the file upload has been updated
 */
document.getElementById("image").addEventListener('change', (e) => {
    this.loadImage(e.target.files[0]);
}, false);

/**
 * Given a valid image file, load the image into the canvas
 */
loadImage = (file) => {
    const url = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = url;    
    img.onload = () => {
        const context = document.getElementById('canvas').getContext('2d');  
        context.drawImage(img, 0, 0);        
        
        img.style.display = 'none';
        window.URL.revokeObjectURL(this.src);

        // count pixels per unique color
        const color_count = this.countPixels(img, context);
        
        console.log(color_count);
    }  
};

/**
 * Counts the number of pixels per a unique color
 */
countPixels = (image, context) => {
    const color_count = {};
    for(let x = 0; x < image.width; x++) {
        for(let y = 0; y < image.height; y++) {
            const pixel = context.getImageData(x, y, 1, 1);
            const data = pixel.data;
            const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3] / 255)})`;

            if (rgba in color_count) {
                color_count[rgba] += 1;
            } else {
                color_count[rgba] = 1;
            }
        }
    }

    return color_count;
}