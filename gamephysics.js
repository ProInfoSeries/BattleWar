class PixelTerrainEngine {
  constructor(canvasId) {
    this.mainCanvas = document.getElementById(canvasId);
    this.mainCtx = this.mainCanvas.getContext('2d');

    this.terrainCanvas = document.createElement('canvas');
    this.terrainCanvas.width = this.mainCanvas.width;
    this.terrainCanvas.height = this.mainCanvas.height;
    this.terrainCtx = this.terrainCanvas.getContext('2d');

    this.assets = [];
    this.generateOffscreenTerrain();
  }

  generateOffscreenTerrain() {
    const ctx = this.terrainCtx;
    const width = this.terrainCanvas.width;
    const height = this.terrainCanvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#3d2817';
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x++) {
      let terrainY = 380 + Math.sin(x * 0.008) * 50 + Math.sin(x * 0.02) * 20;
      ctx.lineTo(x, terrainY);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#4e782e';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  explode(x, y, radius) {
    const ctx = this.terrainCtx;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderEntities() {
    this.assets.forEach(asset => {
      this.mainCtx.fillStyle = asset.color || '#ff0000';
      this.mainCtx.fillRect(asset.x - 10, asset.y - 10, 20, 20);
    });
  }

  render() {
    this.mainCtx.fillStyle = '#121824';
    this.mainCtx.fillRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

    this.mainCtx.drawImage(this.terrainCanvas, 0, 0);

    this.renderEntities();
  }

  isSolidPixel(x, y) {
    if (x < 0 || x >= this.terrainCanvas.width || y < 0 || y >= this.terrainCanvas.height) {
      return false;
    }

    const pixel = this.terrainCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    return pixel[3] > 0;
  }

  updateAssetGravity(asset) {
    if (!this.isSolidPixel(asset.x, asset.y)) {
      asset.y += 2;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const engine = new PixelTerrainEngine('game-canvas');
  
  function loop() {
    engine.render();
    requestAnimationFrame(loop);
  }
  
  loop();
});
