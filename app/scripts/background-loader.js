/**
 * Loads the background.
 * <p>
 * Works by switching between two image tag which have CSS3 transitions. This
 * allows a smooth background change.
 * </p>
 *
 * @author Jakob Hilarius, http://syscall.dk
 *
 * @constructor
 * @param {string} backgroundId1 Id of the first image tag
 * @param {string} backgroundId2 Id of the second image tag
 * @param {number} [width] the width of the image used for scaling. Default 1280
 * @param {number} [height] the height of image used for scaling. Default 720
 */
function BackgroundLoader(backgroundId1, backgroundId2, width, height) {
    var bg1 = document.getElementById(backgroundId1),
        bg2 = document.getElementById(backgroundId2);

    width = width || 1280;
    height = height || 720;

    if (Settings.useAnim()) {
        // Smooth the background change using transitions
        platform.addTransition(bg1, '100ms', 'opacity');
        platform.addTransition(bg2, '100ms', 'opacity');
    }

    /**
     * Set the new background if it has changed. It sets the background image on the
     * non-visible image element and changes opacity to allow a CSS transition.
     *
     * @param {String} url The background url without Plex server address.
     */
    this.load = function(url) {
        if (url) {
            var scaledBackground = plexAPI.getScaledImageURL(plexAPI.getURL(url), width, height);

            if (bg2.style.opacity === '0') {
                if (bg2.src !== scaledBackground) {
                    bg2.src = scaledBackground;
                }

                bg2.style.opacity = 1;
            }
            else {
                if (bg1.src !== scaledBackground) {
                    bg1.src = scaledBackground;
                }
                bg2.style.opacity = 0;
            }
        }
    };
}