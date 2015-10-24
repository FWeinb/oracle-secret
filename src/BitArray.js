export default class BitArray  {

  constructor(size) {
    this._arr = Array.from({length: size}, () => 0);
  }

  get length() {
    return this._arr.length;
  }

  read(offset, length) {
    let value = 0;
    for (var i=0;i<length;i++) {
      value += this._arr[offset + i] * (1 << i);
    }
    return value;
  }

  readBe(offset, length) {
    let value = 0;
    let weight = 1 << (length - 1);
    for (var i=0;i<length;i++) {
      value += this._arr[offset + i] * weight;
      weight = weight >> 1;
    }
    return value;
  }

  set(offset, value) {
    this._arr[offset] = value;
    return this;
  }

  setArray(offset, arr) {
    for (var i=0;i<arr.length;i++) {
      this._arr[offset + i] = arr[i];
    }
    return this;
  }

  get(offset) {
    return this._arr[offset]
  }

  setLeNumber(offset, value, length) {
    let msbWeight = length - 1;
    for (var i=0;i<length;i++) {
      this._arr[offset + i] = (value >> i) & 1;
    }
    return this;
  }

  setBeNumber(offset, value, length) {
    let msbWeight = length - 1;
    for (var i=0;i<length;i++) {
      this._arr[offset + i] = (value >> (msbWeight - i)) & 1;
    }
    return this;
  }
}
