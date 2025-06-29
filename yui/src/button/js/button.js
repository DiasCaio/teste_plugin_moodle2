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

/*
 * @package    atto_image
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @copyright  2024 Ries Patrick  <pat.3111997@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_image_alignment-button
 */

/**
 * Atto image selection tool.
 *
 * @namespace M.atto_image
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

var CSS = {
        RESPONSIVE: 'img-fluid',
        INPUTALIGNMENT: 'atto_image_alignment',
        INPUTALT: 'atto_image_altentry',
        INPUTHEIGHT: 'atto_image_heightentry',
        INPUTSUBMIT: 'atto_image_urlentrysubmit',
        INPUTURL: 'atto_image_urlentry',
        INPUTSIZE: 'atto_image_size',
        INPUTWIDTH: 'atto_image_widthentry',
        IMAGEALTWARNING: 'atto_image_altwarning',
        IMAGEURLWARNING: 'atto_image_urlwarning',
        IMAGEBROWSER: 'openimagebrowser',
        IMAGEPRESENTATION: 'atto_image_presentation',
        INPUTCONSTRAIN: 'atto_image_constrain',
        INPUTCUSTOMSTYLE: 'atto_image_customstyle',
        IMAGEPREVIEW: 'atto_image_preview',
        IMAGEPREVIEWBOX: 'atto_image_preview_box',
        ALIGNSETTINGS: 'atto_image_button',
        GENERATEALT: 'atto_image_generate_alt',
        LANGUAGESELECTOR: 'atto_image_language_selector',
        CATEGORYSELECTOR: 'atto_image_category_selector',
        GENERATEALT: 'atto_image_generate_alt'
    },
    FORMNAMES = {
        URL: 'urlentry',
        ALT: 'altentry'
    },
    SELECTORS = {
        INPUTURL: '.' + CSS.INPUTURL
    },
    ALIGNMENTS = [
        // Vertical alignment.
        {
            name: 'verticalAlign',
            str: 'alignment_top',
            value: 'text-top',
            margin: '0 0.5em'
        }, {
            name: 'verticalAlign',
            str: 'alignment_middle',
            value: 'middle',
            margin: '0 0.5em'
        }, {
            name: 'verticalAlign',
            str: 'alignment_bottom',
            value: 'text-bottom',
            margin: '0 0.5em',
            isDefault: true
        },

        // Floats.
        {
            name: 'float',
            str: 'alignment_left',
            value: 'left',
            margin: '0 0.5em 0 0'
        }, {
            name: 'float',
            str: 'alignment_right',
            value: 'right',
            margin: '0 0 0 0.5em'
        }
    ],
    DEFAULTS = {
        WIDTH: 160,
        HEIGHT: 160,
    },
    REGEX = {
        ISPERCENT: /\d+%/
    },

    COMPONENTNAME = 'atto_image',

    TEMPLATE = '' +
            '<form class="atto_form">' +
                // Add the repository browser button.
                '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.IMAGEURLWARNING}}">' +
                    '<label for="{{elementid}}_{{CSS.INPUTURL}}">' +
                    '{{get_string "imageurlrequired" component}}' +
                    '</label>' +
                '</div>' +
                '{{#if showFilepicker}}' +
                    '<div class="mb-1">' +
                        '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                        '<div class="input-group input-append w-100">' +
                            '<input name="{{FORMNAMES.URL}}" class="form-control {{CSS.INPUTURL}}" type="url" ' +
                            'id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                            '<span class="input-group-append">' +
                                '<button class="btn btn-secondary {{CSS.IMAGEBROWSER}}" type="button">' +
                                '{{get_string "browserepositories" component}}</button>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                '{{else}}' +
                    '<div class="mb-1">' +
                        '<label for="{{elementid}}_{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
                        '<input name="{{FORMNAMES.URL}}" class="form-control fullwidth {{CSS.INPUTURL}}" type="url" ' +
                        'id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
                    '</div>' +
                '{{/if}}' +

                '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.IMAGEALTWARNING}}">' +
                '<label for="{{elementid}}_{{CSS.INPUTALT}}">' +
                '{{get_string "presentationoraltrequired" component}}' +
                '</label>' +
            '</div>' +
            // Add the Alt box.
            '<div class="mb-1">' +
                '<label for="{{elementid}}_{{CSS.INPUTALT}}">{{get_string "enteralt" component}}</label>' +
                '<textarea class="form-control fullwidth {{CSS.INPUTALT}}" ' +
                'id="{{elementid}}_{{CSS.INPUTALT}}" name="{{FORMNAMES.ALT}}" maxlength="125"></textarea>' +
    
                // Add the Generate Alt Text button
                '<div class="mb-1">' +
                '<label for="{{elementid}}_{{CSS.LANGUAGESELECTOR}}">{{get_string "select_language" component}}</label>' +
                '<select class="form-control {{CSS.LANGUAGESELECTOR}}" id="{{elementid}}_{{CSS.LANGUAGESELECTOR}}">' +
                    '{{#each languages}}' +
                        '<option value="{{code}}">{{name}}</option>' +
                    '{{/each}}' +
                '</select>' +
                '<label>Tipo da imagem</label>' +
                '<div class="{{CSS.CATEGORYSELECTOR}}">' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="foto" checked> Foto</div>' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="pintura"> Pintura/Ilustração</div>' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="print de conversa"> Print de conversa</div>' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="equação"> Equação</div>' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="gráfico"> Gráfico/Tabela/Diagrama</div>' +
                    '<div class="form-check"><input class="form-check-input" type="radio" name="tipoimagem" value="outros"> Outros</div>' +
                '</div>' +
            '</div>' +
            '<div class="mb-1">' +
                '<button class="btn btn-secondary {{CSS.GENERATEALT}}" type="button">{{get_string "generatealt" component}} ({{currentLanguage}})</button>' +
            '</div>' +
    
                // Add the character count.
                '<div id="the-count" class="d-flex justify-content-end small">' +
                    '<span id="currentcount">0</span>' +
                    '<span id="maximumcount"> / 125</span>' +
                '</div>' +
    
                // Add the presentation select box.
                '<div class="form-check">' +
                    '<input type="checkbox" class="form-check-input {{CSS.IMAGEPRESENTATION}}" ' +
                    'id="{{elementid}}_{{CSS.IMAGEPRESENTATION}}"/>' +
                    '<label class="form-check-label" for="{{elementid}}_{{CSS.IMAGEPRESENTATION}}">' +
                    '{{get_string "presentation" component}}' +
                    '</label>' +
                '</div>' +
            '</div>' +

                // Add the size entry boxes.
                '<div class="mb-1">' +
                '<label class="" for="{{elementid}}_{{CSS.INPUTSIZE}}">{{get_string "size" component}}</label>' +
                '<div id="{{elementid}}_{{CSS.INPUTSIZE}}" class="d-flex flex-wrap align-items-center {{CSS.INPUTSIZE}}">' +
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTWIDTH}}">{{get_string "width" component}}</label>' +
                '<input type="text" class="form-control w-auto mr-1 input-mini {{CSS.INPUTWIDTH}}" ' +
                'id="{{elementid}}_{{CSS.INPUTWIDTH}}" size="4"/> x' +

                // Add the height entry box.
                '<label class="accesshide" for="{{elementid}}_{{CSS.INPUTHEIGHT}}">{{get_string "height" component}}</label>' +
                '<input type="text" class="form-control w-auto ml-1 input-mini {{CSS.INPUTHEIGHT}}" ' +
                'id="{{elementid}}_{{CSS.INPUTHEIGHT}}" size="4"/>' +

                // Add the constrain checkbox.
                '<div class="form-check ml-2">' +
                '<input type="checkbox" class="form-check-input {{CSS.INPUTCONSTRAIN}}" ' +
                'id="{{elementid}}_{{CSS.INPUTCONSTRAIN}}"/>' +
                '<label class="form-check-label" for="{{elementid}}_{{CSS.INPUTCONSTRAIN}}">' +
                '{{get_string "constrain" component}}</label>' +
                '</div>' +
                '</div>' +
                '</div>' +

                // Add the alignment selector.
                '<div class="d-flex flex-wrap align-items-center mb-1">' +
                '<label class="mb-0" for="{{elementid}}_{{CSS.INPUTALIGNMENT}}">{{get_string "alignment" component}}</label>' +
                '<select class="custom-select ml-2 {{CSS.INPUTALIGNMENT}}" id="{{elementid}}_{{CSS.INPUTALIGNMENT}}">' +
                    '{{#each alignments}}' +
                        '<option value="{{value}}">{{get_string str ../component}}</option>' +
                    '{{/each}}' +
                '</select>' +
                '</div>' +
                // Hidden input to store custom styles.
                '<input type="hidden" class="{{CSS.INPUTCUSTOMSTYLE}}"/>' +
                '<br/>' +

                // Add the image preview.
                '<div class="mdl-align">' +
                '<div class="{{CSS.IMAGEPREVIEWBOX}}">' +
                    '<img class="{{CSS.IMAGEPREVIEW}}" alt="" style="display: none;"/>' +
                '</div>' +

                // Add the submit button and close the form.
                '<button class="btn btn-secondary {{CSS.INPUTSUBMIT}}" type="submit">' + '' +
                    '{{get_string "saveimage" component}}</button>' +
                '</div>' +
            '</form>',

        IMAGETEMPLATE = '' +
            '<img src="{{url}}" alt="{{alt}}" ' +
                '{{#if width}}width="{{width}}" {{/if}}' +
                '{{#if height}}height="{{height}}" {{/if}}' +
                '{{#if presentation}}role="presentation" {{/if}}' +
                '{{#if customstyle}}style="{{customstyle}}" {{/if}}' +
                '{{#if classlist}}class="{{classlist}}" {{/if}}' +
                '{{#if id}}id="{{id}}" {{/if}}' +
                '/>';

Y.namespace('M.atto_image').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * The most recently selected image.
     *
     * @param _selectedImage
     * @type Node
     * @private
     */
    _selectedImage: null,

    /**
     * A reference to the currently open form.
     *
     * @param _form
     * @type Node
     * @private
     */
    _form: null,

    /**
     * The dimensions of the raw image before we manipulate it.
     *
     * @param _rawImageDimensions
     * @type Object
     * @private
     */
    _rawImageDimensions: null,

    initializer: function() {
        

        this.addButton({
            icon: 'e/insert_edit_image',
            callback: this._displayDialogue,
            tags: 'img',
            tagMatchRequiresAll: false
        });
        this.editor.delegate('dblclick', this._displayDialogue, 'img', this);
        this.editor.delegate('click', this._handleClick, 'img', this);
        this.editor.on('paste', this._handlePaste, this);
        this.editor.on('drop', this._handleDragDrop, this);

        // ...e.preventDefault needed to stop the default event from clobbering the desired behaviour in some browsers.
        this.editor.on('dragover', function(e) {
            e.preventDefault();
        }, this);
        this.editor.on('dragenter', function(e) {
            e.preventDefault();
        }, this);

        this._loadLanguages();


    },

    /**
     * Handle a drag and drop event with an image.
     *
     * @method _handleDragDrop
     * @param {EventFacade} e
     * @private
     */
    _handleDragDrop: function(e) {
        if (!e._event || !e._event.dataTransfer) {
            // Drop not fully supported in this browser.
            return;
        }

        this._handlePasteOrDropHelper(e, e._event.dataTransfer);
    },

    /**
     * Handles paste events where - if the thing being pasted is an image.
     *
     * @method _handlePaste
     * @param {EventFacade} e
     * @return {boolean} false if we handled the event, else true.
     * @private
     */
    _handlePaste: function(e) {
        if (!e._event || !e._event.clipboardData) {
            // Paste not fully supported in this browser.
            return true;
        }

        return this._handlePasteOrDropHelper(e, e._event.clipboardData);
    },

    /**
     * Handle a drag and drop event with an image.
     *
     * @method _handleDragDrop
     * @param {EventFacade} e
     * @param {DataTransfer} dataTransfer
     * @return {boolean} false if we handled the event, else true.
     * @private
     */
    _handlePasteOrDropHelper: function(e, dataTransfer) {

        var items = dataTransfer.items,
            didUpload = false;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.kind !== 'file') {
                continue;
            }
            if (!this._isImage(item.type)) {
                continue;
            }
            this._uploadImage(item.getAsFile());
            didUpload = true;
        }

        if (didUpload) {
            e.preventDefault();
        }
    },

    /**
     * Is this file an image?
     *
     * @method _isImage
     * @param {string} mimeType the file's mime type.
     * @return {boolean} true if the file has an image mimeType.
     * @private
     */
    _isImage: function(mimeType) {
        return mimeType.indexOf('image/') === 0;
    },

    /**
     * Used by _handleDragDrop and _handlePaste to upload an image and insert it.
     *
     * @method _uploadImage
     * @param {File} fileToSave
     * @private
     */
    _uploadImage: function(fileToSave) {

        var self = this,
            host = this.get('host'),
            template = Y.Handlebars.compile(IMAGETEMPLATE);

        host.saveSelection();

        // Trigger form upload start events.
        require(['core_form/events'], function(FormEvent) {
            FormEvent.notifyUploadStarted(self.editor.get('id'));
        });

        var options = host.get('filepickeroptions').image,
            savepath = (options.savepath === undefined) ? '/' : options.savepath,
            formData = new FormData(),
            timestamp = 0,
            uploadid = "",
            xhr = new XMLHttpRequest(),
            imagehtml = "",
            keys = Object.keys(options.repositories);

        formData.append('repo_upload_file', fileToSave);
        formData.append('itemid', options.itemid);

        // List of repositories is an object rather than an array.  This makes iteration more awkward.
        for (var i = 0; i < keys.length; i++) {
            if (options.repositories[keys[i]].type === 'upload') {
                formData.append('repo_id', options.repositories[keys[i]].id);
                break;
            }
        }
        formData.append('env', options.env);
        formData.append('sesskey', M.cfg.sesskey);
        formData.append('client_id', options.client_id);
        formData.append('savepath', savepath);
        formData.append('ctx_id', options.context.id);

        // Insert spinner as a placeholder.
        timestamp = new Date().getTime();
        uploadid = 'moodleimage_' + Math.round(Math.random() * 100000) + '-' + timestamp;
        host.focus();
        host.restoreSelection();
        imagehtml = template({
            url: M.util.image_url("i/loading_small", 'moodle'),
            alt: M.util.get_string('uploading', COMPONENTNAME),
            id: uploadid
        });
        host.insertContentAtFocusPoint(imagehtml);
        self.markUpdated();

        // Kick off a XMLHttpRequest.
        xhr.onreadystatechange = function() {
            var placeholder = self.editor.one('#' + uploadid),
                result,
                file,
                newhtml,
                newimage;

            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    result = JSON.parse(xhr.responseText);
                    if (result) {
                        if (result.error) {
                            if (placeholder) {
                                placeholder.remove(true);
                            }
                            // Trigger form upload complete events.
                            require(['core_form/events'], function(FormEvent) {
                                FormEvent.notifyUploadCompleted(self.editor.get('id'));
                            });
                            throw new M.core.ajaxException(result);
                        }

                        file = result;
                        if (result.event && result.event === 'fileexists') {
                            // A file with this name is already in use here - rename to avoid conflict.
                            // Chances are, it's a different image (stored in a different folder on the user's computer).
                            // If the user wants to reuse an existing image, they can copy/paste it within the editor.
                            file = result.newfile;
                        }

                        // Replace placeholder with actual image.
                        newhtml = template({
                            url: file.url,
                            presentation: true,
                            classlist: CSS.RESPONSIVE
                        });
                        newimage = Y.Node.create(newhtml);
                        if (placeholder) {
                            placeholder.replace(newimage);
                        } else {
                            self.editor.appendChild(newimage);
                        }
                        self.markUpdated();
                    }
                } else {
                    Y.use('moodle-core-notification-alert', function() {
                        // Trigger form upload complete events.
                        require(['core_form/events'], function(FormEvent) {
                            FormEvent.notifyUploadCompleted(self.editor.get('id'));
                        });
                        new M.core.alert({message: M.util.get_string('servererror', 'moodle')});
                    });
                    if (placeholder) {
                        placeholder.remove(true);
                    }
                }
                // Trigger form upload complete events.
                require(['core_form/events'], function(FormEvent) {
                    FormEvent.notifyUploadCompleted(self.editor.get('id'));
                });
            }
        };
        xhr.open("POST", M.cfg.wwwroot + '/repository/repository_ajax.php?action=upload', true);
        xhr.send(formData);
    },

    /**
     * Handle a click on an image.
     *
     * @method _handleClick
     * @param {EventFacade} e
     * @private
     */
    _handleClick: function(e) {
        var image = e.target;

        var selection = this.get('host').getSelectionFromNode(image);
        if (this.get('host').getSelection() !== selection) {
            this.get('host').setSelection(selection);
        }
    },

    /**
     * Display the image editing tool.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        // Reset the image dimensions.
        this._rawImageDimensions = null;
        console.log('Languages before setting dialogue content:', this._getLanguages());

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('imageproperties', COMPONENTNAME),
            width: 'auto',
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTURL
        });
        // Set a maximum width for the dialog. This will prevent the dialog width to extend beyond the screen width
        // in cases when the uploaded image has larger width.
        dialogue.get('boundingBox').setStyle('maxWidth', '90%');
        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent())
                .show();
    },

    /**
     * Set the inputs for width and height if they are not set, and calculate
     * if the constrain checkbox should be checked or not.
     *
     * @method _loadPreviewImage
     * @param {String} url
     * @private
     */
    _loadPreviewImage: function(url) {
        var image = new Image();
        var self = this;

        image.onerror = function() {
            var preview = self._form.one('.' + CSS.IMAGEPREVIEW);
            preview.setStyles({
                'display': 'none'
            });

            // Centre the dialogue when clearing the image preview.
            self.getDialogue().centerDialogue();
        };

        image.onload = function() {
            var input, currentwidth, currentheight, widthRatio, heightRatio;

            // Store dimensions of the raw image, falling back to defaults for images without dimensions (e.g. SVG).
            self._rawImageDimensions = {
                width: this.width || DEFAULTS.WIDTH,
                height: this.height || DEFAULTS.HEIGHT,
            };

            input = self._form.one('.' + CSS.INPUTWIDTH);
            currentwidth = input.get('value');
            if (currentwidth === '') {
                input.set('value', self._rawImageDimensions.width);
                currentwidth = "" + self._rawImageDimensions.width;
            }
            input = self._form.one('.' + CSS.INPUTHEIGHT);
            currentheight = input.get('value');
            if (currentheight === '') {
                input.set('value', self._rawImageDimensions.height);
                currentheight = "" + self._rawImageDimensions.height;
            }
            input = self._form.one('.' + CSS.IMAGEPREVIEW);
            input.setAttribute('src', this.src);
            input.setStyles({
                'display': 'inline'
            });

            input = self._form.one('.' + CSS.INPUTCONSTRAIN);
            if (currentwidth.match(REGEX.ISPERCENT) && currentheight.match(REGEX.ISPERCENT)) {
                input.set('checked', currentwidth === currentheight);
            } else if (this.width === 0 || this.height === 0) {
                // If we don't have both dimensions of the image, we can't auto-size it, so disable control.
                input.set('disabled', 'disabled');
            } else {
                // This is the same as comparing to 3 decimal places.
                widthRatio = Math.round(1000 * parseInt(currentwidth, 10) / this.width);
                heightRatio = Math.round(1000 * parseInt(currentheight, 10) / this.height);
                input.set('checked', widthRatio === heightRatio);
            }

            // Apply the image sizing.
            self._autoAdjustSize(self);

            // Centre the dialogue once the preview image has loaded.
            self.getDialogue().centerDialogue();
        };

        image.src = url;
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getDialogueContent: function() {
        var template = Y.Handlebars.compile(TEMPLATE),
            canShowFilepicker = this.get('host').canShowFilepicker('image'),
            languages = this._getLanguages(),
            currentLanguage = languages.length > 0 ? languages[0].code.toUpperCase() : 'EN';
    
        var content = Y.Node.create(template({
            elementid: this.get('host').get('elementid'),
            CSS: CSS,
            FORMNAMES: FORMNAMES,
            component: COMPONENTNAME,
            showFilepicker: canShowFilepicker,
            alignments: ALIGNMENTS,
            languages: languages,
            currentLanguage: currentLanguage
        }));
    
        this._form = content;

        // Configure the view of the current image.
        this._applyImageProperties(this._form);

        // Add event listeners
        this._addEventListeners();

        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.INPUTURL).on('change', this._hasErrorUrlField, this);
        this._form.one('.' + CSS.IMAGEPRESENTATION).on('change', this._hasErrorAltField, this);
        this._form.one('.' + CSS.INPUTALT).on('blur', this._hasErrorAltField, this);
        this._form.one('.' + CSS.INPUTWIDTH).on('blur', this._autoAdjustSize, this);
        this._form.one('.' + CSS.INPUTHEIGHT).on('blur', this._autoAdjustSize, this, true);
        this._form.one('.' + CSS.INPUTCONSTRAIN).on('change', function(event) {
            if (event.target.get('checked')) {
                this._autoAdjustSize(event);
            }
        }, this);
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._setImage, this);

        if (canShowFilepicker) {
            this._form.one('.' + CSS.IMAGEBROWSER).on('click', function() {
                    this.get('host').showFilepicker('image', this._filepickerCallback, this);
            }, this);
        }

        // Character count.
        this._form.one('.' + CSS.INPUTALT).on('keyup', this._handleKeyup, this);

        var altField = this._form.one('.' + CSS.INPUTALT);
        altField.setAttribute('placeholder', 'Enter manually or generate automatically by clicking the button');

        var languageSelector = this._form.one('.' + CSS.LANGUAGESELECTOR);
        if (languageSelector) {
            languageSelector.on('change', this._updateGenerateButtonLabel, this);
        }
    
        this._form = content;
        this._applyLanguageSelection();
        return content;
    },

    _applyLanguageSelection: function() {
        var languageSelector = this._form.one('.' + CSS.LANGUAGESELECTOR);
        var generateButton = this._form.one('.' + CSS.GENERATEALT);
        
        if (languageSelector && generateButton) {
            languageSelector.on('change', function(e) {
                var selectedLanguage = e.target.get('value').toUpperCase();
                generateButton.set('text', M.util.get_string('generatealt', COMPONENTNAME) + ' (' + selectedLanguage + ')');
            });
        }
    },



    _addEventListeners: function() {
        this._form.one('.' + CSS.INPUTURL).on('blur', this._urlChanged, this);
        this._form.one('.' + CSS.INPUTURL).on('change', this._hasErrorUrlField, this);
        this._form.one('.' + CSS.IMAGEPRESENTATION).on('change', this._hasErrorAltField, this);
        this._form.one('.' + CSS.INPUTALT).on('blur', this._hasErrorAltField, this);
        this._form.one('.' + CSS.INPUTWIDTH).on('blur', this._autoAdjustSize, this);
        this._form.one('.' + CSS.INPUTHEIGHT).on('blur', this._autoAdjustSize, this, true);
        this._form.one('.' + CSS.GENERATEALT).on('click', this._generateAltText, this);
        this._form.one('.' + CSS.INPUTCONSTRAIN).on('change', function(event) {
            if (event.target.get('checked')) {
                this._autoAdjustSize(event);
            }
        }, this);
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._setImage, this);

        if (this.get('host').canShowFilepicker('image')) {
            this._form.one('.' + CSS.IMAGEBROWSER).on('click', function() {
                this.get('host').showFilepicker('image', this._filepickerCallback, this);
            }, this);
        }

        // Character count
        this._form.one('.' + CSS.INPUTALT).on('keyup', this._handleKeyup, this);
    },

    _loadLanguages: function() {
        var self = this;
        
        // Construct the URL to the generate_alt.php script
        var url = M.cfg.wwwroot + '/lib/editor/atto/plugins/image/generate_alt.php?action=get_languages&sesskey=' + M.cfg.sesskey;
    
        // Make an AJAX request to fetch the languages
        Y.io(url, {
            method: 'GET',
            on: {
                success: function(id, response) {
                    try {
                        var result = JSON.parse(response.responseText);
                        if (result.languages) {
                            self.languages = result.languages;
                            console.log('Languages loaded:', self.languages);
                            // You might want to update the UI here, e.g., populate a dropdown
                        } else {
                            console.error('No languages found in the response');
                        }
                    } catch (error) {
                        console.error('Failed to parse language data:', error);
                    }
                },
                failure: function(id, response) {
                    console.error('Failed to load languages:', response.statusText);
                }
            }
        });
    },
    
    _getLanguages: function() {
        return this.languages || [{ code: 'en', name: 'English' }];
    },

    
    
    _updateGenerateButtonLabel: function() {
        var languageSelect = this._form.one('.' + CSS.LANGUAGESELECTOR);
        var generateButton = this._form.one('.' + CSS.GENERATEALT);
        if (languageSelect && generateButton) {
            generateButton.set('text', M.util.get_string('generatealt', 'atto_image') + ' (' + languageSelect.get('value').toUpperCase() + ')');
        }
    },


    _generateAltText: function(e) {
        e.preventDefault();
        var altField = this._form.one('.' + CSS.INPUTALT);
        var urlField = this._form.one('.' + CSS.INPUTURL);
        var languageSelect = this._form.one('.' + CSS.LANGUAGESELECTOR);
        var tipoSelect = this._form.one('.' + CSS.CATEGORYSELECTOR);
        var url = urlField.get('value');
        var language = languageSelect.get('value');
        var tipoimagem = '';
        if (tipoSelect) {
            var checked = tipoSelect.one('input[type=radio]:checked');
            tipoimagem = checked ? checked.get('value') : '';
        }
    
        if (url) {
            // Show a loading indicator
            altField.set('value', 'Generating alt text...');
            this._handleKeyup();  // Update character count
    
            Y.M.atto_image.AltGenerator.generateAltText(url, language, tipoimagem).then(function(altText) {
                altField.set('value', altText);
                this._handleKeyup();  // Update character count
            }.bind(this)).catch(function(error) {
                console.error('Failed to generate alt text:', error);
                altField.set('value', 'Error: ' + error);
                this._handleKeyup();  // Update character count
            }.bind(this));
        } else {
            altField.set('value', 'Please provide an image URL first');
            this._handleKeyup();  // Update character count
        }
    },

    _autoAdjustSize: function(e, forceHeight) {
        forceHeight = forceHeight || false;

        var keyField = this._form.one('.' + CSS.INPUTWIDTH),
            keyFieldType = 'width',
            subField = this._form.one('.' + CSS.INPUTHEIGHT),
            subFieldType = 'height',
            constrainField = this._form.one('.' + CSS.INPUTCONSTRAIN),
            keyFieldValue = keyField.get('value'),
            subFieldValue = subField.get('value'),
            imagePreview = this._form.one('.' + CSS.IMAGEPREVIEW),
            rawPercentage,
            rawSize;

        // If we do not know the image size, do not do anything.
        if (!this._rawImageDimensions) {
            return;
        }

        // Set the width back to default if it is empty.
        if (keyFieldValue === '') {
            keyFieldValue = this._rawImageDimensions[keyFieldType];
            keyField.set('value', keyFieldValue);
            keyFieldValue = keyField.get('value');
        }

        // Clear the existing preview sizes.
        imagePreview.setStyles({
            width: null,
            height: null
        });

        // Now update with the new values.
        if (!constrainField.get('checked')) {
            // We are not keeping the image proportion - update the preview accordingly.

            // Width.
            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;
                imagePreview.setStyle('width', rawSize + 'px');
            } else {
                imagePreview.setStyle('width', keyFieldValue + 'px');
            }

            // Height.
            if (subFieldValue.match(REGEX.ISPERCENT)) {
                rawPercentage = parseInt(subFieldValue, 10);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize + 'px');
            } else {
                imagePreview.setStyle('height', subFieldValue + 'px');
            }
        } else {
            // We are keeping the image in proportion.
            if (forceHeight) {
                // By default we update based on width. Swap the key and sub fields around to achieve a height-based scale.
                var _temporaryValue;
                _temporaryValue = keyField;
                keyField = subField;
                subField = _temporaryValue;

                _temporaryValue = keyFieldType;
                keyFieldType = subFieldType;
                subFieldType = _temporaryValue;

                _temporaryValue = keyFieldValue;
                keyFieldValue = subFieldValue;
                subFieldValue = _temporaryValue;
            }

            if (keyFieldValue.match(REGEX.ISPERCENT)) {
                // This is a percentage based change. Copy it verbatim.
                subFieldValue = keyFieldValue;

                // Set the width to the calculated pixel width.
                rawPercentage = parseInt(keyFieldValue, 10);
                rawSize = this._rawImageDimensions.width / 100 * rawPercentage;

                // And apply the width/height to the container.
                imagePreview.setStyle('width', rawSize);
                rawSize = this._rawImageDimensions.height / 100 * rawPercentage;
                imagePreview.setStyle('height', rawSize);
            } else {
                // Calculate the scaled subFieldValue from the keyFieldValue.
                subFieldValue = Math.round((keyFieldValue / this._rawImageDimensions[keyFieldType]) *
                        this._rawImageDimensions[subFieldType]);

                if (forceHeight) {
                    imagePreview.setStyles({
                        'width': subFieldValue,
                        'height': keyFieldValue
                    });
                } else {
                    imagePreview.setStyles({
                        'width': keyFieldValue,
                        'height': subFieldValue
                    });
                }
            }

            // Update the subField's value within the form to reflect the changes.
            subField.set('value', subFieldValue);
        }
    },

    /**
     * Update the dialogue after an image was selected in the File Picker.
     *
     * @method _filepickerCallback
     * @param {object} params The parameters provided by the filepicker
     * containing information about the image.
     * @private
     */
    _filepickerCallback: function(params) {
        if (params.url !== '') {
            var input = this._form.one('.' + CSS.INPUTURL);
            input.set('value', params.url);

            // Auto set the width and height.
            this._form.one('.' + CSS.INPUTWIDTH).set('value', '');
            this._form.one('.' + CSS.INPUTHEIGHT).set('value', '');

            // Load the preview image.
            this._loadPreviewImage(params.url);
        }
    },

    /**
     * Applies properties of an existing image to the image dialogue for editing.
     *
     * @method _applyImageProperties
     * @param {Node} form
     * @private
     */
    _applyImageProperties: function(form) {
        var properties = this._getSelectedImageProperties(),
            img = form.one('.' + CSS.IMAGEPREVIEW);

        if (properties === false) {
            img.setStyle('display', 'none');
            // Set the default alignment.
            ALIGNMENTS.some(function(alignment) {
                if (alignment.isDefault) {
                    form.one('.' + CSS.INPUTALIGNMENT).set('value', alignment.value);
                    return true;
                }

                return false;
            }, this);

            return;
        }

        if (properties.align) {
            form.one('.' + CSS.INPUTALIGNMENT).set('value', properties.align);
        }
        if (properties.customstyle) {
            form.one('.' + CSS.INPUTCUSTOMSTYLE).set('value', properties.customstyle);
        }
        if (properties.width) {
            form.one('.' + CSS.INPUTWIDTH).set('value', properties.width);
        }
        if (properties.height) {
            form.one('.' + CSS.INPUTHEIGHT).set('value', properties.height);
        }
        if (properties.alt) {
            form.one('.' + CSS.INPUTALT).set('value', properties.alt);
        }
        if (properties.src) {
            form.one('.' + CSS.INPUTURL).set('value', properties.src);
            this._loadPreviewImage(properties.src);
        }
        if (properties.presentation) {
            form.one('.' + CSS.IMAGEPRESENTATION).set('checked', 'checked');
        }

        // Update the image preview based on the form properties.
        this._autoAdjustSize();
    },

    /**
     * Gets the properties of the currently selected image.
     *
     * The first image only if multiple images are selected.
     *
     * @method _getSelectedImageProperties
     * @return {object}
     * @private
     */
    _getSelectedImageProperties: function() {
        var properties = {
                src: null,
                alt: null,
                width: null,
                height: null,
                align: '',
                presentation: false
            },

            // Get the current selection.
            images = this.get('host').getSelectedNodes(),
            width,
            height,
            style,
            image;

        if (images) {
            images = images.filter('img');
        }

        if (images && images.size()) {
            image = this._removeLegacyAlignment(images.item(0));
            this._selectedImage = image;

            style = image.getAttribute('style');
            properties.customstyle = style;

            width = image.getAttribute('width');
            if (!width.match(REGEX.ISPERCENT)) {
                width = parseInt(width, 10);
            }
            height = image.getAttribute('height');
            if (!height.match(REGEX.ISPERCENT)) {
                height = parseInt(height, 10);
            }

            if (width !== 0) {
                properties.width = width;
            }
            if (height !== 0) {
                properties.height = height;
            }
            this._getAlignmentPropeties(image, properties);
            properties.src = image.getAttribute('src');
            properties.alt = image.getAttribute('alt') || '';
            properties.presentation = (image.get('role') === 'presentation');
            return properties;
        }

        // No image selected - clean up.
        this._selectedImage = null;
        return false;
    },

    /**
     * Sets the alignment of a properties object.
     *
     * @method _getAlignmentPropeties
     * @param {Node} image The image that the alignment properties should be found for
     * @param {Object} properties The properties object that is created in _getSelectedImageProperties()
     * @private
     */
    _getAlignmentPropeties: function(image, properties) {
        var complete = false,
            defaultAlignment;

        // Check for an alignment value.
        complete = ALIGNMENTS.some(function(alignment) {
            var classname = this._getAlignmentClass(alignment.value);
            if (image.hasClass(classname)) {
                properties.align = alignment.value;
                Y.log('Found alignment ' + alignment.value, 'debug', 'atto_image-button');

                return true;
            }

            if (alignment.isDefault) {
                defaultAlignment = alignment.value;
            }

            return false;
        }, this);

        if (!complete && defaultAlignment) {
            properties.align = defaultAlignment;
        }
    },

    /**
     * Update the form when the URL was changed. This includes updating the
     * height, width, and image preview.
     *
     * @method _urlChanged
     * @private
     */
    _urlChanged: function() {
        var input = this._form.one('.' + CSS.INPUTURL);

        if (input.get('value') !== '') {
            // Load the preview image.
            this._loadPreviewImage(input.get('value'));
        }
    },

    /**
     * Update the image in the contenteditable.
     *
     * @method _setImage
     * @param {EventFacade} e
     * @private
     */
    _setImage: function(e) {
        var form = this._form,
            url = form.one('.' + CSS.INPUTURL).get('value'),
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            width = form.one('.' + CSS.INPUTWIDTH).get('value'),
            height = form.one('.' + CSS.INPUTHEIGHT).get('value'),
            alignment = this._getAlignmentClass(form.one('.' + CSS.INPUTALIGNMENT).get('value')),
            presentation = form.one('.' + CSS.IMAGEPRESENTATION).get('checked'),
            constrain = form.one('.' + CSS.INPUTCONSTRAIN).get('checked'),
            imagehtml,
            customstyle = form.one('.' + CSS.INPUTCUSTOMSTYLE).get('value'),
            classlist = [],
            host = this.get('host');

        e.preventDefault();

        // Check if there are any accessibility issues.
        if (this._updateWarning()) {
            return;
        }

        // Focus on the editor in preparation for inserting the image.
        host.focus();
        if (url !== '') {
            if (this._selectedImage) {
                host.setSelection(host.getSelectionFromNode(this._selectedImage));
            } else {
                host.setSelection(this._currentSelection);
            }

            if (constrain) {
                classlist.push(CSS.RESPONSIVE);
            }

            // Add the alignment class for the image.
            classlist.push(alignment);

            if (!width.match(REGEX.ISPERCENT) && isNaN(parseInt(width, 10))) {
                form.one('.' + CSS.INPUTWIDTH).focus();
                return;
            }
            if (!height.match(REGEX.ISPERCENT) && isNaN(parseInt(height, 10))) {
                form.one('.' + CSS.INPUTHEIGHT).focus();
                return;
            }

            var template = Y.Handlebars.compile(IMAGETEMPLATE);
            imagehtml = template({
                url: url,
                alt: alt,
                width: width,
                height: height,
                presentation: presentation,
                customstyle: customstyle,
                classlist: classlist.join(' ')
            });

            this.get('host').insertContentAtFocusPoint(imagehtml);

            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();

    },

    /**
     * Removes any legacy styles added by previous versions of the atto image button.
     *
     * @method _removeLegacyAlignment
     * @param {Y.Node} imageNode
     * @return {Y.Node}
     * @private
     */
    _removeLegacyAlignment: function(imageNode) {
        if (!imageNode.getStyle('margin')) {
            // There is no margin therefore this cannot match any known alignments.
            return imageNode;
        }

        ALIGNMENTS.some(function(alignment) {
            if (imageNode.getStyle(alignment.name) !== alignment.value) {
                // The name/value do not match. Skip.
                return false;
            }

            var normalisedNode = Y.Node.create('<div>');
            normalisedNode.setStyle('margin', alignment.margin);
            if (imageNode.getStyle('margin') !== normalisedNode.getStyle('margin')) {
                // The margin does not match.
                return false;
            }

            Y.log('Legacy alignment found and removed.', 'info', 'atto_image-button');
            imageNode.addClass(this._getAlignmentClass(alignment.value));
            imageNode.setStyle(alignment.name, null);
            imageNode.setStyle('margin', null);

            return true;
        }, this);

        return imageNode;
    },

    _getAlignmentClass: function(alignment) {
        return Y.M.atto_image.Util._getAlignmentClass(alignment);
    },

    _toggleVisibility: function(selector, predicate) {
        Y.M.atto_image.Util._toggleVisibility(this._form, selector, predicate);
    },

    _toggleAriaInvalid: function(selectors, predicate) {
        Y.M.atto_image.Util._toggleAriaInvalid(this._form, selectors, predicate);
    },

    _hasErrorUrlField: function() {
        return Y.M.atto_image.Util._hasErrorUrlField(this._form, CSS);
    },

    _hasErrorAltField: function() {
        return Y.M.atto_image.Util._hasErrorAltField(this._form, CSS);
    },
    /**
     * Update the alt text warning live.
     *
     * @method _updateWarning
     * @return {boolean} whether a warning should be displayed.
     * @private
     */
    _updateWarning: function() {
        var urlerror = this._hasErrorUrlField();
        var imagealterror = this._hasErrorAltField();
        var haserrors = urlerror || imagealterror;
        this.getDialogue().centerDialogue();
        return haserrors;
    },

    /**
     * Handle the keyup to update the character count.
     */
    _handleKeyup: function() {
        var form = this._form,
            alt = form.one('.' + CSS.INPUTALT).get('value'),
            characterCount = alt.length,
            current = form.one('#currentcount');
        current.setHTML(characterCount);
    }
});
