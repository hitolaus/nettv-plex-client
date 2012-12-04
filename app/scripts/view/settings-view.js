function SettingsView() {
	this.activeDigitIdx = 0;

	this.getServerDisplayAddress = function() {
		var displayString = "";
	
		var address = Settings.getPMS();
		
		if (address != null) {
			var components = address.split('.');
			
			for (var i = 0; i < components.length; i++) {
				if (i > 0) displayString += '.';
			
				var component = components[i];
				if (component.length == 3) {
					displayString += '<span class="digit">'+component.charAt(0)+'</span><span class="digit">'+component.charAt(1)+'</span><span class="digit">'+component.charAt(2)+'</span>';
				}
				else if (component.length == 2) {
					displayString += '<span class="digit">0</span><span class="digit">'+component.charAt(0)+'</span><span class="digit">'+component.charAt(1)+'</span>';
				}
				else if (component.length == 1) {
					displayString += '<span class="digit">0</span><span class="digit">0</span><span class="digit">'+component.charAt(0)+'</span>';
				}
			}
		}
		else {
			for (var i = 0; i < 4; i++) {
				if (i > 0) displayString += '.';
				displayString += '<span class="digit">0</span><span class="digit">0</span><span class="digit">0</span>';
			}
		}
		return displayString;
	}
	this.moveDigit = function(direction) {
		// Remove the old active element
		$('.digit#active').removeAttr('id');
		
		this.activeDigitIdx += direction;
		
		var c = $('#address').children();
		
		// Overflow in the bottom
		if (this.activeDigitIdx < 0) this.activeDigitIdx = c.length-1;
		// Overflow in the top
		if (this.activeDigitIdx >= c.length) this.activeDigitIdx = 0;
		
		$(c[this.activeDigitIdx]).attr('id', 'active');
	}
	this.incrementDigit = function(value) {
		var currentValue = parseInt($('.digit#active').html());
		var newValue = currentValue + value;
		
		if (newValue >= 0 && newValue <= 9) {
			$('.digit#active').html(newValue);
		}
	}
	this.getAddressAsString = function() {
		var address = "";
	
		var digits = $('#address').find('.digit');
		var foundNonZero = false;
		for (var i = 0; i < digits.length; i++) {
			var digit = digits[i].innerHTML;
			
			if (digit != 0) {
				foundNonZero = true;
			}
			
			if (foundNonZero) {
				address += digit;
			}
			
			if ((i + 1) % 3 == 0 && i+1 < digits.length) {
				foundNonZero = false;
				if (address.charAt(address.length-1) == '.') {
					address += '0';
				}
				address += '.';
			}
		}
		return address;
	}
	this.validate = function() {
		var address = this.getAddressAsString();
		console.log('Address: ' + address);
		return plexAPI.ping(address);
	}

	this.display();
}

SettingsView.prototype.render = function() {
	$('#container').empty();
	
	var settings = $('<div id="settings"></div>');
	
	settings.append('<div id="warning"></div>');
	settings.append('<h1>Plex Media Server address</h1>');
	settings.append('<div id="address">'+this.getServerDisplayAddress()+'</div>');
	settings.append('<h2>Press Back to save settings</h2>');
	
	settings.find('.digit').first().attr('id', 'active');
	
	$('#container').append(settings);
}


SettingsView.prototype.onEnter = function() {
	this.moveDigit(1);
}

SettingsView.prototype.onBack = function() {
	if (this.validate()) {
		Settings.setPMS(this.getAddressAsString());
		console.log('Creating section view');
		window.view = new SectionView();
	}
	else {
		$('#warning').html('Invalid ip address');
	}
}

SettingsView.prototype.onRight = function() {
	this.moveDigit(1);
}
   
SettingsView.prototype.onLeft = function() {
	this.moveDigit(-1);
}

SettingsView.prototype.onUp = function() {
	this.incrementDigit(1);
}

SettingsView.prototype.onDown = function() {
	this.incrementDigit(-1);
}

