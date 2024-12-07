const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const imageName = document.getElementById('imageName');
const imagePreview = document.getElementById('imagePreview');
const kerryCode = document.getElementById('kerryCode');
const runCode = document.getElementById('runCode');
const codeOutput = document.getElementById('codeOutput');
const successMessage = document.getElementById('successMessage');

let storedImages = JSON.parse(localStorage.getItem('karrotImages')) || {};

// Display images from localStorage
function displayImages() {
  imagePreview.innerHTML = '';
  for (const [name, src] of Object.entries(storedImages)) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.id = name;
    img.classList.add('image-item');
    imagePreview.appendChild(img);
  }
}

// Upload and store image
uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = imageUpload.files[0];
  const name = imageName.value.trim();

  if (!file || !name) {
    alert('Please upload an image and provide a name.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    storedImages[name] = reader.result; // Store image as Base64
    localStorage.setItem('karrotImages', JSON.stringify(storedImages));
    displayImages();
    uploadForm.reset();
    successMessage.textContent = 'Done! Image uploaded successfully.';
  };
  reader.readAsDataURL(file);
});

// Parse and execute Kerry code
runCode.addEventListener('click', () => {
  const code = kerryCode.value.trim();
  if (!code) {
    alert('Please write some Kerry code.');
    return;
  }

  const lines = code.split('\n');
  let validCode = false; // Track if valid commands exist

  for (const line of lines) {
    if (line.includes('behavior:make-image-corner')) {
      const match = line.match(/\.(\w+)\sbehavior:make-image-corner\ncorn:(left|right)/);
      if (match) {
        const [_, imageName, corner] = match;
        const img = document.getElementById(imageName);
        if (img) {
          img.className = corner === 'left' ? 'corner-left' : 'corner-right';
          validCode = true;
        }
      }
    } else if (line.includes('func:if-click-image-what-hap')) {
      const match = line.match(/\.(\w+)\sfunc:if-click-image-what-hap\nhap:(.+)/);
      if (match) {
        const [_, imageName, htmlCode] = match;
        const img = document.getElementById(imageName);
        if (img) {
          img.addEventListener('click', () => {
            codeOutput.innerHTML = htmlCode.trim();
          });
          validCode = true;
        }
      }
    }
  }

  if (!validCode) {
    codeOutput.innerHTML = '<span style="color: red;">Invalid Code!</span>';
  }
});

// Initial display of images
displayImages();
