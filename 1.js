class HeapSortVisualizer {
  constructor() {
    this.data = this.generateRandomArray(15);
    this.speed = 500;
    this.isSorting = false;
    this.sortedCount = 0;
    this.visualization = document.getElementById('visualization');
    this.renderHeap();

    document.getElementById('startBtn').addEventListener('click', () => this.startSorting());
    document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    document.getElementById('speedSlider').addEventListener('input', (e) => {
      this.speed = parseInt(e.target.value);
      document.getElementById('speedValue').textContent = `${this.speed}ms`;
    });
  }

  generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
  }

  renderHeap(highlightIndices = [], swapIndices = []) {
    this.visualization.innerHTML = '';
    const width = this.visualization.clientWidth;
    const height = this.visualization.clientHeight;
    const levels = Math.ceil(Math.log2(this.data.length + 1));
    const nodeRadius = 20;
    const levelHeight = height / levels;

    for (let i = 0; i < this.data.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const nodesInLevel = Math.pow(2, level);
      const posInLevel = i - (Math.pow(2, level) - 1);

      const x = (width / (nodesInLevel + 1)) * (posInLevel + 1);
      const y = levelHeight * (level + 0.5);

      const node = document.createElement('div');
      node.className = 'node';
      node.style.left = `${x - nodeRadius}px`;
      node.style.top = `${y - nodeRadius}px`;

      let bg = '#3498db'; // default
      if (highlightIndices.includes(i)) bg = '#e67e22';
      if (swapIndices.includes(i)) bg = '#f44336';
      if (this.isSorting && i >= this.data.length - this.sortedCount) bg = '#2ecc71';

      node.style.backgroundColor = bg;

      const value = document.createElement('div');
      value.textContent = this.data[i];
      node.appendChild(value);

      this.visualization.appendChild(node);

      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < this.data.length) this.drawLine(x, y, leftChild);
      if (rightChild < this.data.length) this.drawLine(x, y, rightChild);
    }
  }

  drawLine(parentX, parentY, childIdx) {
    const width = this.visualization.clientWidth;
    const height = this.visualization.clientHeight;
    const levels = Math.ceil(Math.log2(this.data.length + 1));
    const levelHeight = height / levels;

    const level = Math.floor(Math.log2(childIdx + 1));
    const nodesInLevel = Math.pow(2, level);
    const posInLevel = childIdx - (Math.pow(2, level) - 1);

    const x = (width / (nodesInLevel + 1)) * (posInLevel + 1);
    const y = levelHeight * (level + 0.5);

    const line = document.createElement('div');
    line.className = 'line';

    const length = Math.sqrt((x - parentX) ** 2 + (y - parentY) ** 2);
    const angle = Math.atan2(y - parentY, x - parentX) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.left = `${parentX}px`;
    line.style.top = `${parentY}px`;
    line.style.transform = `rotate(${angle}deg)`;

    this.visualization.appendChild(line);
  }

  async startSorting() {
    if (this.isSorting) return;
    this.isSorting = true;
    this.sortedCount = 0;
    await this.heapSort();
    this.isSorting = false;
    this.renderHeap();
  }

  async heapSort() {
    const n = this.data.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [this.data[0], this.data[i]] = [this.data[i], this.data[0]];
      this.sortedCount++;
      this.renderHeap([], [0, i]);
      await this.sleep(this.speed);
      await this.heapify(i, 0);
    }

    this.sortedCount = n;
  }

  async heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    this.renderHeap([i, left, right].filter(idx => idx < n));
    await this.sleep(this.speed);

    if (left < n && this.data[left] > this.data[largest]) largest = left;
    if (right < n && this.data[right] > this.data[largest]) largest = right;

    if (largest !== i) {
      [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
      this.renderHeap([], [i, largest]);
      await this.sleep(this.speed);
      await this.heapify(n, largest);
    }
  }

  reset() {
    if (this.isSorting) return;
    this.data = this.generateRandomArray(15);
    this.sortedCount = 0;
    this.renderHeap();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => new HeapSortVisualizer());
