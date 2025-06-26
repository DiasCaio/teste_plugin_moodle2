<?php
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
 * Settings that allow configuration of the image plugin
 *
 * @package    atto_image
 * @copyright  2024 Ries Patrick  <pat.3111997@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$ADMIN->add('editoratto', new admin_category('atto_image', new lang_string('pluginname', 'atto_image')));

$settings = new admin_settingpage('atto_image_settings', new lang_string('settings', 'atto_image'));
if ($ADMIN->fulltree) {
    // OpenAI API Key setting
    $settings->add(new admin_setting_configtext('atto_image/apikey',
        get_string('apikey', 'atto_image'),
        get_string('apikey_desc', 'atto_image'),
        '', PARAM_TEXT));

    // OpenAI API URL setting
    $settings->add(new admin_setting_configtext('atto_image/apiurl',
        get_string('apiurl', 'atto_image'),
        get_string('apiurl_desc', 'atto_image'),
        'https://api.openai.com/v1/chat/completions', PARAM_URL));

    // Google AI API Key setting
    $settings->add(new admin_setting_configtext('atto_image/google_api_key',
        get_string('googleapikey', 'atto_image'),
        get_string('googleapikey_desc', 'atto_image'),
        '', PARAM_TEXT));

    // Google AI API URL setting
    $settings->add(new admin_setting_configtext('atto_image/google_api_url',
        get_string('googleapiurl', 'atto_image'),
        get_string('googleapiurl_desc', 'atto_image'),
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent', PARAM_URL));

    // Model setting (now allows custom input)
    $settings->add(new admin_setting_configtext('atto_image/model',
        get_string('model', 'atto_image'),
        get_string('model_desc', 'atto_image'),
        'gemini-pro-vision', PARAM_TEXT));

    // Basic Prompt setting
    // Uncomment this if you want to allow customization of the basic prompt
    // $settings->add(new admin_setting_configtextarea('atto_image/prompt',
    //     get_string('prompt', 'atto_image'),
    //     get_string('prompt_desc', 'atto_image'),
    //     'Generate a small alternative description for the image.', PARAM_TEXT));

    // Max Tokens setting
    $settings->add(new admin_setting_configtext('atto_image/max_tokens',
        get_string('max_tokens', 'atto_image'),
        get_string('max_tokens_desc', 'atto_image'),
        '100', PARAM_INT));

    // Rate limiting settings
    $settings->add(new admin_setting_configtext('atto_image/rate_limit_max',
        get_string('rate_limit_max', 'atto_image'),
        get_string('rate_limit_max_desc', 'atto_image'),
        '10', PARAM_INT));

    $settings->add(new admin_setting_configtext('atto_image/rate_limit_time',
        get_string('rate_limit_time', 'atto_image'),
        get_string('rate_limit_time_desc', 'atto_image'),
        '60', PARAM_INT));

    // Image scaling settings
    $settings->add(new admin_setting_configtext('atto_image/max_image_width',
        get_string('max_image_width', 'atto_image'),
        get_string('max_image_width_desc', 'atto_image'),
        '1024', PARAM_INT));
    
    $settings->add(new admin_setting_configtext('atto_image/max_image_height',
        get_string('max_image_height', 'atto_image'),
        get_string('max_image_height_desc', 'atto_image'),
        '1024', PARAM_INT));

    // Image detail level setting
    $settings->add(new admin_setting_configselect('atto_image/detail',
        get_string('detail', 'atto_image'),
        get_string('detail_desc', 'atto_image'),
        'low', // default value
        [
            'none' => get_string('detail_none', 'atto_image'),
            'low' => get_string('detail_low', 'atto_image'),
            'high' => get_string('detail_high', 'atto_image'),
            'auto' => get_string('detail_auto', 'atto_image'),
        ]
    ));

    // Languages setting
    $default_languages = json_encode(['en' => 'Generate a concise alternative description for the image in English.']);
    $settings->add(new admin_setting_configtextarea('atto_image/languages',
        get_string('languages', 'atto_image'),
        get_string('languages_desc', 'atto_image'),
        $default_languages,
        PARAM_RAW
    ));

    // Google Vision API Key setting
    $settings->add(new admin_setting_configtext('atto_image/google_apikey',
        get_string('google_apikey', 'atto_image'),
        get_string('google_apikey_desc', 'atto_image'),
        '', PARAM_TEXT));

    // Google Vision API URL setting
    $settings->add(new admin_setting_configtext('atto_image/google_apiurl',
        get_string('google_apiurl', 'atto_image'),
        get_string('google_apiurl_desc', 'atto_image'),
        '', PARAM_URL));

    // Default categories setting
    $default_categories = json_encode([
        'photo' => 'Photo',
        'screenshot' => 'Screenshot',
        'illustration' => 'Illustration',
        'icon' => 'Icon'
    ]);
    $settings->add(new admin_setting_configtextarea('atto_image/categories',
        get_string('categories', 'atto_image'),
        get_string('categories_desc', 'atto_image'),
        $default_categories,
        PARAM_RAW
    ));
}

$ADMIN->add('editoratto', $settings);