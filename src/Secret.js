import BitArray from './BitArray';

const Cipher = [
  21, 35, 46,  4, 13, 63, 26, 16,
  58, 47, 30, 32, 15, 62, 54, 55,
  9,  41, 59, 49,  2, 22, 61, 56,
  40, 19, 52, 50,  1, 11, 10, 53,
  14, 27, 18, 44, 33, 45, 37, 48,
  25, 42,  6, 57, 60, 23, 51, 24,
];

export function decodeBytes(data) {
  var cipherKey = (data[0] >> 3);
  var cipherPosition = (cipherKey * 4);

  var secret = new Array(data.length);
  for (var i = 0; i < data.length; i++) {
    secret[i] = (data[i] ^ Cipher[cipherPosition++]);
  }

  secret[0] = (secret[0] & 7 | (cipherKey << 3));
  return secret;
}

export function calculateCipher(GameID) {
  return ((GameID >> 8) + (GameID & 255)) & 7
}

export function calculateChecksum(data, ignore) {
  return data.reduce((l,r,i) => i !== ignore ? l + r : l, 0) & 0xF;
}

export function byteToBinaryArray(data) {
  let bitArray = new BitArray(data.length * 6);
  let b = 0;
  for (var i=0;i<data.length;i++) {
    bitArray.setBeNumber(i * 6, data[i], 6);
  }
  return bitArray;
}

export function binaryToByteArray(bitArray) {
  let length = bitArray.length / 6;
  let arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = bitArray.readBe(i * 6, 6);
  }
  return arr;
}
