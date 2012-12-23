/**
 * Add HTML encode function to String.
 *
 * @returns {String} the HTML encoded string
 */
String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;');
};