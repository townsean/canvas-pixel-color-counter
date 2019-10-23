document.getElementById("image").addEventListener('change', (e) => {
    this.loadImage(e.target.files[0]);
}, false);

loadImage = (file) => {
    const url = window.URL.createObjectURL(file);
    const img = new Image();
    img.src = url;    
    img.onload = () => {
        const context = document.getElementById('canvas').getContext('2d');  
        context.drawImage(img, 0, 0);        
        
        img.style.display = 'none';
        window.URL.revokeObjectURL(this.src);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        console.log(imageData);
    }
  
};