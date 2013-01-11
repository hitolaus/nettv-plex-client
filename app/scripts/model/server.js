/**
 * Represent a server which is returned from myPlex.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {object} XML node from the myPlex servers endpoint
 */
function Server(elem) {
    var name = elem.getAttribute('name');
    var host = elem.getAttribute('host');
    var port = elem.getAttribute('port');

    return {
        name: name,
        host: host,
        port: port
    };
}

/**
 * Wrapper for parsing the servers array.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {object} XML node from the myPlex servers endpoint
 */
function Servers(elem) {

    var servers = [];

    var children = elem.childNodes;
    var n = children.length;
    for (var i = 0; i < n; i++) {
        var e = children[i];

        if (e.nodeName === 'Server') {
            servers.push(new Server(e));
        }

    }

    return {
        servers: servers
    };
}