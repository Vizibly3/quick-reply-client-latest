const fs = require("fs");
const crypto = require("crypto");

// MUST be 16 bytes for AES-128-CBC
const ENCRYPTION_KEY = Buffer.from("z7K$9vLp!eDfR3xT");

const encryptFile = (inputPath, outputPath, variableName) => {
  const code = fs.readFileSync(inputPath, "utf8");

  // Generate random 16-byte IV
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-128-cbc", ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(code, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Prepend IV to ciphertext
  const finalBuffer = Buffer.concat([iv, encrypted]);

  // Wrap as JS variable
  const wrapped = `const ${variableName} = "${finalBuffer.toString(
    "base64"
  )}";\n`;
  fs.writeFileSync(outputPath, wrapped, "utf8");

  console.log(`✅ Encrypted: ${inputPath} -> ${outputPath}`);
};

// Encrypt both files
encryptFile("content.js", "content.js.encrypted.js", "encryptedContent");
encryptFile(
  "content_linkedin.js",
  "content_linkedin.js.encrypted.js",
  "encryptedLinkedinContent"
);
