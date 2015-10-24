import assert from 'assert';
import { RingSecret } from '../src';

describe('RingSecret', () => {
  const secretString = 'L~2:N @bB↑& hmRh=';
  const secretBytes = [
    6, 37, 51, 36, 13,
    63, 26,  0, 59, 47,
    30, 32, 15, 30, 49,
  ];

  const secretJSON = {
    'GameID': 14129,
    'Rings': [
      'Power Ring L-1',
      'Dbl. Edge Ring',
      'Protection Ring',
    ],
  };

  describe('#load', () => {
    it('should load secret from byte array', () => {
      const secret = RingSecret.load(secretBytes);
      assert.deepEqual(
        secret.toJSON(),
        secretJSON
      );
    });
    it('should load secret from string', () => {
      const secret = RingSecret.load(secretString);
      assert.deepEqual(
        secret.toJSON(),
        secretJSON
      );
    });
    it('should throw when the secret is not 15 bytes', () => {
      assert.throws(
        RingSecret.load.bind(RingSecret, []),
        Error
      )
    });
    it('should throw when checksum is broken', () => {
      const brokenSecret = [
        6, 37, 51, 36, 13,
        63, 26,  0, 59, 47,
        30, 32, 15, /*Broken*/ 30 - 1, 49,
      ];
      assert.throws(
        RingSecret.load.bind(RingSecret, brokenSecret),
        Error
      )
    });
    it('should throw when it is a wrong secret type', () => {
      const brokenSecret = [
        0, 37, 51, 36, 13,
        63, 26,  0, 59, 47,
        30, 32, 15, 30, 63,
      ];
      assert.throws(
        RingSecret.load.bind(RingSecret, brokenSecret),
        Error
      )
    });
  });


  describe('#toBytes', () => {
    it('should produce a valid secret', () => {
      const secret = new RingSecret(secretJSON);
      assert.deepEqual(
        secret.toBytes(),
        secretBytes
      )
    });
  })

});
