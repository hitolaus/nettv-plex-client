/**
 * Logging abstraction.
 *
 * @constructor
 * @param {number} level The level to initialize the looger. The higher the level the more verbose logger.
 */
function Logger(globalLevel) {

    function log (level, msg) {
        if (level <= globalLevel) {
            console.log(msg);
        }
    }

    this.debug = function(msg) {
        log(1000, msg);
    };
    this.info = function(msg) {
        log(100, msg);
    };
    this.warn = function(msg) {
        log(10, msg);
    };
    this.error = function(msg) {
        log(5, msg);
    };
    this.fatal = function(msg) {
        log(0, msg);
    };
}
