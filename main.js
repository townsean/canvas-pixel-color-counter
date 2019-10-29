// To avoid Uncaught DOMException while using Web Workers
// Run python -m http.server 8000
// https://stackoverflow.com/questions/8170431/using-web-workers-for-drawing-using-native-canvas-functions
const worker = new Worker('./counter.js');

handleWorkerCompletion = (message) => {
    if(message.data.command == "done") {
        // draw color swatches
        this.drawColorSwatch(message.data.colorCounts);
        worker.removeEventListener("message", handleWorkerCompletion);
                
        // hide wait indicator
        const waitIndicator = document.getElementById("wait-indicator");
        waitIndicator.classList.add("invisible");
        waitIndicator.classList.remove("fadein");

        // scroll to color swatch section
        const pixelCountContainer = document.getElementById('pixel-count-container'); 
        pixelCountContainer.scrollIntoView({ behavior: 'smooth'});

        const colorCountLabel = document.getElementById('color-count');
        colorCountLabel.innerText = Object.keys(message.data.colorCounts).length;
    }
};

/**
 * Event listener for when the file upload has been updated
 */
document.getElementById("image").addEventListener('change', (e) => {
    this.loadImage(e.target.files[0]);
}, false);

/**
 * Given a valid image file, load the image into the canvas
 * Good explantation the the image data: https://css-tricks.com/manipulating-pixels-using-canvas/#article-header-id-1
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
                
        const uploadContainer = document.getElementById('upload-container');        
        uploadContainer.appendChild(img);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        window.URL.revokeObjectURL(this.src);
        worker.addEventListener("message", handleWorkerCompletion, false);
        worker.postMessage({
            "imageData": imageData.data
        });
        
        const waitIndicator = document.getElementById("wait-indicator");
        waitIndicator.classList.remove("invisible");
        waitIndicator.classList.add("fadein");
    }  
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
    let pixelCountContainer = document.getElementById('pixel-count-container');
    pixelCountContainer.classList.add('invisible');

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