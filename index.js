function generateRandomString(length) {
  const characters =
    "abcdefghijkl-mnopqrstuvwxyzABC-DEF-GHIJKLMNOPQRSTUVWXYZ012-3456789-";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

// Example usage:
const randomString = generateRandomString(120); // Generate a random string of length 32
console.log(randomString);
