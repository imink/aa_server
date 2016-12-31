

function calDistance(lat1, lon1, lat2, lon2) {
	var p = 0.017453292519943295;
	var c = Math.cos;
	var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

	return 12742 * Math.asin(Math.sqrt(a));
}

exports.getNearest = function(drivers, userData) {
	console.log(drivers);
	var distance = 0, minDistance = Number.MAX_SAFE_INTEGER;
	var socketIds = Object.keys(drivers);
	var matchedSocketId = 0;
	if (socketIds.length == 1) {
		matchedSocketId = socketIds[0];
	} else if (socketIds.length > 1) {
		for (key in socketIds) {
			var lat = drivers[socketIds[key]].latLong[0];
			var lng = drivers[socketIds[key]].latLong[1];

			distance = calDistance(userData.lat, userData.lng, lat, lng);
			if (distance < minDistance) {
				minDistance = distance;
				matchedSocketId = socketIds[key];
			}
		}
	}
	return matchedSocketId;
}

function randomFloat(low, high) {
	var low = 0.01;
	var high = 0.02;
	return (Math.random() * (high - low) + low);
}

exports.crtFakeDrivers = function() {
	var numOfDrivers = 3;
	var ucl = {lat: 51.524559, lng: -0.13404};
	var drivers = {};
	for (i = 0; i < numOfDrivers; i ++) {
		var driverMarker = {latLng: [nationalGallery.lat + randomFloat(0.0, 0.2), ucl.lng + randomFloat(0.0, 0.2)]};
		drivers.push(driverMarker);
	}
	return drivers;
}


