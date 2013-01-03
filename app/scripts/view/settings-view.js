function SettingsView(returnView) {
    var settingsView = document.getElementById('settings');

    function show() {
        settingsView.style.display = 'block';
    }
    function hide() {
        settingsView.style.display = 'none';
    }
    function close() {
        if (Settings.getPMS()) {
            if (!returnView) {
                window.view = new HomeView();
                window.view.reload();
            }
            else {
                window.view = returnView;
            }
            hide();
        }
    }

	function getAddressAsString() {
		var address = '';

		var digits = document.getElementsByTagName('input');

        var n = digits.length;
		for (var i = 0; i < n; i++) {
			var digit = digits[i].value;

            if (i > 0) {
                address += '.';
            }

            address += digit;
		}
		return address;
	}


    this.onEnter = function () {
        var activeElement = document.querySelector('input:focus');
        var activeId = activeElement.getAttribute('id');
        var lastValueEntered = activeId === 'c4' && activeElement.value !== '';

        if (lastValueEntered) {
            var address = getAddressAsString();
            return plexAPI.ping(address, function(valid) {
                if (valid) {
                    Settings.setPMS(address);
                    window.location.reload();
                }
                else {
                    document.getElementById('c1').focus();
                    document.getElementById('address-error').innerHTML = 'No Plex Media Server found at the address';
                }
            });
        }
        else {
            if (activeElement.value !== '') {
                var cnt = activeId.substring(1);
                var nextId = 'c'+(parseInt(cnt, 10)+1);
                document.getElementById(nextId).focus();
            }
        }
    };
    this.onBack = function () {
        close();
    };
    this.onStop = function () {
        close();
    };

    this.onLeft = function () {};
    this.onRight = function () {};
    this.onUp = function () {};
    this.onDown = function () {};

    this.reload = function () {};
    this.render = function () {
        var address = '<input type="text" name="c1" id="c1" maxlength="3" />.' +
                      '<input type="text" name="c2" id="c2" maxlength="3" />.' +
                      '<input type="text" name="c3" id="c3" maxlength="3" />.' +
                      '<input type="text" name="c4" id="c4" maxlength="3" />';


        var heading = '<h1>Enter address of Plex Media Server</h1>';
        var error = '<p id="address-error"></p>';

        settingsView.innerHTML = '<div id="address">' + heading + address + error + '</div>';

        setTimeout(function() {
            document.getElementById('c1').focus();
        }, 0);

        show();
    };
}

