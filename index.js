const crypto = require('crypto');
const fs = require('fs');

// Генерация сертификата для шифрования
function generateCertificates() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'sad'
    }
  });

  fs.writeFileSync('encryption-public-key.pem', publicKey);
  fs.writeFileSync('decryption-private-key.pem', privateKey);

  return { publicKey, privateKey };
}

// Шифрование текста
function encryptText(text, publicKey) {
    const encryptedText = crypto.publicEncrypt(publicKey, Buffer.from(text, 'utf-8')).toString('base64');

  return encryptedText.toString('base64');
}

// Расшифровка текста
function decryptText(encryptedText, privateKey) {
    const decryptedText = crypto.privateDecrypt({
        key: privateKey,
        passphrase: 'sad'
    }, Buffer.from(encryptedText, 'base64')).toString('utf-8');

  return decryptedText.toString('utf8');
}

// Пример использования
const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } = generateCertificates();


const textToEncrypt = 'Привет, мир!';

const encryptedText = encryptText(textToEncrypt, encryptionPublicKey);
console.log('Зашифрованный текст:', encryptedText);

const decryptedText = decryptText(encryptedText, encryptionPrivateKey);
console.log('Расшифрованный текст:', decryptedText);

fs.unlinkSync('encryption-public-key.pem');
fs.unlinkSync('decryption-private-key.pem');