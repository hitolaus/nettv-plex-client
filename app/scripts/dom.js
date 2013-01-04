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
DOM.getNthElement = function (parent, i) {
    if (!parent || i < 0) {
        return null;
    }
    var elem = parent.firstChild;
    while (true) {
        if (!elem) {
            return null;
        }

        if (i === 0) {
            return elem;
        }

        elem = elem.nextSibling;

        if (this.isElement(elem)) {
          i--;
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
        return false;
    }

    var classes = elem.className.split(' ');
    return classes.indexOf(className) > -1;
};

DOM.addClass = function(elem, className) {
    if (!elem) {
        return;
    }
    if (!DOM.hasClass(elem,className)) {
        elem.className = [elem.className, className].join(' ');
    }
};

DOM.removeClass = function(elem, className) {
    if (!elem) {
        return;
    }
    if (DOM.hasClass(elem, className)) {
        var classes = elem.className.split(' ');
        classes.splice(classes.indexOf(className), 1);

        elem.className = classes.join(' ');
    }
};
