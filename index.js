exorts = module.exports = interactiveHtmlReporter;

var fs = require('fs');
var jquery = fs.readFileSync(__dirname + '/lib/jquery.js');
var script = fs.readFileSync(__dirname + '/lib/script.js');

var Base, log;

if (typeof window === 'undefined') {
    //running in Node
    Base = require('mocha').reporters.Base;
    log = console.log;
} else {
    // running in mocha-phantomjs
    Base = require('./base');
    log = function(msg) {
        process.stdout.write(msg + "\n");
    };
}

function interactiveHtmlReporter(runner) {
    Base.call(this, runner);
    var stats = this.stats;

    var passes = 0;
    var failures = 0;
    var indentLevel = 0;
    var outputFile = '<html>';

    outputFile += '<head><script type="text/javascript">' +
        jquery +
        '</script>';

    outputFile += '<head><script type="text/javascript">' +
        script +
        '</script>';

    outputFile += '<style>' +
        '.pass { color: green; }' +
        '.fail { color: red; }' +
        '.suite.open:before {content: ">"}' +
        '.suite.closed:before {content: "^"}' +
        '</style></head><body>';

    function insertSuiteStart(suite) {
        indentLevel++;
        if (indentLevel > 1) {
            outputFile += '<div class="suite open" ' +
                'style="padding-left: ' + indentLevel * 10 + 'px">' +
                suite.title;
        }
    }

    function insertSuiteEnd() {
        indentLevel--;
        outputFile += '</div>';
    }

    function insertPassingTest(test) {
        passes++;
        outputFile += '<div class="pass">' +
            test.title +
            '</div>';
    }

    function insertFailingTest(test, err) {
        failures++;
        outputFile += '<div class="fail">' +
            test.title +
            '<br />' +
            err +
            '</div>';
    }

    runner.on('suite', insertSuiteStart);
    runner.on('suite end', insertSuiteEnd);
    runner.on('pass', insertPassingTest);
    runner.on('fail', insertFailingTest);

    runner.on('end', function() {
        outputFile += "</body></html>";
        if (!fs.existsSync('./artifacts')) {
            fs.mkdirSync('./artifacts');
        }
        if (!fs.existsSync('./artifacts/mocha')) {
            fs.mkdirSync('./artifacts/mocha');
        }

        fs.writeFileSync('./artifacts/mocha/index.html', outputFile);
    });
}
