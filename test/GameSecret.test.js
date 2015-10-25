import assert from 'assert';
import { GameSecret } from '../src';


describe('GameSecret', () => {
  const secretString = 'H~2:@ ←2♦yq GB3●( 6♥?↑6';
  const secretBytes = [
    4, 37, 51, 36, 63,
    61, 51, 10, 44, 39,
    3,  0, 52, 21, 48,
    55,  9, 45, 59, 55,
  ];

  const secretJSON = {
    Hero: 'Link',
    Game: 'Ages',
    GameID: 14129,
    Child: 'Pip',
    Animal: 'Dimitri',
    Behavior: 'BouncyD',
    IsLinkedGame: true,
    IsHeroQuest: false,
  }

  describe('#load', () => {
    it('should load secret from byte array', () => {
      const secret = GameSecret.load(secretBytes);
      assert.deepEqual(
        secret.toJSON(),
        secretJSON
      );
    });
    it('should load secret from string', () => {
      const secret = GameSecret.load(secretString);
      assert.deepEqual(
        secret.toJSON(),
        secretJSON
      );
    });
    it('should throw when the secret is not 20 bytes', () => {
      assert.throws(
        GameSecret.load.bind(GameSecret, []),
        Error
      )
    });
    it('should throw when checksum is broken', () => {
      const brokenSecret = [
        4, 37, 51, 36, 63,
        61, 51, 10, 44, 39,
        3,  0, 52, 21, 48,
        55,  9, 45, /*Broken*/ 59 - 1, 55,
      ];
      assert.throws(
        GameSecret.load.bind(GameSecret, brokenSecret),
        Error
      )
    });
    it('should throw when it is a wrong secret type', () => {
      const brokenSecret = [
        59, 9, 52, 60, 20,
        25, 56, 54, 55, 25,
        40, 16, 35, 57, 17,
        58, 60, 19, 51, 29,
      ];
      assert.throws(
        GameSecret.load.bind(GameSecret, brokenSecret),
        Error
      )
    });
  });

  describe('#toBytes', () => {
    it('should produce a valid secret', () => {
      const secret = new GameSecret(secretJSON);
      assert.deepEqual(
        secret.toBytes(),
        secretBytes
      )
    });
  })

});
