// utils.js
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto text editor integration version file.
 *
 * @package    atto_image_gen_auto
 * @copyright  2024 Ries Patrick  <pat.3111997@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

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