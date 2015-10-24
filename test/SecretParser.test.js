import assert from 'assert';
import * as SecretParser from '../src/SecretParser';

describe('SecretParser', () => {
  const secretString = 'H~2:@ ←2♦yq GB3●( 6♥?↑6';
  const secretBytes = [
    4,  37, 51, 36, 63,
    61, 51, 10, 44, 39,
    3,   0, 52, 21, 48,
    55,  9, 45, 59, 55,
  ];

  describe('#decode', () => {
    it('should work with valid secret', () => {
      assert.deepEqual(
        SecretParser.decode(secretString),
        secretBytes
      );
    });
    it('should throw when there is an invalid symbol', () => {
      assert.throws(
        SecretParser.decode.bind(SecretParser, 'ä'),
        Error
      )
    });
  });


  describe('#encode', () => {
    it('should work with valid bytes', () => {
      assert.equal(
        SecretParser.encode(secretBytes),
        secretString
      );
    });
    it('should throw when there is an invalid byte', () => {
      assert.throws(
        SecretParser.encode.bind(SecretParser, [228]),
        Error
      );
    });
  });

});
