var ARKeyboardControll = {
	init: function (showConfigLabel, slides, funcOverride, configOverride) {
		var configLabel = null;
		var config = {
			isMarkerFrozen: false,
			deltaValue: 0.1,
			position: {
				x: 0,
				y: 0,
				z: 0
			},
			scale: 1
		};
		if (configOverride) {
			config = configOverride;
		}

		if (showConfigLabel) {
			configLabel = document.createElement('label');
			configLabel.setAttribute('style', 'position:absolute; top: 10px; left:10px; width:100%;');
			configLabel.innerText = JSON.stringify(config);
			document.querySelector('body').appendChild(configLabel);
		}

		document.addEventListener('keydown', function (event) {
			switch (event.key) {
				case ' ':
					toggleMarkerTracking();
					break;
				case 'q':
					changeDefaultPosition('x', config.deltaValue);
					break;
				case 'a':
					changeDefaultPosition('x', -config.deltaValue);
					break;
				case 'w':
					changeDefaultPosition('y', config.deltaValue);
					break;
				case 's':
					changeDefaultPosition('y', -config.deltaValue);
					break;
				case 'e':
					changeDefaultPosition('z', config.deltaValue);
					break;
				case 'd':
					changeDefaultPosition('z', -config.deltaValue);
					break;
				case 'z':
					changeDefaultScale(config.deltaValue);
					break;
				case 'x':
					changeDefaultScale(-config.deltaValue);
					break;
				case 'ArrowRight':
					changeSlide(1);
					break;
				case 'ArrowLeft':
					changeSlide(-1);
					break;
				case 'Enter':
					changeSlide(0);
					break;
			}

			if (configLabel != null) {
				configLabel.innerText = JSON.stringify(config);
			}
		}, false);

		var containerItem = document.querySelector('#container');
		var changeDefaultPosition = function (axis, value) {
			config.position[axis] += value;
			config.position[axis] = Math.round(config.position[axis] * 10) / 10;
			containerItem.setAttribute('position', config.position.x + ' ' + config.position.y + ' ' + config.position.z);
		};

		var changeDefaultScale = function (value) {
			config.scale += value;
			config.scale = Math.round(config.scale * 10) / 10;
			if (funcOverride && typeof funcOverride.scale === 'function') {
				funcOverride.scale(config.scale);
				return 0;
			}
			containerItem.setAttribute('scale', config.scale + ' ' + config.scale + ' ' + config.scale);
		};

		var camera = document.querySelector('a-scene a-marker-camera');
		var toggleMarkerTracking = function () {
			if (camera) {
				if (config.isMarkerFrozen === true) {
					config.isMarkerFrozen = false;
					camera.addToParent();
				} else {
					config.isMarkerFrozen = true;
					camera.removeFromParent();
				}
			}
		};

		// set initial state:
		var init = function () {
			changeDefaultPosition(0);
			changeDefaultScale(0)
		};

		// slides functionality
		var slideIndex = -1;
		var changeSlide = function (delta) {
			var nextIndex = slideIndex + delta;
			if (nextIndex < -1 || nextIndex > slides.length) {
				return;
			}

			if (delta == 0) {
				// start additional animation for current slide if exist
				if (slides[slideIndex].additionalAnimation && slides[slideIndex].additionalAnimation.length > 0) {
					for (var i = 0; i < slides[slideIndex].additionalAnimation.length; ++i) {
						var animation = slides[slideIndex].additionalAnimation[i];
						document.getElementById(animation.itemId).dispatchEvent(new CustomEvent(animation.startEvent));
					}
				}

				return;
			}

			// hide current item
			if (slideIndex > -1 && slideIndex < slides.length) {
				var hideEntity = document.getElementById(slides[slideIndex].id);
				hideEntity.dispatchEvent(new CustomEvent('stopAppearing'));
				hideEntity.setAttribute('isHiding', 'true');
				hideEntity.dispatchEvent(new CustomEvent('startHiding'));
				setTimeout(function () {
					if (hideEntity.getAttribute('isHiding') == 'true') {
						hideEntity.setAttribute('visible', 'false');
						hideEntity.removeAttribute("isHiding");
					}
				}, slides[slideIndex].hideDur);
			}

			// show next item
			if (nextIndex > -1 && nextIndex < slides.length) {
				var showEntity = document.getElementById(slides[nextIndex].id);
				showEntity.removeAttribute("isHiding");
				showEntity.setAttribute('visible', 'true');
				showEntity.dispatchEvent(new CustomEvent('stopHiding'));
				showEntity.dispatchEvent(new CustomEvent('startAppearing'));
			}

			slideIndex = nextIndex;
		}

		init();
	}
}