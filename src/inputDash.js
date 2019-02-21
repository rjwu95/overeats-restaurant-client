export const inputDash = str => {
  let phoneNumber = str
    .replace(/ /gi, '')
    .replace(/-/gi, '')
    .split('');

  if (phoneNumber[2] !== '0') {
    phoneNumber.splice(3, 0, '-');
    phoneNumber.splice(7, 0, '-');
    phoneNumber = phoneNumber.join('');
  } else {
    phoneNumber.splice(3, 0, '-');
    phoneNumber.splice(8, 0, '-');
    phoneNumber = phoneNumber.join('');
  }
  return phoneNumber;
};
