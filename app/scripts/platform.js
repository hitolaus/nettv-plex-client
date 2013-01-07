/**
 * Abstracts platform capabilities.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @contructor
 */
function Platform(browser) {
    var ua = browser.userAgent;

    function isWebkit() {
        return ua.indexOf('WebKit') > -1;
    }
    function isNetTV() {
        return ua.indexOf('NETTV') > -1;
    }

    /**
     * Returns whether or not the platform supports transisions/animations.
     *
     * @returns <code>true</code> if the platform support transitions.
     */
    this.isTransitionSupported = function() {
        if (isNetTV()) {
            return false;
        }
        return true;
    };

    /**
     * Add a transition to an element if transisions are supported.
     *
     * @param {object} elem the element where the transition should be added
     * @param {string} time the amount of time the transision should take for example '500ms'
     * @param {string} style the CSS style it should act upon for example 'bottom'
     */
    this.addTransition = function(elem, time, style) {
        if (!this.isTransitionSupported()) {
            return;
        }

        if (isWebkit()) {
            elem.style.webkitTransition = style + ' ' + time + ' ease';
        }
    };

    /**
     * Returns whether or not the platform can play media file natively or the media
     * file should be transcoded.
     *
     * @returns <code>true</code> if the player can play the media
     */
    this.isSupported = function(media) { return true; };

    /**
     * Returns whether or not the platform can seek in the media file.
     *
     * @returns <code>true</code> if the player can seek in the media type
     */
    this.canSeek = function(media) { return true; };
}

window.platform = new Platform(navigator);