(function() {
      var article = document.querySelector('.post .post-content');
      var childNodes = article.childNodes;

      var nav = {
        wrapId: 'ls-navigator',
        heads: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
        inited: false,
        rootNode: '',                 // 根结点(ul)
        outwrap: '',                  // the wrap of navs
        current: '',                  // 当前指向的ul
        currentLevel: -1              // 当前所处的目录级别
      };

      nav.init = function(outwrap, startLevel) {
        this.outwrap = document.querySelector(outwrap) || document.body;
        typeof startLevel !== 'undefined' && (this.currentLevel = startLevel);
      };

      nav.isNav = function(elem) {
        return elem && elem.nodeType === 1 && this.heads.indexOf(elem.nodeName) > -1;
      };

      nav.getNode = function(elem) {
        var li = document.createElement('li'),
            innerText = elem.innerText || '',
            hash = nav.getHash(elem);

        innerText = innerText.replace('§', '');

        li._data_level_ = this.heads.indexOf(elem.nodeName);

        if (hash) {
          var a = document.createElement('a');
          a.innerText = innerText;
          a.href = '#' + hash;
          li.appendChild(a);
        } else {
          li.innerText = innerText;
        }

        return li;
      };

      nav.getHash = function(elem) {
        if (elem.id) return elem.id;
        var anchor = elem.querySelector('a');
        return anchor && anchor.hash ? anchor.hash.replace('#', '') : null;
      };

      nav.isLowerLevel = function(node) {
        return this.currentLevel < node._data_level_;;
      };

      nav.isTheSameLevel = function(node) {
        return this.currentLevel === node._data_level_;
      };

      nav.createWrap = function(level) {
        var ul = document.createElement('ul');

        ul.className = 'side-nav level-' + (level + 1);

        ul._data_level_ = level;

        if (!this.inited) {
          ul._data_parent_ = this.outwrap;
          this.rootNode = ul;
          this.inited = true;
        } else {
          var li = document.createElement('li');
          li.appendChild(ul);
          ul._data_parent_ = this.current;

          this.current.appendChild(li);
        }
        this.currentLevel++;
        this.current = ul;
      };

      nav.forwardAdd = function(node) {
        while(this.currentLevel < node._data_level_) {
          this.createWrap(this.currentLevel);
        }
        this.current.appendChild(node);
      };

      nav.add = function(node) {
        if (!this.current) {
          this.createWrap(this.currentLevel);
        }
        this.current.appendChild(node);
      };

      nav.backAdd = function(node) {
        while(this.currentLevel > node._data_level_) {
          this.current = this.current._data_parent_;
          this.currentLevel--;
          this.current.appendChild(node);
        }
      };

      nav.flush = function() {
        this.rootNode.id = nav.wrapId;
        this.rootNode && this.outwrap.appendChild(this.rootNode);
      };

      nav.init('.post-navigator');

      for (var i = 0, len = childNodes.length; i < len; i++) {
        var elem = childNodes[i];

        if (nav.isNav(elem)) {
          var node = nav.getNode(elem);

          if (nav.isTheSameLevel(node)){
            nav.add(node);
          } else if (nav.isLowerLevel(node)) {
            nav.forwardAdd(node);
          } else {
            nav.backAdd(node);
          }
        }
      }

      // 将导航DOM添加到页面中
      nav.flush();

      var wraper = document.getElementById(nav.wrapId);
      var headerHeight = 87;
      window.addEventListener('scroll', function() {
        var classes = wraper.className.split(' ');
        var fixedClassName = 'fixed';
        var fixedClassIndex = classes.indexOf(fixedClassName);
        if (fixedClassIndex > -1 && window.scrollY < headerHeight) {
          classes.splice(fixedClassIndex, 1);
        } else if (fixedClassIndex === -1 && window.scrollY >= headerHeight) {
          classes.push(fixedClassName);
        }
        wraper.className = classes.join(' ');
      })
    })();
