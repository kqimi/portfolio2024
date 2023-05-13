ParallaxPageScroller = function (sectionElement, opts) {

    var self = this;
    this.wrapper = document;
    this.rootElm = null;
    this.sections = [];
    this.activeIndex = 0;
    this.options = {
        infinity: false,
        navigation: true,
        bindKeyboard: true,
        touchScroll: true,
        animationSpeed: '700',
        animationEase: 'ease-out',
        classSection: 'parallax-page-scroller__section',
        classNavigation: 'parallax-page-scroller__navigation',
        classNavigationItem: 'parallax-page-scroller__navigation__item',
        classNavigationItemActive: 'parallax-page-scroller__navigation__active',
        classScrollerActive: 'parallax-page-scroller__section__active'
    };

    this.touchPositionY = 0;
    this.lastAnimationExec = null;

    this.init = function () {

        self.sections[self.activeIndex].classList.add(self.options.classScrollerActive);

        if (self.options.navigation == true) {
            self._buildNavigation();
        }

        self._buildRoot();
        self._buildAnimation();
        self._eventsRegister();
    };

    this._eventsRegister = function () {

        window.addEventListener('resize', self._buildRoot);

        self.wrapper.addEventListener('mousewheel', self._mouseScrollHandler);
        self.wrapper.addEventListener('DOMMouseScroll', self._mouseScrollHandler);

        if (self.options.touchScroll == true) {
            self.wrapper.addEventListener('touchstart', self._touchStartHandler);
            self.wrapper.addEventListener('touchmove', self._touchMoveHandler);
        }

        if (self.options.bindKeyboard == true) {
            self.wrapper.addEventListener('keydown', self._keyboardKeysHandler);
        }

        [].forEach.call(self.wrapper.getElementsByClassName(self.options.classNavigationItem), function (el) {
            el.addEventListener('click', function () {
                self._activeByIndex(this.getAttribute('data-index'));
            });
        });
    };

    this._nextHandler = function () {

        var nextIndex = self.activeIndex + 1;

        if (nextIndex > (self.sections.length - 1)) {

            if (self.options.infinity == false) {
                return;
            }

            nextIndex = 0;
        }

        return self._activeByIndex(nextIndex);
    };

    this._prevHandler = function () {

        var prevIndex = self.activeIndex - 1;

        if (prevIndex < 0) {

            if (self.options.infinity == false) {
                return;
            }

            prevIndex = self.sections.length - 1;
        }

        return self._activeByIndex(prevIndex);
    };

    this._mouseScrollHandler = function (e) {

        e.preventDefault();

        var delta = e.detail < 0 || e.wheelDelta > 0 ? 1 : -1;

        if (delta < 0) {
            return self._nextHandler();
        }

        return self._prevHandler();
    };

    this._keyboardKeysHandler = function (event) {

        var arrowUp = 38;
        var arrowDown = 40;

        var getKey = function (e) {
            if (window.event) { return e.keyCode; }
            else if (e.which) { return e.which; }
        };

        var keyCode = getKey(event);

        if (keyCode == arrowUp) {
            return self._prevHandler();
        }

        if (keyCode == arrowDown) {
            return self._nextHandler();
        }

        return;
    };

    this._touchStartHandler = function (event) {
        self.touchPositionY = event.touches[0].clientY;
    };

    this._touchMoveHandler = function (event) {

        var lastTouchPositionY = event.changedTouches[0].clientY;

        if (self.touchPositionY > lastTouchPositionY + 10) {
            return self._nextHandler();
        }

        if (self.touchPositionY < lastTouchPositionY - 10) {
            return self._prevHandler();
        }
    };

    this._activeByIndex = function (index) {

        index = parseInt(index);

        if (index == self.activeIndex) {
            return;
        }

        if (self.lastAnimationExec != null) {

            var elapsedTime = new Date().getTime() - self.lastAnimationExec;

            if (elapsedTime <= self.options.animationSpeed) {
                return;
            }
        }

        self.sections[self.activeIndex].classList.remove(
            self.options.classScrollerActive
        );

        self.sections[index].classList.add(
            self.options.classScrollerActive
        );

        if (self.options.navigation == true) {
            var navigationCurrentItem = self.wrapper.getElementsByClassName(self.options.classNavigation)[0].children[self.activeIndex];
            navigationCurrentItem.classList.remove(self.options.classNavigationItemActive);

            var navigationItem = self.wrapper.getElementsByClassName(self.options.classNavigation)[0].children[index];
            navigationItem.classList.add(self.options.classNavigationItemActive);
        }

        self.activeIndex = index;
        self.lastAnimationExec = new Date().getTime();
    };

    this._buildRoot = function () {
        self.rootElm.style.height = window.innerHeight + 'px';
    };

    this._buildAnimation = function () {

        for (var i = 0; i < self.sections.length; i++) {
            var delay = (self.options.animationSpeed / 1000);
            self.sections[i].style.transition = 'all ' + delay + 's ' + self.options.animationEase;
        }
    };

    this._buildNavigation = function () {

        if (self.wrapper.getElementsByClassName(self.options.classNavigation).length > 0) {
            return;
        }

        var ulElm = self.wrapper.createElement('ul');
        ulElm.classList.add(self.options.classNavigation);

        for (var i = 0; i < self.sections.length; i++) {

            var aElm = self.wrapper.createElement('a');
            aElm.setAttribute('href', '#section-' + i);

            var liElm = self.wrapper.createElement('li');
            liElm.setAttribute('data-index', i);
            liElm.classList.add(self.options.classNavigationItem);

            liElm.appendChild(aElm);

            if (i == self.activeIndex) {
                liElm.classList.add(self.options.classNavigationItemActive);
            }

            ulElm.appendChild(liElm);
        }

        self.rootElm.appendChild(ulElm);
    };

    if (typeof opts == 'object') {
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                self.options[key] = opts[key];
            }
        }
    }

    self.rootElm = self.wrapper.querySelector(sectionElement);
    self.sections = self.rootElm.getElementsByClassName(self.options.classSection);

    if (self.sections.length > 0) {
        self.init();
    }

};

document.addEventListener('DOMContentLoaded', function () {
    var pps = new ParallaxPageScroller('[parallax-page-scroller]', {
        infinity: false,
        navigation: true,
        bindKeyboard: true,
        touchScroll: true,
        animationSpeed: '700',
        animationEase: 'ease-in-out'
    });
});
