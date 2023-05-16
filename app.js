async function convertToWebp(file, quality = 0.8) {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = document.getElementById('img-width').valueAsNumber; // Set desired width
  canvas.height = document.getElementById('img-height').valueAsNumber; // Set desired height
  const context = canvas.getContext("2d");

  // Draw image on canvas with specified dimensions
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Convert canvas to data URL with WebP format and specified quality
  const webpDataUrl = canvas.toDataURL("image/webp", quality);

  // Convert data URL to blob
  const webpBlob = await fetch(webpDataUrl).then((res) => res.blob());

  return webpBlob;
}


const convertButton = document.getElementById("convert-button");
convertButton.addEventListener("click", async () => {
  const fileInput = document.getElementById("img-file-input");
  const file = fileInput.files[0];
  const urlInput = document.getElementById("img-url-input");
  const url = urlInput.value;

  // Need to upload a file or provide a URL
  if(!file && !url) {
    return alert('Select a file or provide a URL please!');
  }

  let webpBlob;

  if (file) {
    webpBlob = await convertToWebp(file);
  } else {
    const response = await fetch(url);
    const blob = await response.blob();
    webpBlob = await convertToWebp(blob);
  }

  createDownloadButton(webpBlob); 
})


function createDownloadButton(webpBlob) {
  const downloadButton = document.getElementById("download-converted-img-btn");

  downloadButton.href = URL.createObjectURL(webpBlob);
  downloadButton.style.display = "inline-block"; // Show download button after conversion
}
