import fs from 'fs';
import zlib from 'zlib';

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function generateIcon(size) {
  // RGBA buffer
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const palette = [
    [0x16, 0x1B, 0x22, 255], // Level 0
    [0x4A, 0x21, 0x0F, 255], // Level 1
    [0x8C, 0x3B, 0x0D, 255], // Level 2
    [0xD9, 0x6B, 0x16, 255], // Level 3
    [0xFF, 0x9A, 0x3C, 255]  // Level 4
  ];

  // Pattern of 4x4 squares representing contribution grid with pumpkin levels
  const gridLevels = [
    [0, 1, 3, 2],
    [1, 4, 4, 3],
    [3, 4, 2, 4],
    [2, 3, 4, 1]
  ];

  const pad = Math.max(1, Math.floor(size * 0.08));
  const available = size - pad * 2;
  const cellSize = Math.floor(available / 4);
  const gap = Math.max(1, Math.floor(cellSize * 0.2));
  const boxSize = cellSize - gap;

  for (let y = 0; y < size; y++) {
    const lineOffset = y * (size * 4 + 1);
    raw[lineOffset] = 0; // Filter: none
    for (let x = 0; x < size; x++) {
      const pxOffset = lineOffset + 1 + x * 4;
      
      // Background (subtle dark rounded container)
      let r = 13, g = 17, b = 23, a = 255;
      
      // Determine if inside grid
      const gx = Math.floor((x - pad) / cellSize);
      const gy = Math.floor((y - pad) / cellSize);
      const inGrid = gx >= 0 && gx < 4 && gy >= 0 && gy < 4;
      
      if (inGrid) {
        const lx = (x - pad) % cellSize;
        const ly = (y - pad) % cellSize;
        if (lx < boxSize && ly < boxSize) {
          const level = gridLevels[gy][gx];
          const col = palette[level];
          r = col[0];
          g = col[1];
          b = col[2];
          a = col[3];
        }
      }

      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // 8 bits
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', zlib.deflateSync(raw));
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

for (const s of [16, 48, 128]) {
  fs.writeFileSync(`icons/icon${s}.png`, generateIcon(s));
  console.log(`Generated icon${s}.png (${s}x${s})`);
}
