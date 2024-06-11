const { v5: uuidv5 } = require('uuid');
const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
function changePwdToUuid(pwd) {
  return uuidv5(pwd, namespace);
}
module.exports = { changePwdToUuid };
