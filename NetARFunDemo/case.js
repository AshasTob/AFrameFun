window.onload = function () {

    var slideIndex = -1;

    var interval = setInterval(function () {
        changeSlide(1);
        console.log(slideIndex)
        if (slideIndex == slides.length) {

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

            slideIndex = -1;
        }

    }, 3000);


    var slides = [{
        id: 'slide1',
        hideDur: 0
    }, {
        id: 'slide2',
        hideDur: 0
    }, {
        id: 'slide3',
        hideDur: 0
    }, {
        id: 'slide4',
        hideDur: 0
    }, {
        id: 'slide5',
        hideDur: 0
    }];

    
    var changeSlide = function (delta) {
        var nextIndex = slideIndex + delta;
        console.log("nextIndex:" + nextIndex)
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

}