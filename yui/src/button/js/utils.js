// utils.js
Y.namespace('M.atto_image').Util = {
    _isImage: function(mimeType) {
        return mimeType.indexOf('image/') === 0;
    },

    _getAlignmentClass: function(alignment) {
        return CSS.ALIGNSETTINGS + '_' + alignment;
    },

    _toggleVisibility: function(form, selector, predicate) {
        var element = form.all(selector);
        element.setStyle('display', predicate ? 'block' : 'none');
    },

    _toggleAriaInvalid: function(form, selectors, predicate) {
        selectors.forEach(function(selector) {
            var element = form.all(selector);
            element.setAttribute('aria-invalid', predicate);
        });
    },

    _hasErrorUrlField: function(form, CSS) {
        var url = form.one('.' + CSS.INPUTURL).get('value');
        var urlerror = url === '';
        this._toggleVisibility(form, '.' + CSS.IMAGEURLWARNING, urlerror);
        this._toggleAriaInvalid(form, ['.' + CSS.INPUTURL], urlerror);
        return urlerror;
    },

    _hasErrorAltField: function(form, CSS) {
        var alt = form.one('.' + CSS.INPUTALT).get('value');
        var presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked');
        var imagealterror = alt === '' && !presentation;
        this._toggleVisibility(form, '.' + CSS.IMAGEALTWARNING, imagealterror);
        this._toggleAriaInvalid(form, ['.' + CSS.INPUTALT, '.' + CSS.IMAGEPRESENTATION], imagealterror);
        return imagealterror;
    }
};