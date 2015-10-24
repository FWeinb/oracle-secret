import isString from 'is-string';
import BitArray from './BitArray';
import * as Secret from './Secret';
import { decode as decodeSecret } from './SecretParser'
import { createDualMapping } from './Helper'
import { Rings } from './Constants';

const RingsMap = createDualMapping(Rings);

export default class RingSecret {

  constructor({GameID, Rings}) {
    this.GameID = GameID;
    this.Rings = Rings;
  }

  static load(secret) {

    if (isString(secret)) {
      secret = decodeSecret(secret);
    }

    if (secret.length !== 15) {
      throw new Error('Length must be 15.')
    }

    let decodedBytes  = Secret.decodeBytes(secret);
    let decodedSecret = Secret.byteToBinaryArray(decodedBytes);
    let checksum      = Secret.calculateChecksum(decodedBytes, 14);


    if (decodedBytes[14] != checksum) {
      throw new Error(`Checksum (${decodedBytes[14]}) does not match expected value (${checksum})`);
    }

    if (decodedSecret.get(3) != 0 || decodedSecret.get(4) != 1) {
      throw new Error('The specified data is not a ring code');
    }

    var GameID = decodedSecret.read(5, 15);

    var Rings = [
      52,53,54,55,56,57,58,59,
      20,21,22,23,24,25,26,27,
      68,69,70,71,72,73,74,75,
      44,45,46,47,48,49,50,41,
      60,61,62,63,64,65,66,67,
      28,29,30,31,32,33,34,35,
      76,77,78,79,80,81,82,83,
      36,37,38,39,40,41,42,43,
    ].map((v, i) => decodedSecret.get(v) === 1 ? RingsMap.valueFor(i) : null )
     .filter((v) => v !== null);

    return new RingSecret({
      GameID,
      Rings,
    });
  }

  toBytes() {
    var bitArray = new BitArray( 90 );


    var ringArr = Array.from({length: 64}, (v, k) => 0);

    this.Rings
    .map((value) => RingsMap.keyFor(value))
    .forEach((number) => {
      ringArr[number] = 1;
    });

    bitArray.setLeNumber(0, Secret.calculateCipher(this.GameID), 3);

    bitArray.set(3, 0); // game secret
    bitArray.set(4, 1); // game secret

    bitArray.setLeNumber(5, this.GameID, 15);

    bitArray.setArray(20, [
      8,   9, 10, 11, 12, 13, 14, 15,
      40, 41, 42, 43, 44, 45, 46, 47,
      56, 57, 58, 59, 60, 61, 62, 63,
      24, 25, 26, 27, 28, 29, 30, 31,
      0,   1,  2,  3,  4,  5,  6,  7,
      32, 33, 34, 35, 36, 37, 38, 39,
      16, 17, 18, 19, 20, 21, 22, 23,
      48, 49, 50, 51, 52, 53, 54, 55,
    ].map((v, i) => ringArr[v]));

    var unencodedBytes = Secret.binaryToByteArray(bitArray);
    unencodedBytes[14] = Secret.calculateChecksum(unencodedBytes);

    return Secret.decodeBytes(unencodedBytes);
  }

  toJSON() {
    return {
      GameID: this.GameID,
      Rings: this.Rings,
    }
  }

}
