const Symbols = [
  'B', 'D', 'F', 'G', 'H', 'J', 'L', 'M', '♠', '♥', '♦', '♣', '#',
  'N', 'Q', 'R', 'S', 'T', 'W', 'Y', '!', '●', '▲', '■', '+', '-',
  'b', 'd', 'f', 'g', 'h', 'j',      'm', '$', '*', '/', ':', '~',
  'n', 'q', 'r', 's', 't', 'w', 'y', '?', '%', '&', '(', '=', ')',
  '2', '3', '4', '5', '6', '7', '8', '9', '↑', '↓', '←', '→', '@',
];

const nameSymbolMap = {
  'spade' : '♠',
  'heart': '♥',
  'diamond': '♦',
  'club': '♣',
  'circle': '●',
  'triangle': '▲',
  'square': '■',
  'up': '↑',
  'down': '↓',
  'left': '←',
  'right': '→',
}

const replacePattern = /\{(.*?)\}/gi

export function decode(secret) {
  secret = secret.replace(/\s+/g, '');
  secret = secret.replace(replacePattern, (fullMatch, match) => {
    let replace = nameSymbolMap[match];
    if (replace === undefined) throw new Error(`Placeholder ${match} not known.`);
    return replace;
  });
  var data = new Array(secret.length);

  for (var i = 0; i < secret.length; i++) {
    var symbol = Symbols.indexOf(secret[i]);
    if (symbol < 0 || symbol > 63)
      throw new Error('Secret contains invalid symbols');

    data[i] = symbol;
  }
  return data;
}

export function encode(data) {
  var str = '';
  for (var i = 0; i < data.length; i++) {
    if (data[i] < 0 || data[i] > 63) {
      throw new Error('Secret contains invalid values');
    }

    str += Symbols[data[i]];
    if (i % 5 == 4) {
      str += ' ';
    }
  }
  return str.trim();
}

