const fs = require('fs');
const path = require('path');

// Fix for @noble/secp256k1
const noblePath = path.join(process.cwd(), 'node_modules', '@noble', 'secp256k1', 'lib', 'esm', 'index.js');
let nobleContent = fs.readFileSync(noblePath, 'utf8');
nobleContent = nobleContent.replace(/nodeCrypto\.randomBytes/g, 'window.crypto.getRandomValues');
fs.writeFileSync(noblePath, nobleContent);