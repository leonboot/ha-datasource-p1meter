var P1Reader = require('p1-reader');
var reader = new P1Reader({serialPort: '/dev/ttyUSB0', debug: false});

var graphite = require('graphite');
var client = graphite.createClient('plaintext://graphite.cloud.nw153.nl:2003/');

const httpCodes = {
  200: "OK",
	201: "Created",
	202: "Accepted",
	304: "Not Modified",
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	405: "Resource Not Allowed",
	406: "Not Acceptable",
	409: "Conflict",
	412: "Precondition Failed",
	415: "Bad Content Type",
	416: "Requested Range Not Satisfiable",
	417: "Expectation Failed",
	500: "Internal Server Error"
}

reader.on('reading', function (data) {
	const toSave = {
		equipmentId: data.equipmentId,
		timestamp: new Date(data.timestamp),
		electricity: {
			received: {
				tariff1: data.electricity.received.tariff1.reading,
				tariff2: data.electricity.received.tariff2.reading,
				actual: data.electricity.received.actual.reading
			},
			tariffIndicator: data.electricity.tariffIndicator
		},
		gas: {
			timestamp: new Date(data.gas.timestamp),
			usage: data.gas.reading
		}
	};
	console.log('home.utility.electricity.usage ' + (data.electricity.received.actual.reading * 1000).toString() + ' ' + ((new Date(data.timestamp)).getTime() / 1000).toString());
	client.write({"home.utility.electricity.usage": data.electricity.received.actual.reading * 1000}, (new Date(data.timestamp)).getTime() / 1000);
        client.write({"home.utility.gas.usage": data.gas.reading}, (new Date(data.gas.timestamp)).getTime() / 1000);
});

reader.on('error', function (err) {
	console.log('Error: ', err);
});
