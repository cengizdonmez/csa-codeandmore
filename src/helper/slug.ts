const slugify = (query: string) => {
  query = query.split("").map(_key => _key === "İ" ? "i" : _key).join("");
  const a = 'àáäâãåдèéëêğıìíïîİòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;şбвгё';
  const b = 'aaaaaadeeeegiiiiiioooouuuuncsyoarsnpwgnmuxzh------sbvgy';
  const p = new RegExp(a.split('').join('|'), 'g');
  const str = query
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // replace special characters in a with b
    .replace(/&/g, '-and-') // replace & with ‘and’
    .replace(/--+/g, '-') // replace multiple — with single -
    .replace(/^-+/, '');

    const newstr = str.split("").map(char => slugto(char)).join("");
    
  return newstr;// Trim — from start of text
};

function slugify2(s, opt) {
  s = String(s);
  opt = Object(opt);

  var defaults = {
    delimiter: '-',
    limit: undefined,
    lowercase: true,
    replacements: {},
    transliterate: typeof XRegExp === 'undefined' ? true : false,
  };

  // Merge options
  for (var k in defaults) {
    if (!opt.hasOwnProperty(k)) {
      opt[k] = defaults[k];
    }
  }

  var char_map = {
    // Latin
    À: 'A',
    Á: 'A',
    Â: 'A',
    Ã: 'A',
    Ä: 'A',
    Å: 'A',
    Æ: 'AE',
    Ç: 'C',
    È: 'E',
    É: 'E',
    Ê: 'E',
    Ë: 'E',
    Ì: 'I',
    Í: 'I',
    Î: 'I',
    Ï: 'I',
    Ð: 'D',
    Ñ: 'N',
    Ò: 'O',
    Ó: 'O',
    Ô: 'O',
    Õ: 'O',
    Ö: 'O',
    'Å': 'O',
    Ø: 'O',
    Ù: 'U',
    Ú: 'U',
    Û: 'U',
    Ü: 'U',
    'Å°': 'U',
    Ý: 'Y',
    Þ: 'TH',
    ß: 'ss',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    æ: 'ae',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ð: 'd',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    'Å': 'o',
    ø: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    'Å±': 'u',
    ý: 'y',
    þ: 'th',
    ÿ: 'y',

    // Latin symbols
    '©': '(c)',

    // Greek
    Α: 'A',
    Β: 'B',
    Γ: 'G',
    Δ: 'D',
    Ε: 'E',
    Ζ: 'Z',
    Η: 'H',
    Θ: '8',
    Ι: 'I',
    Κ: 'K',
    Λ: 'L',
    Μ: 'M',
    Ν: 'N',
    Ξ: '3',
    Ο: 'O',
    Π: 'P',
    Ρ: 'R',
    Σ: 'S',
    Τ: 'T',
    Υ: 'Y',
    Φ: 'F',
    Χ: 'X',
    Ψ: 'PS',
    Ω: 'W',
    'Î': 'A',
    'Î': 'E',
    'Î': 'I',
    'Î': 'O',
    'Î': 'Y',
    'Î': 'H',
    'Î': 'W',
    Îª: 'I',
    'Î«': 'Y',
    α: 'a',
    β: 'b',
    γ: 'g',
    δ: 'd',
    ε: 'e',
    ζ: 'z',
    η: 'h',
    θ: '8',
    ι: 'i',
    κ: 'k',
    λ: 'l',
    μ: 'm',
    ν: 'n',
    ξ: '3',
    ο: 'o',
    π: 'p',
    ρ: 'r',
    σ: 's',
    τ: 't',
    υ: 'y',
    φ: 'f',
    χ: 'x',
    ψ: 'ps',
    ω: 'w',
    'Î¬': 'a',
    'Î­': 'e',
    'Î¯': 'i',
    'Ï': 'o',
    'Ï': 'y',
    'Î®': 'h',
    'Ï': 'w',
    ς: 's',
    'Ï': 'i',
    'Î°': 'y',
    'Ï': 'y',
    'Î': 'i',

    // Turkish
    'Å': 'S',
    'Ä°': 'I',
    Ç: 'C',
    Ü: 'U',
    Ö: 'O',
    'Ä': 'G',
    'Å': 's',
    'Ä±': 'i',
    ç: 'c',
    ü: 'u',
    ö: 'o',
    'Ä': 'g',

    // Russian
    'Ð': 'A',
    'Ð': 'B',
    'Ð': 'V',
    'Ð': 'G',
    'Ð': 'D',
    'Ð': 'E',
    'Ð': 'Yo',
    'Ð': 'Zh',
    'Ð': 'Z',
    'Ð': 'I',
    'Ð': 'J',
    'Ð': 'K',
    'Ð': 'L',
    'Ð': 'M',
    'Ð': 'N',
    'Ð': 'O',
    'Ð': 'P',
    'Ð ': 'R',
    'Ð¡': 'S',
    'Ð¢': 'T',
    'Ð£': 'U',
    'Ð¤': 'F',
    'Ð¥': 'H',
    'Ð¦': 'C',
    'Ð§': 'Ch',
    'Ð¨': 'Sh',
    'Ð©': 'Sh',
    Ðª: '',
    'Ð«': 'Y',
    'Ð¬': '',
    'Ð­': 'E',
    'Ð®': 'Yu',
    'Ð¯': 'Ya',
    'Ð°': 'a',
    'Ð±': 'b',
    'Ð²': 'v',
    'Ð³': 'g',
    'Ð´': 'd',
    Ðµ: 'e',
    'Ñ': 'yo',
    'Ð¶': 'zh',
    'Ð·': 'z',
    'Ð¸': 'i',
    'Ð¹': 'j',
    Ðº: 'k',
    'Ð»': 'l',
    'Ð¼': 'm',
    'Ð½': 'n',
    'Ð¾': 'o',
    'Ð¿': 'p',
    'Ñ': 'r',
    'Ñ': 's',
    'Ñ': 't',
    'Ñ': 'u',
    'Ñ': 'f',
    'Ñ': 'h',
    'Ñ': 'c',
    'Ñ': 'ch',
    'Ñ': 'sh',
    'Ñ': 'sh',
    'Ñ': '',
    'Ñ': 'y',
    'Ñ': '',
    'Ñ': 'e',
    'Ñ': 'yu',
    'Ñ': 'ya',

    // Ukrainian
    'Ð': 'Ye',
    'Ð': 'I',
    'Ð': 'Yi',
    'Ò': 'G',
    'Ñ': 'ye',
    'Ñ': 'i',
    'Ñ': 'yi',
    'Ò': 'g',

    // Czech
    'Ä': 'C',
    'Ä': 'D',
    'Ä': 'E',
    'Å': 'N',
    'Å': 'R',
    Š: 'S',
    'Å¤': 'T',
    'Å®': 'U',
    'Å½': 'Z',
    'Ä': 'c',
    'Ä': 'd',
    'Ä': 'e',
    'Å': 'n',
    'Å': 'r',
    š: 's',
    'Å¥': 't',
    'Å¯': 'u',
    'Å¾': 'z',

    // Polish
    'Ä': 'A',
    'Ä': 'C',
    'Ä': 'e',
    'Å': 'L',
    'Å': 'N',
    Ó: 'o',
    'Å': 'S',
    'Å¹': 'Z',
    'Å»': 'Z',
    'Ä': 'a',
    'Ä': 'c',
    'Ä': 'e',
    'Å': 'l',
    'Å': 'n',
    ó: 'o',
    'Å': 's',
    Åº: 'z',
    'Å¼': 'z',

    // Latvian
    'Ä': 'A',
    'Ä': 'C',
    'Ä': 'E',
    'Ä¢': 'G',
    Äª: 'i',
    'Ä¶': 'k',
    'Ä»': 'L',
    'Å': 'N',
    Š: 'S',
    Åª: 'u',
    'Å½': 'Z',
    'Ä': 'a',
    'Ä': 'c',
    'Ä': 'e',
    'Ä£': 'g',
    'Ä«': 'i',
    'Ä·': 'k',
    'Ä¼': 'l',
    'Å': 'n',
    š: 's',
    'Å«': 'u',
    'Å¾': 'z',
  };

  // Make custom replacements
  for (var k in opt.replacements) {
    s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
  }

  // Transliterate characters to ASCII
  if (opt.transliterate) {
    for (var k in char_map) {
      s = s.replace(RegExp(k, 'g'), char_map[k]);
    }
  }

  // replace non-alphanumeric characters with our delimiter
  var alnum =
    typeof XRegExp === 'undefined' ? RegExp('[^a-z0-9]+', 'ig') : XRegExp('[^\\p{L}\\p{N}]+', 'ig');
  s = s.replace(alnum, opt.delimiter);

  // Remove duplicate delimiters
  s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter);

  // Truncate slug to max. characters
  s = s.substring(0, opt.limit);

  // Remove delimiter from ends
  s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '');

  return opt.lowercase ? s.toLowerCase() : s;
}

