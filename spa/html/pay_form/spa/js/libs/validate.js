function is_valid_luhn(number) {
  var digit, n, sum, _i, _len, _ref;
  sum = 0;
  _ref = number.split('').reverse();
  for (n = _i = 0, _len = _ref.length; _i < _len; n = ++_i) {
	digit = _ref[n];
	digit = +digit;
	if (n % 2) {
	  digit *= 2;
	  if (digit < 10) {
		sum += digit;
	  } else {
		sum += digit - 9;
	  }
	} else {
	  sum += digit;
	}
  }
  return sum % 10 === 0;
}

function validateEmail(email) { 
	var re = /^([a-zA-Z0-9_\.\-])+@[^.@\s]+(\.[^.@\s]+)+$/;
	return re.test(email);
}