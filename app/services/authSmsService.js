module.exports = {
	crtSmsCode: function() {
		var max = 20000;
		var min = 10000;
		return Math.floor(Math.random() * (max - min) + min);
	}	
}