/*
 * JavaScript hex_md5
 * https://github.com/blueimp/JavaScript-hex_md5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. hex_md5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/hex_md5 for more info.
 */

/* global define */

// ; (function ($) {
'use strict'

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xffff)
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function hex_md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
}

function hex_md5ff(a, b, c, d, x, s, t) {
  return hex_md5cmn((b & c) | (~b & d), a, b, x, s, t)
}

function hex_md5gg(a, b, c, d, x, s, t) {
  return hex_md5cmn((b & d) | (c & ~d), a, b, x, s, t)
}

function hex_md5hh(a, b, c, d, x, s, t) {
  return hex_md5cmn(b ^ c ^ d, a, b, x, s, t)
}

function hex_md5ii(a, b, c, d, x, s, t) {
  return hex_md5cmn(c ^ (b | ~d), a, b, x, s, t)
}

/*
 * Calculate the hex_md5 of an array of little-endian words, and a bit length.
 */
function binlhex_md5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32)
  x[((len + 64) >>> 9 << 4) + 14] = len

  var i
  var olda
  var oldb
  var oldc
  var oldd
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (i = 0; i < x.length; i += 16) {
    olda = a
    oldb = b
    oldc = c
    oldd = d

    a = hex_md5ff(a, b, c, d, x[i], 7, -680876936)
    d = hex_md5ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = hex_md5ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = hex_md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = hex_md5ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = hex_md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = hex_md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = hex_md5ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = hex_md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = hex_md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = hex_md5ff(c, d, a, b, x[i + 10], 17, -42063)
    b = hex_md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = hex_md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = hex_md5ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = hex_md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = hex_md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = hex_md5gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = hex_md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = hex_md5gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = hex_md5gg(b, c, d, a, x[i], 20, -373897302)
    a = hex_md5gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = hex_md5gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = hex_md5gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = hex_md5gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = hex_md5gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = hex_md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = hex_md5gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = hex_md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = hex_md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = hex_md5gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = hex_md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = hex_md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hex_md5hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hex_md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hex_md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hex_md5hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hex_md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hex_md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hex_md5hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hex_md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hex_md5hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hex_md5hh(d, a, b, c, x[i], 11, -358537222)
    c = hex_md5hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hex_md5hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hex_md5hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hex_md5hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hex_md5hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hex_md5hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = hex_md5ii(a, b, c, d, x[i], 6, -198630844)
    d = hex_md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = hex_md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = hex_md5ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = hex_md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = hex_md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = hex_md5ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = hex_md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = hex_md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = hex_md5ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = hex_md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = hex_md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = hex_md5ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = hex_md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = hex_md5ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = hex_md5ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safeAdd(a, olda)
    b = safeAdd(b, oldb)
    c = safeAdd(c, oldc)
    d = safeAdd(d, oldd)
  }
  return [a, b, c, d]
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2rstr(input) {
  var i
  var output = ''
  var length32 = input.length * 32
  for (i = 0; i < length32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
  }
  return output
}

/*
 * Convert a raw string to an array of little-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binl(input) {
  var i
  var output = []
  output[(input.length >> 2) - 1] = undefined
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0
  }
  var length8 = input.length * 8
  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
  }
  return output
}

/*
 * Calculate the hex_md5 of a raw string
 */
function rstrhex_md5(s) {
  return binl2rstr(binlhex_md5(rstr2binl(s), s.length * 8))
}

/*
 * Calculate the HMAC-hex_md5, of a key and some data (raw strings)
 */
function rstrHMAChex_md5(key, data) {
  var i
  var bkey = rstr2binl(key)
  var ipad = []
  var opad = []
  var hash
  ipad[15] = opad[15] = undefined
  if (bkey.length > 16) {
    bkey = binlhex_md5(bkey, key.length * 8)
  }
  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636
    opad[i] = bkey[i] ^ 0x5c5c5c5c
  }
  hash = binlhex_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
  return binl2rstr(binlhex_md5(opad.concat(hash), 512 + 128))
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input) {
  var hexTab = '0123456789abcdef'
  var output = ''
  var x
  var i
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i)
    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
  }
  return output
}

/*
 * Encode a string as utf-8
 */
function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input))
}

/*
 * Take string arguments and return either raw or hex encoded strings
 */
function rawhex_md5(s) {
  return rstrhex_md5(str2rstrUTF8(s))
}

function hexhex_md5(s) {
  return rstr2hex(rawhex_md5(s))
}

function rawHMAChex_md5(k, d) {
  return rstrHMAChex_md5(str2rstrUTF8(k), str2rstrUTF8(d))
}

function hexHMAChex_md5(k, d) {
  return rstr2hex(rawHMAChex_md5(k, d))
}

function hex_md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexhex_md5(string)
    }
    return rawhex_md5(string)
  }
  if (!raw) {
    return hexHMAChex_md5(key, string)
  }
  return rawHMAChex_md5(key, string)
}

if (typeof define === 'function' && define.amd) {
  define(function () {
    return hex_md5
  })
} else if (typeof module === 'object' && module.exports) {
  module.exports = hex_md5
} else {
  $.hex_md5 = hex_md5
}
// })(this)

module.exports = {
  md5: hex_md5
}