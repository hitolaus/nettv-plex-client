function PreferencesView() {
    var ACTIVE_RADIO_BTN = '<img src="images/LEDOn.png" alt="" />';
    var INACTIVE_RADIO_BTN = '<img src="images/LEDOff.png" alt="" />';

    var preferencesView = document.getElementById('preferences');

    var list = document.getElementById('pref-system-list');
    var current = null;

    function show() {
        preferencesView.style.display = 'block';
    }
    function hide() {
        DOM.removeClass(current, 'active');
        preferencesView.style.display = 'none';
    }
    function close() {
        window.view = new HomeView();
        window.view.reload();
        hide();
    }
    function setCurrentElement(elem) {
        DOM.removeClass(current, 'active');
        current = elem;
        DOM.addClass(current, 'active');
    }


    function loadSettings() {
        document.getElementById('pref-pms-address').innerHTML = Settings.getPMS();

        document.getElementById('pref-anim-enabled').innerHTML = ACTIVE_RADIO_BTN;
        document.getElementById('pref-debug-enabled').innerHTML = (Settings.getDebug()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;

        document.getElementById('pref-debug-uuid').innerHTML = ' (' + Settings.getDebugUUID() + ')';
    }

    this.onEnter = function () {
        if (!current) {
            return;
        }

        var val = current.getElementsByClassName('value')[0];
        var id = val.id;

        if (id === 'pref-pms-address') {
            window.view = new SettingsView(this);
            window.view.render();
        }
        else if (id === 'pref-debug-enabled') {
            Settings.setDebug(!Settings.getDebug());
            document.getElementById('pref-debug-enabled').innerHTML = (Settings.getDebug()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;
        }
    };
    this.onBack = function () {
        close();
    };
    this.onLeft = function () {
        close();
    };
    this.onRight = function () {};
    this.onUp = function () {
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

        setCurrentElement(prev);
    };
    this.onDown = function () {
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

        setCurrentElement(next);
    };

    this.reload = function () {};
    this.render = function () {
        loadSettings();
        show();
    };

}