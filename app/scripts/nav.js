/**
 * TODO: Move common versions out
 */
function VerticalFixedScrollMenu(menuId, activeId) {

    var menu = document.getElementById(menuId);
    var current = document.getElementById(activeId);

    if (Settings.useAnim()) {
        DOM.addClass(menu, 'vertical-transtion');
    }

    var incr = 0;
    if (current !== null) {
        incr = current.offsetHeight;
    }

    function setCurrentElement(elem) {
        current.removeAttribute('id');
        current = elem;
        current.setAttribute('id', activeId);
    }

    this.onmenuright = function() {};
    this.onmenuleft = function() {};
    this.onmenuup = function() {};
    this.onmenudown = function() {};

    this.current = function() {
        return current;
    };
    this.reload = function() {
        menu.style.top = 0;
        current = document.getElementById(activeId);
        if (current !== null) {
            incr = current.offsetHeight;
        }
    };
    this.activate = function() {
        DOM.addClass(menu, 'current-scroller');
    };
    this.deactivate = function() {
        DOM.removeClass(menu, 'current-scroller');
    };
    this.left = function() {
        this.onmenuleft({ element: current, boundary: true });
    };
    this.right = function() {
        this.onmenuright({ element: current, boundary: true });
    };
    this.up = function() {
        var prev = DOM.getPreviousElement(current);
        //var prev = DOM.getPreviousElement(document.getElementById(activeId));
        if (prev === null) {
            this.onmenuup({ element: current, boundary: true });
            return;
        }

        setCurrentElement(prev);

        menu.style.top = parseInt(menu.style.top, 10) + incr + 'px';
        this.onmenuup({ element: current, boundary: false });
    };
    this.down = function() {
        var next = DOM.getNextElement(current);
        //var next = DOM.getNextElement(document.getElementById(activeId));
        if (next === null) {
            this.onmenudown({ element: current, boundary: true });
            return;
        }

        setCurrentElement(next);

        menu.style.top = parseInt(menu.style.top, 10) - incr + 'px';
        this.onmenudown({ element: current, boundary: false });
    };
}

function HorizontalFixedScrollMenu(menuId, activeId) {
    var menu = document.getElementById(menuId);
    var current = document.getElementById(activeId);

    if (Settings.useAnim()) {
        DOM.addClass(menu, 'horizontal-transition');
    }

    var incr = 0;

    function setCurrentElement(elem) {
        current.removeAttribute('id');
        current = elem;
        current.setAttribute('id', activeId);
    }

    function getCurrentElementWidth(elem) {
        var computedStyle = getComputedStyle(current, null);

        var leftMargin  = parseInt(computedStyle.marginLeft,  10);
        var rightMargin = parseInt(computedStyle.marginRight, 10);

        return current.offsetWidth + leftMargin + rightMargin;
    }

    this.onmenuright = function() {};
    this.onmenuleft = function() {};
    this.onmenuup = function() {};
    this.onmenudown = function() {};

    this.current = function() {
        return current;
    };
    this.reload = function() {
        menu.style.left = 0;
        current = document.getElementById(activeId);
        if (current !== null) {
            incr = getCurrentElementWidth(current);
        }
    };
    this.activate = function() {
        DOM.addClass(menu, 'current-scroller');
    };
    this.deactivate = function() {
        DOM.removeClass(menu, 'current-scroller');
    };
    this.left = function() {
        var prev = DOM.getPreviousElement(current);
        if (prev === null) {
            this.onmenuleft({ element: current, boundary: true });
            return;
        }

        setCurrentElement(prev);

        menu.style.left = parseInt(menu.style.left, 10) + incr + 'px';
        this.onmenuleft({ element: current, boundary: false });
    };
    this.right = function() {
        var next = DOM.getNextElement(current);
        if (next === null) {
            this.onmenuright({ element: current, boundary: true });
            return;
        }

        setCurrentElement(next);

        menu.style.left = parseInt(menu.style.left, 10) - incr + 'px';
        this.onmenuright({ element: current, boundary: false });
    };
    this.up = function() {
        this.onmenuup({ element: current, boundary: true });
    };
    this.down = function() {
        this.onmenudown({ element: current, boundary: true });
    };


    if (current !== null) {
        incr = getCurrentElementWidth(current);
    }
}

function SimpleListMenu(maxElements) {
    var list, current;
    var i = 0;

    maxElements = maxElements || -1;

    function setCurrentElement(elem) {
        DOM.removeClass(current, 'active');
        current = elem;
        DOM.addClass(current, 'active');
    }

    this.init = function(menu) {
        list = menu;

        if (!current) {
            var firstElement = DOM.getFirstElement(list);
            if (firstElement) {
                setCurrentElement(firstElement);
            }
        }
        else {
            setCurrentElement(DOM.getNthElement(list, i));
        }
    };
    this.reset = function () {
        DOM.removeClass(current, 'active');
    };


    this.current = function () {
        return current;
    };
    this.prev = function () {
        if (!list) {
            throw 'Navigation not initialized';
        }

        var prev;
        if (current) {
            prev = DOM.getPreviousElement(current);
        }
        else {
            prev = DOM.getFirstElement(list);
        }

        if (prev === null) {
            return;
        }

        if (maxElements > -1) {
            var top = parseInt(list.style.top, 10) || 0;
            i--;
            if (i < 0) {
                // 2 is the margin
                list.style.top = (top + current.offsetHeight + 2) + 'px';
                i = 0;
            }
        }
        setCurrentElement(prev);
    };

    this.next = function() {
        if (!list) {
            throw 'Navigation not initialized';
        }

        var next;
        if (current) {
            next = DOM.getNextElement(current);
        }
        else {
            next = DOM.getFirstElement(list);
        }

        if (next === null) {
            return;
        }

        if (maxElements > -1) {
            var top = parseInt(list.style.top, 10) || 0;
            i++;
            if (i > maxElements-1) {
                // 2 is the margin
                list.style.top = (top - current.offsetHeight - 2) + 'px';
                i = maxElements-1;
            }
        }
        setCurrentElement(next);
    };
}