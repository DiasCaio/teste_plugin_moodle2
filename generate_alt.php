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
 * Generate alt text for image using OpenAI API
 *
 * @package    atto_image
 * @copyright  2024 Ries Patrick  <pat.3111997@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('AJAX_SCRIPT', true);

require_once(__DIR__ . '/../../../../../config.php');
require_once($CFG->libdir . '/filelib.php');

// Enable debugging
$CFG->debug = DEBUG_DEVELOPER;
$CFG->debugdisplay = 1;

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_login();

// Check for the capability
if (!has_capability('atto/image:generatealttext', context_system::instance())) {
    throw new moodle_exception('nopermissions', 'error', '', 'generate alt text');
}



/**
 * Scale down an image if it exceeds the maximum dimensions.
 *
 * @param string $imagedata The binary image data
 * @param int $max_width Maximum width of the scaled image
 * @param int $max_height Maximum height of the scaled image
 * @return string The binary data of the scaled image
 */
function scale_image($imagedata, $max_width = 1024, $max_height = 1024) {
    $image = imagecreatefromstring($imagedata);
    if ($image === false) {
        return $imagedata; // Return original data if creation fails
    }

    $width = imagesx($image);
    $height = imagesy($image);

    if ($width <= $max_width && $height <= $max_height) {
        return $imagedata; // No scaling needed
    }

    // Calculate new dimensions
    $ratio = min($max_width / $width, $max_height / $height);
    $new_width = round($width * $ratio);
    $new_height = round($height * $ratio);

    // Create a new image with the calculated dimensions
    $new_image = imagecreatetruecolor($new_width, $new_height);
    imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

    // Start output buffering
    ob_start();
    imagejpeg($new_image, null, 90); // You can adjust quality (90) as needed
    $scaled_imagedata = ob_get_clean();

    // Free up memory
    imagedestroy($image);
    imagedestroy($new_image);

    return $scaled_imagedata;
}


if (isset($_GET['action']) && $_GET['action'] === 'get_languages') {
    require_login();

    // Check for the capability
    if (!has_capability('atto/image:generatealttext', context_system::instance())) {
        throw new moodle_exception('nopermissions', 'error', '', 'get languages');
    }

    $languages = json_decode(get_config('atto_image', 'languages'), true);
    if (!$languages) {
        $languages = ['en' => 'Generate a concise alternative description for the image in English.'];
    }

    $formattedLanguages = [];
    foreach ($languages as $code => $prompt) {
        $formattedLanguages[] = ['code' => $code, 'name' => strtoupper($code) . ' - ' . substr($prompt, 0, 30) . '...'];
    }

    echo json_encode(['languages' => $formattedLanguages]);
    die();
}


$imageurl = required_param('imageurl', PARAM_URL);
$language = required_param('language', PARAM_ALPHA);
// Get rate limiting settings
$rate_limit_max = get_config('atto_image', 'rate_limit_max');
$rate_limit_time = get_config('atto_image', 'rate_limit_time');

// Get available languages and prompts
$languages = json_decode(get_config('atto_image', 'languages'), true);
if (!isset($languages[$language])) {
    echo json_encode(['error' => 'Invalid language selected']);
    die();
}

$prompt = $languages[$language];

// Implement rate limiting
$cache = cache::make('atto_image', 'requests');
$userrequest = $cache->get($USER->id);
if (!$userrequest) {
    $userrequest = ['count' => 0, 'time' => time()];
}

if ($userrequest['time'] < time() - $rate_limit_time) {
    // Reset if it's been more than the configured time
    $userrequest = ['count' => 1, 'time' => time()];
} else {
    $userrequest['count']++;
}

if ($userrequest['count'] > $rate_limit_max) {
    $minutes = ceil($rate_limit_time / 60);
    $error_message = "Rate limit exceeded. Maximum {$rate_limit_max} requests allowed per {$minutes} minute(s). Please try again later.";
    echo json_encode(['error' => $error_message]);
    die();
}

try {
    $cache->set($USER->id, $userrequest);
} catch (Exception $e) {
    $error_message = "Failed to update rate limit cache: " . $e->getMessage();
    echo json_encode(['error' => $error_message]);
    die();
}

// Parse the file path from the URL
$parsedurl = parse_url($imageurl);
$filepath = urldecode($parsedurl['path']);
$parts = explode('/', trim($filepath, '/'));

if (count($parts) < 5) {
    throw new moodle_exception('Invalid file path');
}

$contextid = (int)$parts[1];
$component = $parts[2];
$filearea = $parts[3];
$itemid = (int)$parts[4];
$filename = end($parts);

// File retrieval and processing
$fs = get_file_storage();
$file = $fs->get_file($contextid, $component, $filearea, $itemid, '/', $filename);

if (!$file) {
    echo json_encode(['error' => 'File not found']);
    die();
}

$mimetype = $file->get_mimetype();
$imagedata = $file->get_content();

// Scale down the image if necessary
$scaled_imagedata = scale_image($imagedata);

$base64image = base64_encode($scaled_imagedata);

// Debugging information
$debug_info = [
    'detected_mime' => $mimetype,
    'file_extension' => pathinfo($filename, PATHINFO_EXTENSION),
    'original_size' => strlen($imagedata),
    'scaled_size' => strlen($scaled_imagedata)
];

// Ensure the MIME type is supported
$supported_mimetypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
if (!in_array($mimetype, $supported_mimetypes)) {
    echo json_encode([
        'error' => 'Unsupported image format. Please use PNG, JPEG, GIF, or WebP.',
        'debug_info' => $debug_info
    ]);
    die();
}

// Prepare OpenAI API request
$apikey = get_config('atto_image', 'apikey');
$apiurl = get_config('atto_image', 'apiurl');
$model = get_config('atto_image', 'model');
$max_tokens = get_config('atto_image', 'max_tokens');
$detail = get_config('atto_image', 'detail');
if (!$apikey || !$apiurl || !$model || !$prompt || !$max_tokens) {
    echo json_encode(['error' => 'Missing configuration for OpenAI API']);
    die();
}

$image_content = [
    "type" => "image_url",
    "image_url" => [
        "url" => "data:{$mimetype};base64,{$base64image}"
    ]
];

// Add detail parameter if it's not set to 'none'
if ($detail !== 'none') {
    $image_content["image_url"]["detail"] = $detail;
}

$payload = [
    "model" => $model,
    "messages" => [
        [
            "role" => "user",
            "content" => [
                [
                    "type" => "text",
                    "text" => $prompt
                ],
                $image_content
            ]
        ]
    ],
    "max_tokens" => (int)$max_tokens
];

$debug_info['detail_setting'] = $detail;

$curl = new curl();
$curl->setHeader('Content-Type: application/json');
$curl->setHeader("Authorization: Bearer {$apikey}");
$response = $curl->post($apiurl, json_encode($payload));

$result = json_decode($response, true);

// At the end of the script, handle the successful case:
if (isset($result['choices'][0]['message']['content'])) {
    echo json_encode([
        'alttext' => $result['choices'][0]['message']['content'],
        'debug_info' => $debug_info
    ]);
} else {
    $error_message = isset($result['error']['message']) ? $result['error']['message'] : 'Unknown error';
    echo json_encode([
        'error' => 'Failed to generate alt text: ' . $error_message,
        'debug_info' => $debug_info
    ]);
}