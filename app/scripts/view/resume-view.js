function ResumeView(uri, viewOffset) {
    
    var view = document.getElementById('resume');
    var active = document.getElementById('resume-offset');
    
    function show() {
        view.style.display = 'block';
    }
    function hide() {
        DOM.removeClass(active, 'active');
        view.style.display = 'none';     
    }
    
	this.onUp = function () {
        var prev = DOM.getPreviousElement(active);
        if (prev) {
            DOM.removeClass(active, 'active');
            DOM.addClass(prev, 'active');
            active = prev;
        }
	};
	this.onDown = function () {
        var next = DOM.getNextElement(active);
        if (next) {
            DOM.removeClass(active, 'active');
            DOM.addClass(next, 'active');
            active = next;
        }
	};
	this.onLeft = function () {
	};
	this.onRight = function () {
	};
	this.onEnter = function () {
        var useViewoffset = active.getAttribute('id') !== null;

        window.view = new PlayerView(uri, useViewoffset);
        hide();
	};
	this.onBack = function () {
        // TODO: Depends on where the user originates from
        window.view = new HomeView();
        window.view.reload();
        hide();
	};
    
	this.render = function () {
        var offsetString = Time.format(viewOffset);
        
        document.getElementById('resume-offset').innerHTML = 'Resume from ' + offsetString;
        
        DOM.addClass(active, 'active');
        
        show();
	};
    
    // Make self-rendering
    this.render();
}