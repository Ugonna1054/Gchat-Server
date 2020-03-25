function generateCode() {
  let text = "";
  let possible =
    "0123456789";

  for (let i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function generateToken() {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 40; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

exports.generateToken = generateToken 
exports.generateCode = generateCode