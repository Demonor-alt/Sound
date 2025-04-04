class WAVStreamPlayer {
    constructor() {
      this.audioElement = new Audio();
      this.chunks = [];
      this.headerReceived = false;
      this.dataSize = 0;
      this.totalSize = 0;
    }
  
    async startStream(url) {
      const response = await fetch(url);
      const reader = response.body.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        await this.processChunk(value.buffer);
      }
      
      this.finalizeWAV();
    }
  
    async processChunk(arrayBuffer) {
      if (!this.headerReceived) {
        // 解析WAV头
        const header = new DataView(arrayBuffer.slice(0, 44));
        this.dataSize = header.getUint32(40, true);
        this.totalSize = this.dataSize + 44;
        this.headerReceived = true;
        
        // 初始化播放
        this.chunks.push(arrayBuffer);
        this.updateAudioSource();
      } else {
        // 追加数据块
        this.dataSize += arrayBuffer.byteLength;
        this.chunks.push(arrayBuffer);
        
        // 动态更新播放
        if (this.audioElement.paused) {
          this.updateAudioSource();
        }
      }
    }
  
    updateAudioSource() {
      const blob = new Blob(this.chunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      if (!this.audioElement.src) {
        this.audioElement.src = url;
        this.audioElement.play();
      } else {
        // 实现无缝续播
        const newAudio = new Audio(url);
        newAudio.oncanplay = () => {
          newAudio.currentTime = this.audioElement.currentTime;
          this.audioElement.replaceWith(newAudio);
          this.audioElement = newAudio;
          newAudio.play();
        };
      }
    }
  
    finalizeWAV() {
      // 修正WAV头中的文件长度
      const finalBuffer = new ArrayBuffer(this.totalSize);
      const view = new DataView(finalBuffer);
      
      // 合并所有块
      let offset = 0;
      this.chunks.forEach(chunk => {
        new Uint8Array(finalBuffer).set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      });
      
      // 更新RIFF头
      view.setUint32(4, this.totalSize - 8, true); // 设置总文件大小
      view.setUint32(40, this.dataSize, true);    // 设置数据块大小
      
      // 生成最终文件
      const finalBlob = new Blob([finalBuffer], { type: 'audio/wav' });
      this.chunks = [finalBuffer];
      this.updateAudioSource();
    }
  }
  
  // 使用示例
  const player = new WAVStreamPlayer();
  player.startStream('http://api.example.com/stream-wav');