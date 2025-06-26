# Atto Image Plugin with AI-Powered Alt Text Generation

## Small Description

The Atto Image Plugin for Moodle, originally developed to facilitate image insertion and manipulation in the text editor, has been enhanced with AI-powered capabilities. This extended version now offers automatic alt text generation using Google AI Studio
## Original Functionality (2013)
The original Atto Image plugin, developed by Damyon Wiese in 2013, provides essential image insertion and manipulation features for the Moodle text editor. Key features include:

- Image upload and insertion into the editor
- URL-based image insertion
- Image alignment options (left, center, right)
- Image sizing (width and height)
- Alt text input for accessibility
- Image preview

## New AI-Powered Extensions (2024)
In 2024, Ries Patrick extended the plugin to include AI-powered alt text generation using Google AI Studio. The new features include:

1. **Automatic Alt Text Generation**: 
   - Utilizes Google AI Studio to generate descriptive alt text for images.
   - Supports multiple languages for alt text generation.

2. **Language Selection**:
   - Users can choose from multiple languages for alt text generation.
   - The language selection is configurable in the Moodle admin settings.

3. **Rate Limiting**:
   - Implements a rate-limiting mechanism to prevent API abuse.

4. **Image Scaling**:
   - Automatically scales large images before sending to the AI service to optimize performance and reduce API costs.

5. **Customizable API Settings**:
   - Allows administrators to configure API key, URL, model, and other parameters.

6. **Detail Level Control**:
   - Administrators can set the detail level for image analysis (none, low, high, auto).

7. **Multilingual Support**:
   - The plugin interface supports multiple languages through Moodle's language system.

## New Files and Major Changes

- `generate_alt.php`: Handles the server-side logic for AI-powered alt text generation.
- `altgenerator.js`: Provides the client-side functionality for alt text generation.
- `utils.js`: Contains utility functions for the extended plugin functionality.
- `settings.php`: Extended to include new configuration options for the AI features.
- `lib.php`: Updated to include new string definitions and parameter handling for the AI features.

## Configuration

Administrators can configure the plugin through the Moodle admin interface, including:

- API key for the Google AI Studio
- Google AI Studio API URL
- Model selection
- Maximum tokens for generation
- Rate limiting settings
- Image scaling parameters
- Language options for alt text generation
- Category prompts (JSON mapping of category codes to prompts)

## Usage

Users can generate alt text through the following flow:
1. Insert or edit an image in the editor.
2. Click the alt text generation button.
3. Choose the desired category (language or style).
4. The plugin sends the image to Google AI Studio using the configured API key and URL.
5. The generated text is automatically placed in the alt text field.

![Default Interface](/assetsmarkdown/default_interface.PNG)

![Language Interface](/assetsmarkdown/language_interface.PNG)

![Settings Interface](/assetsmarkdown/Settings_interface.PNG)


## Compiling  

- Running `\server\moodle\lib\editor\atto\plugins\image> npx grunt shifter`
---

This extension enhances accessibility and saves time for content creators by providing AI-generated, multilingual alt text for images in Moodle.