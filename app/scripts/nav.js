/**
 * TODO: Move common versions out
 */
function VerticalFixedScrollMenu(menuId, activeId) {
    
    var menu = document.getElementById(menuId);
    var current = document.getElementById(activeId);

    var incr = 61; // TODO: Calc this value

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
    
    var incr = 140; // TODO: Calc this value

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
        menu.style.left = 0;
        current = document.getElementById(activeId);
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
}