function slugto(text: String) {
  text = text.replace('ç', 'c');
  text = text.replace('Ç', 'C');
  text = text.replace('ğ', 'g');
  text = text.replace('Ğ', 'G');
  text = text.replace('ı', 'i');
  text = text.replace('İ', 'I');
  text = text.replace('ö', 'o');
  text = text.replace('Ö', 'O');
  text = text.replace('ş', 's');
  text = text.replace('Ş', 'S');
  text = text.replace('ü', 'u');
  text = text.replace('Ü', 'U');
  text = text.replace('â', 'a');
  text = text.replace('ê', 'e');
  text = text.replace('î', 'i');
  text = text.replace('û', 'u');
  text = text.replace('Ə', 'e');
  text = text.replace('ə', 'e');
  text = text.replace('ë', 'e');

  text = text.replace('a', 'a');
  text = text.replace('б', 'b');
  text = text.replace('в', 'v');
  text = text.replace('г', 'g');
  text = text.replace('д', 'd');
  text = text.replace('е', 'e');
  text = text.replace('ё', 'yo');
  text = text.replace('ж', 'zh');
  text = text.replace('з', 'z');
  text = text.replace('и', 'i');
  text = text.replace('й', 'j');
  text = text.replace('к', 'k');
  text = text.replace('л', 'l');
  text = text.replace('м', 'm');
  text = text.replace('н', 'n');
  text = text.replace('о', 'o');
  text = text.replace('п', 'p');
  text = text.replace('р', 'r');
  text = text.replace('с', 's');
  text = text.replace('т', 't');
  text = text.replace('у', 'u');
  text = text.replace('ф', 'f');
  text = text.replace('х', 'h');
  text = text.replace('ц', 'ts');
  text = text.replace('ч', 'ch');
  text = text.replace('ш', 'sh');
  text = text.replace('щ', 'shch');
  text = text.replace('ъ', 'or');
  text = text.replace('ы', 'y');
  text = text.replace('э', 'e');
  text = text.replace('ю', 'yu');
  text = text.replace('я', 'ya');
  text = text.replace('ь', 'er');
  text = text.replace('%D0%B0', 'a');

  text = text.replace('.', '');
  text = text.replace(':', '');
  text = text.replace(',', '');
  text = text.replace(';', '');
  text = text.replace(' ', '-');
  text = text.replace('<', '');
  text = text.replace('>', '');
  text = text.replace('|', '');
  text = text.replace('é', '');
  text = text.replace('"', '');
  text = text.replace("'", '');
  text = text.replace('`', '');
  text = text.replace('^', '');
  text = text.replace('#', '');
  text = text.replace('+', '');
  text = text.replace('$', '');
  text = text.replace('!', '');
  text = text.replace('%', '');
  text = text.replace('½', '');
  text = text.replace('&', '');
  text = text.replace('/', '');
  text = text.replace('{', '');
  text = text.replace('}', '');
  text = text.replace('=', '');
  text = text.replace('(', '');
  text = text.replace('[', '');
  text = text.replace(']', '');
  text = text.replace(')', '');
  text = text.replace('*', '');
  text = text.replace('?', '');
  text = text.replace('"', '');
  text = text.replace('¦', '');
  text = text.replace('™', '');
  text = text.replace('§', '');
  text = text.replace('©', '');
  text = text.replace('®', '');
  text = text.replace('¿', '');
  text = text.replace('¡', '');
  text = text.replace('¶', '');
  text = text.replace('ß', '');
  text = text.replace('¢', '');
  text = text.replace('€', '');
  text = text.replace('£', '');
  text = text.replace('¥', '');
  text = text.replace('₺', '');
  text = text.replace('ƒ', '');
  text = text.replace('~', '');
  text = text.replace('≈', '');
  text = text.replace('²', '');
  text = text.replace('³', '');
  text = text.replace('°', '');
  text = text.replace('≡', '');
  text = text.replace('@', '');
  text = text.replace('Ø', '');
  text = text.replace('±', '');
  text = text.replace('÷', '');
  text = text.replace('⅓', '');
  text = text.replace('⅔', '');
  text = text.replace('¼', '');
  text = text.replace('¾', '');
  text = text.replace('⅛', '');
  text = text.replace('⅜', '');
  text = text.replace('⅝', '');
  text = text.replace('⅞', '');
  text = text.replace('-', '-');
  text = text.replace('_', '-');
  text = text.replace('«', '-');
  text = text.replace('»', '-');
  text = text.replace('%20', '-');
  text = text.replace('---', '-');
  text = text.replace('--', '-');
  text = text.replace('-/-', '-');

  return text;
}

export default slugify;
