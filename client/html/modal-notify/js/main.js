class RendDom {
    constructor(obj) {
        this.$setting = obj;
        this.$root = null;
        this._child = null;

        var el = obj.el;

        this.$el = document.querySelector(el);

        if (obj.type === 'img') {
            this.createImg();
        } else {
            this.createText();
        }

        this.bindEl();
    }

    /**
     * 生成图片展示内容
     */
    createImg() {
        if (!this.$setting.fileguid) {
            return;
        }

        var {fileguid} = this.$setting,
            html = `<div class="adv" style="background-image: url(${fileguid}); background-size: cover; background-repeat: no-repeat; height: 100%;"/>`;

        this._child = html;

        this._createRoot();
    }

    /**
     * 生成符文本展示内容
     */
    createText() {
        if (!this.$setting.content) {
            return;
        }

        var {content} = this.$setting,
            html = `<div class="rich-text" style="font-size: 14px; padding:1em; color: #303133;">${content}</div>`;

        this._child = html;

        this._createRoot();
    }

    _createRoot() {
        var root = document.createElement('div');

        root.style.height = '100%';
        root.style.overflow = 'auto';

        root.innerHTML = this._child;

        if (this.$setting.url) {
            root.style.cursor = 'pointer';

            // 创建链接
            root.addEventListener('click', () => {
                window.open(this.$setting.url);

                // window.HTMLSelectElement.openExternal(this.$setting.url);
            });
        }

        this.$root = root;
    }

    bindEl() {
        this.$el.appendChild(this.$root);
    }
}