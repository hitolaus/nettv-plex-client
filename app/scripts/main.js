function init() {

    document.addEventListener("keydown", keydownHandler, true);
    
	var initialized = Settings.init();
	
	if (!initialized) {
		//document.getElementById('settings').style.display = 'block';
	}
    
    window.view = new HomeView();
    window.view.render();
    
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none';
    }, 2000);
}


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
		default:
			break;
	}
}