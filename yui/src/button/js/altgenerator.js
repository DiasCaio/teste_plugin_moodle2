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


Y.namespace('M.atto_image').AltGenerator = {
    /**
     * Generate alternative text for an image using Moodle's server-side script.
     * 
     * @method generateAltText
     * @param {String} imageUrl The URL of the image
     * @param {String} language The selected language code
     * @return {Promise} A promise that resolves with the generated alt text
     */
    generateAltText: function(imageUrl, language, category) {
        return new Promise(function(resolve, reject) {
            Y.io(M.cfg.wwwroot + '/lib/editor/atto/plugins/image/generate_alt.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'sesskey=' + M.cfg.sesskey + '&imageurl=' + encodeURIComponent(imageUrl) + '&language=' + encodeURIComponent(language) + '&category=' + encodeURIComponent(category),
                on: {
                    success: function(id, response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (result.alttext) {
                                resolve(result.alttext);
                            } else {
                                reject('No alt text generated');
                            }
                        } catch (error) {
                            reject('Failed to parse server response: ' + response.responseText);
                        }
                    },
                    failure: function(id, response) {
                        reject('Failed to generate alt text: ' + response.statusText);
                    }
                }
            });
        });
    }
};