/**
 * Preferences view.
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 */
function PreferencesView() {
    var ACTIVE_RADIO_BTN = '<img src="images/LEDOn.png" alt="" />';
    var INACTIVE_RADIO_BTN = '<img src="images/LEDOff.png" alt="" />';

    var preferencesView = document.getElementById('preferences');

    var nav = new SimpleListMenu();
    nav.init(document.getElementById('pref-system-list'));

    function show() {
        preferencesView.style.display = 'block';
    }
    function hide() {
        nav.reset();
        preferencesView.style.display = 'none';
    }
    function close() {
        window.view = new HomeView();
        window.view.reload();
        hide();
    }


    function loadSettings() {
        document.getElementById('pref-pms-address').innerHTML = Settings.getPMS();

        document.getElementById('pref-anim-enabled').innerHTML = (Settings.useAnim()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;
        document.getElementById('pref-debug-enabled').innerHTML = (Settings.getDebug()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;

        document.getElementById('pref-debug-uuid').innerHTML = ' (' + Settings.getDebugUUID() + ')';
    }

    this.onEnter = function () {
        if (!nav.current()) {
            return;
        }

        var val = nav.current().getElementsByClassName('value')[0];
        var id = val.id;

        if (id === 'pref-pms-address') {
            window.view = new SettingsView(this);
            window.view.render();
        }
        else if (id === 'pref-debug-enabled') {
            Settings.setDebug(!Settings.getDebug());
            document.getElementById('pref-debug-enabled').innerHTML = (Settings.getDebug()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;
        }
        else if (id === 'pref-anim-enabled') {
            Settings.setAnim(!Settings.useAnim());
            document.getElementById('pref-anim-enabled').innerHTML = (Settings.useAnim()) ? ACTIVE_RADIO_BTN : INACTIVE_RADIO_BTN;
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
        nav.prev();
    };
    this.onDown = function () {
        nav.next();
    };

    this.reload = function () {};
    this.render = function () {
        loadSettings();
        show();
    };

}