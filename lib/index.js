'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function () {
    return {
        noColors: true,
        failed: 0,
        skipped: 0,
        lastSuiteName: null,

        reportTaskStart: function reportTaskStart(startTime, userAgents, testCount) {
            this.write('Starting test run!').newline().setIndent(4).write('Start Time: ' + startTime).newline().write('User Agents: ' + userAgents).newline().write('Test Count: ' + testCount).newline().setIndent(0);
        },

        reportFixtureStart: function reportFixtureStart(name) {
            if (this.lastSuiteName) {
                this.write('##teamcity[testSuiteFinished name=\'' + escape(this.lastSuiteName) + '\']').newline();
            }
            this.write('##teamcity[testSuiteStarted name=\'' + escape(name) + '\']').newline();
            this.lastSuiteName = name;
        },

        reportTestDone: function reportTestDone(name, testRunInfo, meta) {
            var _this = this;

            this.write('##teamcity[testStarted name=\'' + escape(name) + '\']').newline();
            if (testRunInfo.skipped) {
                this.skipped++;
                this.write('##teamcity[testIgnored name=\'' + escape(name) + '\' message=\'skipped\']').newline();
                return;
            }
            if (testRunInfo.errs && testRunInfo.errs.length > 0) {
                this.failed++;
                this.write('##teamcity[testFailed name=\'' + escape(name) + '\' message=\'' + 'Test Failed' + '\' captureStandardOutput=\'true\' ' + 'details=\'' + escape(this.renderErrors(testRunInfo.errs)) + '\']').newline();
            }

            if (meta.reporterExtra) {
                meta.reporterExtra.forEach(function (metaData) {
                    _this._writeMetaData(metaData);
                });
            }

            this.write('##teamcity[testFinished name=\'' + escape(name) + '\' duration=\'' + testRunInfo.durationMs + '\']').newline();
        },

        reportTaskDone: function reportTaskDone(endTime, passed, warnings) {
            if (this.lastSuiteName) {
                this.write('##teamcity[testSuiteFinished name=\'' + escape(this.lastSuiteName) + '\']').newline();
            }
            this.write('Test Run Completed:').newline().setIndent(4).write('End Time: ' + endTime).newline().write('Tests Passed: ' + passed).newline().write('Tests Failed: ' + this.failed).newline().write('Tests Skipped: ' + this.skipped).newline().write('Warnings:\n ' + warnings.join('\n\t\t')).newline().setIndent(0);
        },

        renderErrors: function renderErrors(errors) {
            var _this2 = this;

            return errors.reduce(function (string, err) {
                return string + '\n' + _this2.formatError(err, '') + '\n\n';
            }, "");
        },

        _writeMetaData: function _writeMetaData(_ref) {
            var name = _ref.name;
            var type = _ref.type;
            var value = _ref.value;

            this.write('##teamcity[testMetadata name=\'' + name + '\' type=\'' + type + '\' value=\'' + value + '\']').newline();
        }
    };
};

var escape = function escape(str) {
    if (!str) return '';
    return str.toString().replace(/\x1B.*?m/g, '').replace(/\|/g, '||').replace(/\n/g, '|n').replace(/\r/g, '|r').replace(/\[/g, '|[').replace(/\]/g, '|]').replace(/\u0085/g, '|x').replace(/\u2028/g, '|l').replace(/\u2029/g, '|p').replace(/'/g, '|\'');
};
module.exports = exports['default'];