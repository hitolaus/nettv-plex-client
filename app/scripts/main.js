function keydownHandler(e) {
    console.log('key: ' + e.keyCode);
	switch (e.keyCode) {
		case VK_UP:
            window.view.onUp();
			break;
        case VK_RIGHT:
            window.view.onRight();
            break;
		case VK_DOWN:
            window.view.onDown();
			break;
        case VK_LEFT:
            window.view.onLeft();
            break;
        case VK_ENTER:
            window.view.onEnter();
            break;
        case VK_BACK:
            window.view.onBack();

            console.log('Current view: ' + window.view.constructor);

            // Prevent the app from quitting on back (unless we are at the homeview)
            if (!(window.view instanceof HomeView)) {
                console.log('STOOOPPPP');
                e.preventDefault();
            }

            break;
		default:
			break;
	}
}

function init() {
    document.addEventListener('keydown', keydownHandler, true);

    var initialized = Settings.init();
    if (!initialized) {
        window.view = new SettingsView();
    }
    else {
        window.view = new HomeView();
    }
    window.view.render();
}
