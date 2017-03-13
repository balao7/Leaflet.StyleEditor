L.StyleEditor.formElements.IconElement = L.StyleEditor.formElements.FormElement.extend({

    createContent: function() {
        var uiElement = this.options.uiElement;
        var selectBox = L.DomUtil.create('button', 'leaflet-styleeditor-select', uiElement);
        var selectBoxImage = this.options.selectBoxImage = this._createSelectInputImage(selectBox);

        L.DomEvent.addListener(selectBox, 'click', this._toggleSelectInput, this);
        L.DomEvent.addListener(selectBoxImage, 'click', this._toggleSelectInput, this);

        var colors = this.options.styleEditorOptions.colorRamp;
        colors.forEach(function(color) {this._createColorSelect(color)}, this);
    },

    style: function () {
        this._styleSelectInputImage(this.options.selectBoxImage,
            this.options.styleEditorOptions.markerType.options.iconOptions.icon);
    },

    _createSelectInputImage: function(parentUiElement) {
        return L.DomUtil.create('div', 'leaflet-styleeditor-select-image', parentUiElement);
    },

    _styleSelectInputImage: function(image, icon, color) {
        if (!icon) {
            icon = image.getAttribute('value');
            if (!icon) {
                return;
            }
        }

        var iconOptions = this.options.styleEditorOptions.markerType.options.iconOptions;
        if (!!color) {
            iconOptions.iconColor = color;
        }

        image.innerHTML = '';
        this.options.styleEditorOptions.markerType.createSelectHTML(image, iconOptions, icon);
        image.setAttribute('value', icon);
    },

    _createColorSelect: function(color) {
        if (!this.options.selectOptions) {
            this.options.selectOptions = {};
        }

        var uiElement = this.options.uiElement;
        var selectOptionWrapper =
            L.DomUtil.create('ul', 'leaflet-styleeditor-select-option-wrapper leaflet-styleeditor-hidden',
                uiElement);

        this.options.styleEditorOptions.markerType.options.markers.forEach(function (option) {
            var selectOption = L.DomUtil.create('li', 'leaflet-styleeditor-select-option', selectOptionWrapper);
            var selectImage = this._createSelectInputImage(selectOption);
            this._styleSelectInputImage(selectImage, option, color);
        }, this);

        this.options.selectOptions[color] = selectOptionWrapper;

        L.DomEvent.addListener(selectOptionWrapper, 'click', function (e) {
            e.stopPropagation();
            var target = e.target;
            if (target.nodeName === 'UL') {
                return;
            }
            while (target.nodeName !== 'LI') {
                target = target.parentNode;
            }
            if (target.nodeName === 'LI') {
                target = target.childNodes[0];
            }
            this._selectMarker({
                'target': target
            }, this);
        }, this);
    },

    _toggleSelectInput: function(e) {
        if (!!e) {
            e.stopPropagation();
        }
        window.oerhg = this.options.styleEditorOptions.markerType.options.iconOptions.iconColor
        
        var currentColorElement = this.options.selectOptions[this.options.styleEditorOptions.util.rgbToHex(
            this.options.styleEditorOptions.markerType.options.iconOptions.iconColor
        )];

        var show = false;
        if(!!currentColorElement) {
            show = L.DomUtil.hasClass(currentColorElement, 'leaflet-styleeditor-hidden');
        }

        Object.values(this.options.selectOptions).forEach(function(selectOptionWrapper) {
            this.options.styleEditorOptions.util.hideElement(selectOptionWrapper);
        }, this);

        if (show) {
            this.options.styleEditorOptions.util.showElement(currentColorElement);
        }
    },

    _selectMarker: function (e) {
        var value = e.target.getAttribute('value');

        this.options.selectBoxImage.setAttribute('value', value);
        this.setStyle(value);
        for (var i=0; i<this.options.selectOptions.length; i++) {
            this.options.styleEditorOptions.util.hideElement(this.options.selectOptions[i]);
        }
        this._toggleSelectInput();
    }
});