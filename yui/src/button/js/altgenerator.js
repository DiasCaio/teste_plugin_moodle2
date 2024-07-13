Y.namespace('M.atto_image').AltGenerator = {
    /**
     * Generate alternative text for an image using Moodle's server-side script.
     * 
     * @method generateAltText
     * @param {String} imageUrl The URL of the image
     * @param {String} language The selected language code
     * @return {Promise} A promise that resolves with the generated alt text
     */
    generateAltText: function(imageUrl, language) {
        return new Promise(function(resolve, reject) {
            Y.io(M.cfg.wwwroot + '/lib/editor/atto/plugins/image/generate_alt.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'sesskey=' + M.cfg.sesskey + '&imageurl=' + encodeURIComponent(imageUrl) + '&language=' + encodeURIComponent(language),
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