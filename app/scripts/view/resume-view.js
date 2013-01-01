/**
 * The resume dialog where the user can select to start from the begining or
 * resume from the previous position.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {string} uri The PLex API address of the video meta data.
 * @param {number} viewOffset The position to start from
 * @param {object} [returnView] The view to return to
 */
function ResumeView(uri, viewOffset, returnView) {

    var view = document.getElementById('resume');
    var active = document.getElementById('resume-offset');

    function show() {
        view.style.display = 'block';
    }
    function hide() {
        DOM.removeClass(active, 'active');
        view.style.display = 'none';
    }
    function close() {
        if (!returnView) {
            window.view = new HomeView();
        }
        else {
            window.view = returnView;
        }
        window.view.reload();
        hide();
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

        window.view = new PlayerView(uri, useViewoffset, returnView);
        hide();
	};
	this.onBack = function () {
        close();
	};
    this.onStop = function () {
        close();
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