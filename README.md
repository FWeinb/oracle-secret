# oracle-secret [![Build status](https://travis-ci.org/fweinb/oracle-secret.svg?branch=master)](https://travis-ci.org/fweinb/oracle-secret)

> Encode/Decode Legend of Zelda Oracle of Ages and Oracle of Seasons secrets.

## Install

```
$ npm install --save oracle-secret
```

## Usage

Load a `GameSecret`
```js
import { GameSecret } from 'oracle-secret';

const secret = GameSecret.load('H~2:@ ←2♦yq GB3●( 6♥?↑6');

console.log(secret.toJSON());
//{
//  Hero: 'Link\u0000',
//  GameID: 14129,
//  Game: 'Ages',
//  Child: 'Pip\u0000\u0000',
//  Animal: 'Dimitri',
//  Behavior: 'BouncyD',
//  IsLinkedGame: true,
//  IsHeroQuest: false
//}
```

Create a `GameSecret`
```js
import { GameSecret, SecretParser } from 'oracle-secret';

const secret = new GameSecret({
  Hero: 'Zelda',
  GameID: 4000,
  Game: 'Ages',
  Child: 'Pip\u0000\u0000',
  Animal: 'Moosh',
  Behavior: 'HyperA',
  IsLinkedGame: true,
  IsHeroQuest: true
});

console.log(SecretParser.encode(secret.toBytes()));
// 8♥3↓! -756- rS/8T 9↓Y2d
```

## Special Thanks
 * [Andrew Nagle](https://github.com/kabili207) for his [oracle-hack](https://github.com/kabili207/oracle-hack) 


