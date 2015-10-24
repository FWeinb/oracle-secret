import isString from 'is-string';
import BitArray from './BitArray';
import * as Secret from './Secret';
import { decode as decodeSecret } from './SecretParser'
import { createDualMapping } from './Helper'
import { Games, Animals, ChildBehaviors } from './Constants';

const GameMap = createDualMapping(Games);
const AnimalMap = createDualMapping(Animals);
const ChildBehaviorMap = createDualMapping(ChildBehaviors);

export default class GameSecret {

  constructor({
    Hero,
    GameID,
    Game,
    Child,
    Animal,
    Behavior,
    IsLinkedGame,
    IsHeroQuest,
  }) {
    this.Hero = Hero;
    this.GameID = GameID;
    this.Game = Game;
    this.Child = Child;
    this.Animal = Animal;
    this.Behavior = Behavior;
    this.IsLinkedGame = IsLinkedGame;
    this.IsHeroQuest = IsHeroQuest;
  }

  static load(secret) {
    if (isString(secret)) {
      secret = decodeSecret(secret);
    }

    if (secret.length !== 20) throw new Error('Length must be 20.')

    let decodedBytes  = Secret.decodeBytes(secret);
    let decodedSecret = Secret.byteToBinaryArray(decodedBytes);
    let checksum      = Secret.calculateChecksum(decodedBytes, 19);

    if (decodedBytes[19] != checksum) {
      throw new Error(`Checksum (${decodedBytes[19]}) does not match expected value (${checksum})`);
    }

    if (decodedSecret.get(3) != 0 || decodedSecret.get(4) != 0) {
      throw new Error('The specified data is not a game code');
    }

    var GameID       = decodedSecret.read(5, 15);
    var Game         = GameMap.valueFor(decodedSecret.get(21)+'');
    var IsHeroQuest  = decodedSecret.get(20)  === 1;
    var IsLinkedGame = decodedSecret.get(105) === 1;

    // Read Hero name
    var Hero = [ 22, 38, 60, 77, 89 ].reduce((l, r) => {
      return l + String.fromCharCode(decodedSecret.read(r, 8));
    }, '');

    // Read Child name
    var Child = [ 30, 46, 68, 97, 106 ].reduce((l, r) => {
      return l + String.fromCharCode(decodedSecret.read(r, 8));
    }, '');

    var Animal   = AnimalMap.valueFor(decodedSecret.read(85, 3));
    var Behavior = ChildBehaviorMap.valueFor(decodedSecret.read(54, 4));

    return new GameSecret({
      Hero,
      GameID,
      Game,
      Child,
      Animal,
      Behavior,
      IsLinkedGame,
      IsHeroQuest,
    });
  }

  toBytes() {
    var bitArray = new BitArray( 120 );

    bitArray.setLeNumber(0, Secret.calculateCipher(this.GameID), 3);

    bitArray.set(3, 0); // game secret
    bitArray.set(4, 0); // game secret

    bitArray.setLeNumber(5, this.GameID, 15);
    bitArray.set(20, this.IsHeroQuest ? 1 : 0);
    bitArray.set(21, GameMap.keyFor(this.Game));

    // Write Hero Name
    [ 22, 38, 60, 77, 89 ].forEach((v, i) => {
      bitArray.setLeNumber(v, this.Hero.charCodeAt(i), 8);
    });

    // Write Child Name
    [ 30, 46, 68, 97, 106 ].forEach((v, i) => {
      bitArray.setLeNumber(v, this.Child.charCodeAt(i), 8);
    });


    bitArray.setLeNumber(54, ChildBehaviorMap.keyFor(this.Behavior), 4);
    bitArray.set(76, 1); // unknown 1
    bitArray.setLeNumber(85, AnimalMap.keyFor(this.Animal), 3);
    bitArray.set(88, 1); // unknown 2
    bitArray.set(105, this.IsLinkedGame ? 1 : 0);

    var unencodedBytes = Secret.binaryToByteArray(bitArray);
    unencodedBytes[19] = Secret.calculateChecksum(unencodedBytes);

    return Secret.decodeBytes(unencodedBytes);
  }

  toJSON() {
    return {
      Hero:         this.Hero,
      Game:         this.Game,
      GameID:       this.GameID,
      Child:        this.Child,
      Animal:       this.Animal,
      Behavior:     this.Behavior,
      IsLinkedGame: this.IsLinkedGame,
      IsHeroQuest:  this.IsHeroQuest,
    };
  }
}
