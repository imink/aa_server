module.exports = {
	createRes: function(code, msg, data) {
		var status = {code: code, msg: msg};
		var resJson = {
			status: status,
			data: data
		};
		return resJson;
	}
}