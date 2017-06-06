var argv = require('minimist')(process.argv.slice(2));
var serialPort = argv.hasOwnProperty('port') ? argv.port : '/dev/TTYUSB0';

var P1Reader = require('p1-reader');
var reader = new P1Reader({serialPort: serialPort, debug: false});

reader.on('reading', function (data) {
	process.stdout.write(JSON.stringify(data) + '\n');
	process.exit(0);
});

reader.on('error', function (err) {
	console.error(err);
	process.exit(1);
});
