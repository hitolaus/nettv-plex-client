/**
 * The context menu for media.
 * <p>
 * The media as watched/unwatched, rate it etc.
 * </p>
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {object} media The media object.
 * @param {object} [returnView] The view to return to
 */
function ContextMenuView(media, returnView) {

    var view = document.getElementById('context-menu');
    var active;

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
        var id = active.getAttribute('id');

        if (id === 'context-menu-watched') {
            plexAPI.watched(media.ratingKey);
        }
        else if (id === 'context-menu-unwatched') {
            plexAPI.unwatched(media.ratingKey);
        }
        else if (id === 'context-menu-resume') {
            window.view = new PlayerView(plexAPI.getURL(media.key), true, returnView);
        }
        else if (id === 'context-menu-play') {
            window.view = new PlayerView(plexAPI.getURL(media.key), false, returnView);
        }

        close();
    };
    this.onBack = function () {
        close();
    };
    this.onStop = function () {
        close();
    };

    this.render = function () {

        // Clear the previous data and set the title
        view.innerHTML = '<h1>Menu</h1>';

        var list = document.createElement('ul');

        if (!media.viewCount || media.viewOffset) {
            var watched = document.createElement('li');
            watched.setAttribute('id', 'context-menu-watched');

            watched.appendChild(document.createTextNode('Mark as watched'));
            list.appendChild(watched);
        }

        if (media.viewCount) {
            var unwatched = document.createElement('li');
            unwatched.setAttribute('id', 'context-menu-unwatched');

            unwatched.appendChild(document.createTextNode('Mark as unwatched'));
            list.appendChild(unwatched);
        }

        if (media.viewOffset && platform.canSeek(media)) {
            var resume = document.createElement('li');
            resume.setAttribute('id', 'context-menu-resume');

            resume.appendChild(document.createTextNode('Resume from ' + Time.format(media.viewOffset)));
            list.appendChild(resume);
        }

        var play = document.createElement('li');
        play.setAttribute('id', 'context-menu-play');

        play.appendChild(document.createTextNode('Play from here'));
        list.appendChild(play);

        view.appendChild(list);

        active = list.firstChild;
        DOM.addClass(active, 'active');

        show();
    };

    // Make self-rendering
    this.render();
}