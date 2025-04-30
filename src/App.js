import React, { useRef, useState, useEffect } from 'react';


const App = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });
  const [gridSpacing, setGridSpacing] = useState(8);
  const colorVarianceThreshold = 12;
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setFileName(file.name); // <-- Add this
  setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageSrc(event.target.result);
        setIsLoading(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const colorVariance = (pixels) => {
    let rTotal = 0, gTotal = 0, bTotal = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      rTotal += pixels[i];
      gTotal += pixels[i + 1];
      bTotal += pixels[i + 2];
    }
    const rAvg = rTotal / (pixels.length / 4);
    const gAvg = gTotal / (pixels.length / 4);
    const bAvg = bTotal / (pixels.length / 4);

    let variance = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const rDiff = pixels[i] - rAvg;
      const gDiff = pixels[i + 1] - gAvg;
      const bDiff = pixels[i + 2] - bAvg;
      variance += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
    }
    return Math.sqrt(variance / (pixels.length / 4));
  };

  const drawGrid = (ctx, width, height, imgCtx) => {
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    for (let x = 0; x < width; x += gridSpacing) {
      for (let y = 0; y < height; y += gridSpacing) {
        const imageData = imgCtx.getImageData(x, y, gridSpacing, gridSpacing);
        const variance = colorVariance(imageData.data);
        if (variance > colorVarianceThreshold) {
          ctx.fillStyle = 'rgba(234, 57, 248, 0.3)';
          ctx.fillRect(x, y, gridSpacing, gridSpacing);
        }
      }
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY / 500;
    const newScale = Math.min(Math.max(0.1, scale + delta), 10);
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartDragOffset({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setOffset({ x: e.clientX - startDragOffset.x, y: e.clientY - startDragOffset.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'pixel-grid-checker.png';
    link.href = canvas.toDataURL();
    link.click();
  };

useEffect(() => {
  if (!imageSrc || !canvasRef.current || !containerRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    // Match canvas size to container size
    canvas.width = containerRef.current.offsetWidth;
    canvas.height = containerRef.current.offsetHeight;

    // Clear before drawing
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply zoom and pan
    ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    ctx.drawImage(img, 0, 0);

    // Create offscreen canvas to read image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    // Draw grid at correct scale
    drawGrid(ctx, img.width, img.height, tempCtx);

    ctx.restore();
  };

  img.src = imageSrc;
}, [imageSrc, scale, offset, gridSpacing]);












  return (
    <div className="container py-4">
<img
              src="/assets/pixel_amazing_logo.svg"
              alt="Logo"
              style={{ width: '25px', fill: '#9589FF', opacity: 1.0 }}
            />






<div className="button-container">





      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="form-control mb-3"
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
  <div className="d-flex justify-content-between align-items-center mb-3">
        <div style={{ color: '#f8f8f8' }}>{fileName}</div>
        <div className="d-flex align-items-center">
          <span className="me-2">Grid Spacing:</span>
          <div className="btn-group me-3" role="group">


 <button
              type="button"
              className={`btn ${gridSpacing === 4 ? 'active' : ''}`}
              onClick={() => setGridSpacing(4)}
            >
              4px
            </button>




            <button
              type="button"
              className={`btn ${gridSpacing === 8 ? 'active' : ''}`}
              onClick={() => setGridSpacing(8)}
            >
              8px
            </button>
            <button
              type="button"
              className={`btn ${gridSpacing === 10 ? 'active' : ''}`}
              onClick={() => setGridSpacing(10)}
            >
              10px
            </button>
          </div>
          <button className="btn btn-outline-secondary me-2" onClick={handleDownload}
  disabled={!imageSrc}>Download Image</button>
          <button className="btn btn-primary" onClick={() => fileInputRef.current.click()}>
            Upload Image
          </button>
        </div>
      </div>


</div>





    <div
  ref={containerRef}
  className={`image-preview-container overflow-hidden ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
  style={{ height: '80vh', width: '100%', maxWidth: '1920px', maxHeight: '1080px', margin: '0 auto' }}
  onWheel={handleWheel}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
>
        {isLoading ? (
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : imageSrc ? (
          <canvas ref={canvasRef} />
        ) : (
          <div className="position-absolute top-50 start-50 translate-middle text-center text-muted fade-in">
            <img
              src="/assets/empty_icon.png"
              alt="Empty State"
              style={{ width: '112px', opacity: 1.0 }}
            />
            <p className="mt-3 empty-text">Upload an image to get started!</p>
<p className="mt-3 empty-text-body">Once your image is uploaded you can start to review your pixels</p>
                    </div>
        )}
      </div>
    </div>
  );
};

export default App;