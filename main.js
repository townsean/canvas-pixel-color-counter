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
        this.reset();

        const canvas = document.getElementById('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext('2d');  
        context.drawImage(img, 0, 0);        
        
        window.URL.revokeObjectURL(this.src);

        // count pixels per unique color
        const color_count = this.countPixels(img, context);

        // draw color swatches
        this.drawColorSwatch(color_count);

        let uploadContainer = document.getElementById('upload-container');        
        uploadContainer.appendChild(img);
    }  
};

/**
 * Counts the number of pixels per a unique color
 * TODO: Return a promise instead
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
};

/**
 * 
 */
drawColorSwatch = (colorCount) => {
    let colorSwatches = document.getElementById('color-swatches');

    for(const color in colorCount) {
        const container = document.createElement("section");
        const swatch = document.createElement("div");
        const colorCountLabel = document.createElement("span");

        container.classList.add("color-swatch-container");

        swatch.classList.add("color-swatch");
        swatch.style.background = color;
        swatch.title = color;

        colorCountLabel.classList.add("color-swatch-label");
        colorCountLabel.innerHTML = `: ${colorCount[color]}`;

        container.appendChild(swatch);
        container.appendChild(colorCountLabel);
        colorSwatches.appendChild(container);
    }
    
    let pixelCountContainer = document.getElementById('pixel-count-container');
    pixelCountContainer.classList.remove('invisible');
};

/**
 * Clear DOM of past color counting
 */
reset = () => {
    let colorSwatches = document.getElementById('color-swatches');
    while (colorSwatches.firstChild) {
        colorSwatches.removeChild(colorSwatches.firstChild);
    }
    
    let uploadContainer = document.getElementById('upload-container');
    let image = uploadContainer.getElementsByTagName('img')[0];  

    if (image) {
        uploadContainer.removeChild(image);
    }

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');  
    context.clearRect(0, 0, canvas.width, canvas.height);
}