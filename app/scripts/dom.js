function DOM() {}

DOM.isElement = function(node) {
    return node.nodeType === 1;
};

DOM.getParent = function(elem) {
    var parent = elem.parentNode;
    while (true) {
        if (parent === null) {
            return null;
        }
        if (!this.isElement(parent)) {
          parent = parent.parentNode;
        }
        else {
            return parent;
        }
    }
};
DOM.getFirstElement = function (elem) {
    var first = elem.firstChild;
    while (true) {
        if (first === null) {
            return null;
        }
        if (!this.isElement(first)) {
          first = first.nextSibling;
        }
        else {
            return first;
        }
    }
};
DOM.getPreviousElement = function (elem) {
    if (!elem) {
        return null;
    }
    var prev = elem.previousSibling;
    while (true) {
        if (prev === null) {
            return null;
        }
        if (!this.isElement(prev)) {
          prev = prev.previousSibling;
        }
        else {
            return prev;
        }
    }
};
DOM.getNextElement = function(elem) {
    if (!elem) {
        return null;
    }
    var next = elem.nextSibling;
    while (true) {
        if (next === null) {
            return null;
        }
        if (!this.isElement(next)) {
          next = next.nextSibling;
        }
        else {
            return next;
        }
    }
};

DOM.hasClass = function(elem, className) {
    if (!elem) {
        return null;
    }
    return elem.className.indexOf(className) > -1;
};
/**
 * TODO: Make proper implementation
 */
DOM.addClass = function(elem, className) {
    if (!elem) {
        return null;
    }
    if (!DOM.hasClass(elem,className)) {
        elem.className = className;
    }
};
/**
 * TODO: Make proper implementation
 */
DOM.removeClass = function(elem, className) {
    if (!elem) {
        return null;
    }
    if (DOM.hasClass(elem, className)) {
        elem.className = '';
    }
};
