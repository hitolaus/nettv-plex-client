function keydownHandler(e) {

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
            break;
        case VK_STOP:
            if (window.view.onStop) {
                window.view.onStop();
            }
            break;
        case VK_PLAY:
            if (window.view.onPlay) {
                window.view.onPlay();
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
