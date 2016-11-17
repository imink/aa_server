

function calDistance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

	return 12742 * Math.asin(Math.sqrt(a));
}

exports.getNearest = function(drivers, userData) {
	var distance = 0, minDistance = Number.MAX_SAFE_INTEGER;
	var socketIds = Object.keys(drivers);
	var matchedSocketId = 0;
	if (socketIds.length == 1) {
		matchedSocketId = socketIds[0];
	} else if (socketIds.length > 1) {
		for (key in socketIds) {
			var lat = drivers[socketIds[key]].latlong[0];
			var lng = drivers[socketIds[key]].latlong[1];

			distance = this.calDistance(userData.lat, userData.lng, lat, lng);
			if (distance < minDistance) {
				minDistance = distance;
				matchedSocketId = key;
			}
		}
	}
	return matchedSocketId;
}