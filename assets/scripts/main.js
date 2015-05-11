(function () {

	var article = document.querySelector('.post .post-content');
	var childNodes = article.childNodes;

	Nav.DEFAULTS = {
		outwrap: document.body,
		wrapId: 'ls-navigator',
		heads: ['H2', 'H3', 'H4', 'H5', 'H6']
	};

	function Nav(options) {

		// 方法可以省略new关键字
		if (!(this instanceof Nav)) {
			return new Nav(options);
		}

		this.outwrap = options.outwrap;
		this.options = this.extendOptions(options);

		console.log(this.options);

		this.inited = false;
		this.rootNode = '';                                       // 根结点(ul)
		this.current = '';                                        // 当前指向的ul

		// 当前所处的目录级别
		this.currentLevel = this.options.startLevel === undefined ? -1 : this.options.startLevel;

		this.build(options.childNodes);
		// 将导航DOM添加到页面中
		this.flush();
	}

	Nav.prototype.extendOptions = function(options) {
		var o =  Object.create(Nav.DEFAULTS);

		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				o[key] = options[key];
			}
		}

		return o;
	};


	Nav.prototype.isNav = function (elem) {
		return elem && elem.nodeType === 1 && this.options.heads.indexOf(elem.nodeName) > -1;
	};

	Nav.prototype.getNode = function (elem) {

		var li = document.createElement('li'),
		textMethod = elem.innerText ? 'innerText' : 'textContent';
		innerText = elem[textMethod] || '',
		hash = this.getHash(elem);

		innerText = innerText.replace('§', '');

		li._data_level_ = this.options.heads.indexOf(elem.nodeName);

		if (hash) {
			var a = document.createElement('a');
			a[textMethod] = innerText;
			a.href = '#' + hash;
			li.appendChild(a);
		} else {
			li[textMethod] = innerText;
		}

		return li;
	};

	Nav.prototype.getHash = function (elem) {
		if (elem.id) return elem.id;
		var anchor = elem.querySelector('a');
		return anchor && anchor.hash ? anchor.hash.replace('#', '') : null;
	};

	Nav.prototype.isLowerLevel = function (node) {
		return this.currentLevel < node._data_level_;;
	};

	Nav.prototype.isTheSameLevel = function (node) {
		return this.currentLevel === node._data_level_;
	};

	Nav.prototype.createWrap = function (level, lastNode) {
		var ul = document.createElement('ul');

		ul.className = 'nav level-' + (level + 1);

		ul._data_level_ = level;

		if (!this.inited) {
			ul._data_parent_ = this.outwrap;
			this.rootNode = ul;
			this.inited = true;
		} else {
			// var li = document.createElement('li');
			// li.appendChild(ul);
			ul._data_parent_ = this.current;

			// this.current.appendChild(ul);
			// console.log(lastNode);
			lastNode.appendChild(ul);
		}
		this.currentLevel++;
		this.current = ul;
	};

	Nav.prototype.forwardAdd = function (node, lastNode) {
		while (this.currentLevel < node._data_level_) {
			this.createWrap(this.currentLevel, lastNode);
		}
		this.current.appendChild(node);
	};

	Nav.prototype.add = function (node) {
		if (!this.current) {
			this.createWrap(this.currentLevel);
		}
		this.current.appendChild(node);
	};

	Nav.prototype.backAdd = function (node) {
		while (this.currentLevel > node._data_level_) {
			this.current = this.current._data_parent_;
			this.currentLevel--;
			this.current.appendChild(node);
		}
	};

	Nav.prototype.flush = function () {
		this.rootNode.id = this.options.wrapId;
		this.rootNode && this.outwrap.appendChild(this.rootNode);
	};

	Nav.prototype.build = function (childNodes) {

		if (!childNodes || !childNodes.length) return;

		for (var i = 0, len = childNodes.length; i < len; i++) {
			var elem = childNodes[i],
			node,
			lastNode;

			if (this.isNav(elem)) {
				node = this.getNode(elem);

				if (this.isTheSameLevel(node)) {
					this.add(node);
				} else if (this.isLowerLevel(node)) {
					this.forwardAdd(node, lastNode);
				} else {
					this.backAdd(node);
				}

				lastNode = node;
			}
		}
	};

	Nav({
		outwrap: document.querySelector('.post-navigator'),
		heads: ['H2', 'H3', 'H4', 'H5', 'H6'],
		childNodes: childNodes
	});


	function Spy(options) {

		// 方法可以省略new关键字
		if (!(this instanceof Spy)) {
			return new Spy(options);
		}

		// console.log(Object.create(this.DEFAULTS));
		// Options, OK, we don't have $.extend fn
		this.options = {};
		this.options.activeClass = options.activeClass === undefined ? Spy.DEFAULTS.activeClass : options.activeClass;
		this.options.offset = options.offset === undefined ? Spy.DEFAULTS.offset : options.offset;
		this.options.fixed = options.fixed === undefined ? Spy.DEFAULTS.fixed : options.fixed;
		this.options.fixedClass = options.fixedClass === undefined ? Spy.DEFAULTS.fixedClass : options.fixedClass;

		this.navigator = options.navigator;    // navs' container
		this.navs = [];                        // 所有a集合
		this.captures = [];                    // 各级title的offsetTop及对应a集合
		this.current = null;

		this.refresh();
		this.process();
	}

	Spy.DEFAULTS = {
		activeClass: 'active',
		offset: 0,
		fixed: false,
		fixedClass: 'fixed'
	};

	// 刷新, 保存offset值
	Spy.prototype.refresh = function() {

		this.navs = Array.prototype.slice.call(this.navigator.querySelectorAll('li > a'));

		this.captures = this.navs.map(function(nav) {
			var
			targetId = nav.getAttribute('href'),
			target = targetId && document.querySelector(targetId),
			offset = {};

			return {
				offsetTop: this.getOffsetTop(target) + this.options.offset,
				nav: nav
			};

		}.bind(this));

		// var debug = this.captures.map(function(item) {
		// 	return item.offsetTop;
		// });

		// console.log(debug);
		// offset of navigator
		if (this.options.fixed) {
			this.navOffsetTop = this.getOffsetTop(this.navigator);
		}
	};

	// scroll时监听变化
	Spy.prototype.process = function() {
		document.addEventListener('scroll', function() {
			var scrollTop = window.scrollY;

			if (this.options.fixed) {
				if (scrollTop >= this.navOffsetTop) this.navigator.classList.add(this.options.fixedClass);
				if (scrollTop < this.navOffsetTop) this.navigator.classList.remove(this.options.fixedClass);
			}

			for (var i = 0; i < this.captures.length; i++) {
				var cap = this.captures[i],
				nextCap = this.captures[i + 1];

				if (scrollTop < this.captures[0].offsetTop) {
					this.clear();
					break;
				}

				if (scrollTop > this.captures[this.captures.length -1].offsetTop) {
					this.active(this.navs[this.navs.length - 1]);
					break;
				}

				// nextCap && console.log(nextCap.offsetTop, scrollTop, cap.offsetTop, nextCap.offsetTop > scrollTop, cap.offsetTop <= scrollTop);
				if (nextCap && nextCap.offsetTop > scrollTop && cap.offsetTop <= scrollTop) {
					this.active(cap.nav);
					break;
				}
			}
		}.bind(this));
	};

	// 清除当前添加了活动(activeClass)标识的li
	Spy.prototype.clear = function(nav, newNav) {
		nav = nav || this.current;

		this.current = null;

		this.casecadeFn(nav, function(li) {

			if (li.classList.contains(this.options.activeClass)) {
				li.classList.remove(this.options.activeClass);
			}

		}.bind(this));
	};

	// 级联操作
	Spy.prototype.casecadeFn = function(nav, callback) {
		if (!nav) return;

		while(nav.parentNode) {
			nav = nav.parentNode;

			if (nav === this.navigator) break;

			if (nav.tagName === 'LI') {
				callback(nav);
			}
		}
	};

	// 给对应的nav加上活动(activeClass)标识
	Spy.prototype.active = function(nav) {

		if (this.current === nav) return;

		this.clear(this.current, nav);

		this.current = nav;

		this.casecadeFn(nav, function(li) {
			li.classList.add(this.options.activeClass);
		}.bind(this));
	};

	// 获取相对于document.body的偏移量
	Spy.prototype.getOffsetTop = function(elem) {
		var offsetTop = elem.offsetTop;

		while (elem.offsetParent) {
			elem = elem.offsetParent;

			if (elem === document.body) break;

			offsetTop += elem.offsetTop;
		}

		return offsetTop;
	};

	Spy({
		navigator: document.getElementById('ls-navigator'),
		fixed: true,
		offset: -10
	});

})();
