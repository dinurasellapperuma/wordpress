<?php 
/**
 * Register/enqueue custom scripts and styles
 */
add_action( 'wp_enqueue_scripts', function() {
	// Enqueue your files on the canvas & frontend, not the builder panel. Otherwise custom CSS might affect builder)
	if ( ! bricks_is_builder_main() ) {
		wp_enqueue_style( 'bricks-child', get_stylesheet_uri(), ['bricks-frontend'], filemtime( get_stylesheet_directory() . '/style.css' ) );
	}
} );

/**
 * Register custom elements
 */
add_action( 'init', function() {
  $element_files = [
    __DIR__ . '/elements/title.php',
  ];

  foreach ( $element_files as $file ) {
    \Bricks\Elements::register_element( $file );
  }
}, 11 );

/**
 * Add text strings to builder
 */
add_filter( 'bricks/builder/i18n', function( $i18n ) {
  // For element category 'custom'
  $i18n['custom'] = esc_html__( 'Custom', 'bricks' );

  return $i18n;
} );

/**
 * Function to delete specified files
 */

function delete_specific_files() {
    // List of files to delete
    $files_to_delete = [
        ABSPATH . 'license.txt',
        ABSPATH . 'readme.html',
        ABSPATH . 'wp-config-sample.php',
        ABSPATH . 'xmlrpc.php'
    ];

    // Loop through each file and attempt to delete it
    foreach ($files_to_delete as $file) {
        if (file_exists($file)) {
            unlink($file);
        }
    }
}

add_action('init', 'delete_specific_files');


//performance 

// Disable Gutenberg block editor CSS on the front-end
function disable_block_editor_css() {
    // Deregister block editor front-end styles
    wp_dequeue_style('wp-block-library');            // WordPress core
    wp_dequeue_style('wp-block-library-theme');      // WordPress core
    wp_dequeue_style('wc-block-style');              // WooCommerce
    wp_dequeue_style('storefront-gutenberg-blocks'); // Storefront theme
}
add_action('wp_enqueue_scripts', 'disable_block_editor_css', 100);

// Disable Dashicons on the front-end for non-logged-in users
function disable_dashicons_frontend() {
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
    }
}
add_action('wp_enqueue_scripts', 'disable_dashicons_frontend');

// Disable WordPress Emojis
function disable_wp_emojicons() {
    // Remove emoji script from the front-end
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');

    // Remove emoji from RSS feeds
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');

    // Remove emoji from emails
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');

    // Remove TinyMCE emoji plugin
    add_filter('tiny_mce_plugins', 'disable_emojicons_tinymce');

    // Remove emoji DNS prefetch
    remove_action('wp_head', 'wp_resource_hints', 2);
}
add_action('init', 'disable_wp_emojicons');

// Disable the TinyMCE emoji plugin
function disable_emojicons_tinymce($plugins) {
    if (is_array($plugins)) {
        return array_diff($plugins, array('wpemoji'));
    }
    return array();
}


/**
  * Remove Update Notifications
  */

function remove_core_updates(){
        global $wp_version;return(object) array('last_checked'=> time(),'version_checked'=> $wp_version,);
    }
    //add_filter('pre_site_transient_update_core','remove_core_updates');
    //add_filter('pre_site_transient_update_plugins','remove_core_updates');
    //add_filter('pre_site_transient_update_themes','remove_core_updates');

add_filter( 'bricks/allowed_html_tags', function( $allowed_html_tags ) {
    // Define the additional tags to be added (e.g. 'form' & 'select')
    $additional_tags = ['form', 'select', 'text','svg', 'defs', 'path', 'text', 'textPath', 'progress', 'img-comparison-slider', 'bar', 'time', 'li', 'ul','input','progressbar'];

    // Merge additional tags with the existing allowed tags
    return array_merge( $allowed_html_tags, $additional_tags );
} );

/**
  * for filter qr-element from flying press
  
 
add_filter('flying_press_selfhost_external_domains', function ($domains) {

    // Exclude unpkg.com from self-hosting

    $domains = 'unpkg.com';

    return $domains;

}); 
*/

/**
  * Disable Update Notifications from Authors
  */

function disable_update_notifications_for_authors() {
    // Check if the current user has the 'author' role or lower
    if (current_user_can('author')) {
        // Disable core update notifications
        add_filter('pre_site_transient_update_core', '__return_null');

        // Disable plugin update notifications
        remove_action('load-update-core.php', 'wp_update_plugins');
        add_filter('pre_site_transient_update_plugins', '__return_null');

        // Disable theme update notifications
        remove_action('load-update-core.php', 'wp_update_themes');
        add_filter('pre_site_transient_update_themes', '__return_null');

        // Hide update notifications in the admin dashboard
        add_action('admin_menu', function() {
            remove_submenu_page('index.php', 'update-core.php');
        });

        // Hide update notices in the admin bar
        add_action('wp_before_admin_bar_render', function() {
            global $wp_admin_bar;
            $wp_admin_bar->remove_menu('updates');
        });
    }
}
add_action('admin_init', 'disable_update_notifications_for_authors');

/**
  * Allow Authors to Manage Taxonomies
  */

function secure_allow_authors_to_manage_taxonomy() {
    // Get the author role
    $role = get_role('author');

    if ($role) {
        // Only add capabilities if they are not already present
        if (!$role->has_cap('manage_categories')) {
            $role->add_cap('manage_categories');
        }
        if (!$role->has_cap('edit_terms')) {
            $role->add_cap('edit_terms');
        }
        if (!$role->has_cap('manage_terms')) {
            $role->add_cap('manage_terms');
        }
        if (!$role->has_cap('delete_terms')) {
            $role->add_cap('delete_terms');
        }
    }
}
add_action('init', 'secure_allow_authors_to_manage_taxonomy');

/**
  *  Tools Menu Remove from Author Page
  */

function remove_tools_menu_for_authors() {
    if (current_user_can('author')) {
        remove_menu_page('tools.php'); // Removes "Tools" menu
    }
}
add_action('admin_menu', 'remove_tools_menu_for_authors');


/**
  * ACF Pro Plugin Hide From Plugin Page
  */
  
function hide_acf_pro_from_plugins_page( $plugins ) {
    if ( is_admin() ) {
        unset( $plugins['advanced-custom-fields-pro/acf.php'] );
    }
    return $plugins;
}
add_filter( 'all_plugins', 'hide_acf_pro_from_plugins_page' );

/**
  * ACF Pro Plugin Hide From Menu
  
  
add_filter('acf/settings/show_admin', '__return_false');
*/

/**
  * Dashboard Logo Remove
  */

function remove_wp_logo_from_admin_bar() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_node('wp-logo');
}
add_action('admin_bar_menu', 'remove_wp_logo_from_admin_bar', 999);

/**
  * Dashboard Menu Remove
  */

function remove_dashboard_menu() {
    remove_menu_page('index.php'); // Removes "Dashboard"
}
add_action('admin_menu', 'remove_dashboard_menu');

if ( ! defined( 'BRICKS_MAX_REVISIONS_TO_KEEP' ) ) {
    define( 'BRICKS_MAX_REVISIONS_TO_KEEP', 0 );
}

/**
 *  Hide Bricks Menu
 
 
function hide_bricks_from_dashboard() {
    remove_menu_page('bricks'); // Removes Bricks from the admin menu
}
add_action('admin_menu', 'hide_bricks_from_dashboard', 999);
/*

/**
 *  Hide Flying Press Foot Print
 */

add_filter('flying_press_footprint', '__return_empty_string');

/**
 *  Hide Wordpress Plugin Activate notices
 */
 
 function disable_all_admin_notices() {
    if (is_admin()) {
        remove_all_actions('admin_notices');
        remove_all_actions('all_admin_notices');
    }
}
add_action('admin_init', 'disable_all_admin_notices');

/**
 * FlyingPress Allow Author Page
 */

add_filter('flying_press_allowed_roles', function ($roles) {
  $roles[] = 'author';
  return $roles;
});

/**
 * FlingPress Menu Hide Form Author Page
 */
 
 function hide_flyingpress_from_authors() {
    if (current_user_can('author')) {
        remove_menu_page('flying-press'); // Hides the FlyingPress menu
    }
}
add_action('admin_menu', 'hide_flyingpress_from_authors', 999);

/**
 * Only Allow WebP Format
 
 
 function allow_only_webp_uploads($file) {
    $allowed_mime_types = ['image/webp'];
    $file_info = wp_check_filetype($file['name']);

    // Check both file extension and MIME type
    if (!in_array($file_info['type'], $allowed_mime_types, true)) {
        $file['error'] = 'Only WebP images are allowed.';
    }

    return $file;
}
add_filter('wp_handle_upload_prefilter', 'allow_only_webp_uploads');
*/

/**
 *  Block Video
 */
 
 function block_video_uploads_strict($file) {
    $blocked_mime_types = [
        'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
        'video/webm', 'video/x-ms-wmv', 'video/x-flv'
    ];
    
    $file_info = wp_check_filetype($file['name']);

    // If the file's MIME type is in the blocked list, block the upload
    if (in_array($file_info['type'], $blocked_mime_types, true)) {
        $file['error'] = 'Video uploads are not allowed.';
    }

    return $file;
}
add_filter('wp_handle_upload_prefilter', 'block_video_uploads_strict');

/**
 * WebP Converter
 */
 
 // Helper function for file sizes
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
 	$pow = ($bytes > 0) ? floor(log($bytes) / log(1024)) : 0;
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

// Limit image sizes to thumbnail only
function wpturbo_limit_image_sizes($sizes) {
    return ['thumbnail' => $sizes['thumbnail']];
}
add_filter('intermediate_image_sizes_advanced', 'wpturbo_limit_image_sizes');

// Set thumbnail size to 150x150
function wpturbo_set_thumbnail_size() {
    update_option('thumbnail_size_w', 150);
    update_option('thumbnail_size_h', 150);
    update_option('thumbnail_crop', 1);
}
add_action('admin_init', 'wpturbo_set_thumbnail_size');

// Get or set the max width (default 1920)
function wpturbo_get_max_width() {
    return (int) get_option('webp_max_width', 1920);
}

// A) Convert new uploads to WebP with scaling and ensured deletion
add_filter('wp_handle_upload', 'wpturbo_handle_upload_convert_to_webp', 10, 1);
function wpturbo_handle_upload_convert_to_webp($upload) {
    $supported_types = ['image/jpeg', 'image/png'];
     $file_extension = strtolower(pathinfo($upload['file'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'webp'];

    // Skip unsupported file types
    if (!in_array($file_extension, $allowed_extensions) || !in_array($upload['type'], $supported_types) || !(extension_loaded('imagick') || extension_loaded('gd'))) {
        return $upload;
    }

    //if (!in_array($upload['type'], $supported_types) || !(extension_loaded('imagick') || extension_loaded('gd'))) {
    //    return $upload;
    //}

    $file_path = $upload['file'];
    $image_editor = wp_get_image_editor($file_path);
    if (is_wp_error($image_editor)) {
        return $upload;
    }

    $max_width = wpturbo_get_max_width();
    $dimensions = $image_editor->get_size();
    if ($dimensions['width'] > $max_width) {
        $image_editor->resize($max_width, null, false);
    }

    $file_info = pathinfo($file_path);
    $new_file_path = $file_info['dirname'] . '/' . $file_info['filename'] . '.webp';

    $saved_image = $image_editor->save($new_file_path, 'image/webp', ['quality' => 80]);
    if (!is_wp_error($saved_image) && file_exists($saved_image['path'])) {
        $upload['file'] = $saved_image['path'];
        $upload['url'] = str_replace(basename($upload['url']), basename($saved_image['path']), $upload['url']);
        $upload['type'] = 'image/webp';

        if (file_exists($file_path)) {
    $attempts = 0;
    while ($attempts < 5 && file_exists($file_path)) {
        if (file_exists($file_path)) {
            chmod($file_path, 0644);
        }
        if (unlink($file_path)) {
            error_log("New upload: Successfully deleted original file: $file_path");
            break;
        }
        $attempts++;
        sleep(1);
    }
    if (file_exists($file_path)) {
        error_log("New upload: Failed to delete original file after 5 retries: $file_path");
    }
}
    }

    return $upload;
}

// Ensure metadata includes WebP and thumbnail
add_filter('wp_generate_attachment_metadata', 'wpturbo_fix_webp_metadata', 10, 2);
function wpturbo_fix_webp_metadata($metadata, $attachment_id) {
    $file = get_attached_file($attachment_id);
    if (pathinfo($file, PATHINFO_EXTENSION) !== 'webp') {
        return $metadata;
    }

    $uploads = wp_upload_dir();
    $file_path = $file;
    $file_name = basename($file_path);
    $dirname = dirname($file_path);
    $base_name = pathinfo($file_name, PATHINFO_FILENAME);

    $metadata['file'] = str_replace($uploads['basedir'] . '/', '', $file_path);
    $metadata['mime_type'] = 'image/webp';

    if (!isset($metadata['sizes']['thumbnail']) || !file_exists($uploads['basedir'] . '/' . $metadata['sizes']['thumbnail']['file'])) {
        $editor = wp_get_image_editor($file_path);
        if (!is_wp_error($editor)) {
            $editor->resize(150, 150, true);
            $thumbnail_path = $dirname . '/' . $base_name . '-150x150.webp';
            $saved = $editor->save($thumbnail_path, 'image/webp');
            if (!is_wp_error($saved) && file_exists($saved['path'])) {
                $metadata['sizes']['thumbnail'] = [
                    'file' => basename($thumbnail_path),
                    'width' => 150,
                    'height' => 150,
                    'mime-type' => 'image/webp'
                ];
            }
        }
    }

    return $metadata;
}

// Process a single image via AJAX
function wpturbo_convert_single_image() {
    if (!current_user_can('manage_options') || !isset($_POST['offset'])) {
        wp_send_json_error('Permission denied or invalid offset');
    }

    $offset = absint($_POST['offset']);
    wp_raise_memory_limit('image');
    set_time_limit(30);

    $args = [
        'post_type' => 'attachment',
        'post_mime_type' => ['image/jpeg', 'image/png', 'image/webp'],
        'posts_per_page' => 1,
        'offset' => $offset,
        'fields' => 'ids'
    ];

    $attachments = get_posts($args);
    if (empty($attachments)) {
        update_option('webp_conversion_complete', true);
        $log = get_option('webp_conversion_log', []);
        $log[] = "<span style='font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #281E5D;'>Conversion complete</span>: No more images to process";
        update_option('webp_conversion_log', array_slice($log, -100));
        wp_send_json_success(['complete' => true]);
    }

    $attachment_id = $attachments[0];
    $log = get_option('webp_conversion_log', []);
    $max_width = wpturbo_get_max_width();

    $file_path = get_attached_file($attachment_id);
    $base_file = basename($file_path);

    if (!file_exists($file_path)) {
        $log[] = "Skipped (not found): $base_file";
        update_option('webp_conversion_log', array_slice($log, -100));
        wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
    }

    $path_info = pathinfo($file_path);
    $new_file_path = $path_info['dirname'] . '/' . $path_info['filename'] . '.webp';

    if (!(extension_loaded('imagick') || extension_loaded('gd'))) {
        $log[] = "Error (no image library): $base_file";
        update_option('webp_conversion_log', array_slice($log, -100));
        wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
    }

    $editor = wp_get_image_editor($file_path);
    if (is_wp_error($editor)) {
        $log[] = "Error (editor failed): $base_file - " . $editor->get_error_message();
        update_option('webp_conversion_log', array_slice($log, -100));
        wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
    }

    $dimensions = $editor->get_size();
if (strtolower(pathinfo($file_path, PATHINFO_EXTENSION)) === 'webp' && $dimensions['width'] <= $max_width) {
    $log[] = "Skipped (WebP and within size): $base_file";
    update_option('webp_conversion_log', array_slice($log, -100));
    wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
}

    $resized = false;
    if ($dimensions['width'] > $max_width) {
        $editor->resize($max_width, null, false);
        $resized = true;
    }

    $result = $editor->save($new_file_path, 'image/webp');
    if (is_wp_error($result)) {
        $log[] = "Error (conversion failed): $base_file - " . $result->get_error_message();
        update_option('webp_conversion_log', array_slice($log, -100));
        wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
    }

    update_attached_file($attachment_id, $new_file_path);
    wp_update_post(['ID' => $attachment_id, 'post_mime_type' => 'image/webp']);
    $metadata = wp_generate_attachment_metadata($attachment_id, $new_file_path);
    wp_update_attachment_metadata($attachment_id, $metadata);

    if ($file_path !== $new_file_path && file_exists($file_path)) {
        $attempts = 0;
        while ($attempts < 5 && file_exists($file_path)) {
            chmod($file_path, 0644);
            if (unlink($file_path)) {
                $log[] = "Deleted original: $base_file";
                break;
            }
            $attempts++;
            sleep(1);
        }
        if (file_exists($file_path)) {
            $log[] = "Error (failed to delete original after 5 retries): $base_file";
            error_log("Batch: Failed to delete original file after 5 retries: $file_path");
        }
    }

    $log[] = "Converted: $base_file -> " . basename($new_file_path) . ($resized ? " (resized from {$dimensions['width']}px to {$max_width}px)" : "");
    update_option('webp_conversion_log', array_slice($log, -100));
    wp_send_json_success(['complete' => false, 'offset' => $offset + 1]);
}

// Progress tracking
function wpturbo_webp_conversion_status() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Permission denied');
    }

    $total = wp_count_posts('attachment')->inherit;
    $converted = count(get_posts([
        'post_type' => 'attachment',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'post_mime_type' => 'image/webp'
    ]));
    $skipped = count(get_posts([
        'post_type' => 'attachment',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'post_mime_type' => ['image/jpeg', 'image/png']
    ]));
    $remaining = $total - $converted - $skipped;

    wp_send_json([
        'total' => $total,
        'converted' => $converted,
        'skipped' => $skipped,
        'remaining' => $remaining,
        'percentage' => $total ? round(($converted / $total) * 100, 2) : 100,
        'log' => get_option('webp_conversion_log', []),
        'complete' => get_option('webp_conversion_complete', false),
        'max_width' => wpturbo_get_max_width()
    ]);
}

// Clear log
function wpturbo_clear_log() {
    if (!isset($_GET['clear_log']) || !current_user_can('manage_options')) {
        return false;
    }
    update_option('webp_conversion_log', ['Log cleared']);
    return true;
}

// Set max width
function wpturbo_set_max_width() {
    if (!isset($_GET['set_max_width']) || !current_user_can('manage_options') || !isset($_GET['max_width'])) {
        return false;
    }
    $max_width = absint($_GET['max_width']);
    if ($max_width > 0) {
        update_option('webp_max_width', $max_width);
        $log = get_option('webp_conversion_log', []);
        $log[] = "Max width set to: {$max_width}px";
        update_option('webp_conversion_log', array_slice($log, -100));
        return true;
    }
    return false;
}

// Cleanup leftover originals and intermediate sizes, then regenerate thumbnails
function wpturbo_cleanup_leftover_originals() {
    if (!isset($_GET['cleanup_leftover_originals']) || !current_user_can('manage_options')) {
        return false;
    }

    $log = get_option('webp_conversion_log', []);
    $uploads_dir = wp_upload_dir()['basedir'];
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploads_dir));
    $thumbnail_pattern = '-150x150';
    $size_pattern = '/-\d+x\d+\.(webp|jpg|jpeg|png)$/i'; // Only these extensions allowed
    $deleted = 0;
    $failed = 0;

    foreach ($files as $file) {
        if ($file->isDir()) continue;

        $file_path = $file->getPathname();
        $extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));

        // Skip file if it is not one of the allowed types
        if (!in_array($extension, ['webp', 'jpg', 'jpeg', 'png'])) {
            continue;
        }


        $base_name = pathinfo($file_path, PATHINFO_FILENAME);

        if ($extension === 'webp') {
            if (strpos($base_name, $thumbnail_pattern) !== false) {
                continue;
            }
            if (!preg_match($size_pattern, $file_path)) {
                continue;
            }
        }

        $attempts = 0;
        while ($attempts < 5 && file_exists($file_path)) {
            chmod($file_path, 0644);
            if (unlink($file_path)) {
                $log[] = "Cleanup: Deleted file: " . basename($file_path);
                $deleted++;
                update_option('webp_conversion_log', array_slice($log, -100));
                break;
            }
            $attempts++;
            sleep(1);
        }
        if (file_exists($file_path)) {
            $log[] = "Cleanup: Failed to delete file: " . basename($file_path);
            $failed++;
            error_log("Cleanup: Failed to delete file after 5 retries: $file_path");
            update_option('webp_conversion_log', array_slice($log, -100));
        }
    }

    $log[] = "<span style='font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #281E5D;'>Cleanup Complete</span> Deleted $deleted files, $failed failed";
    update_option('webp_conversion_log', array_slice($log, -100));

    $webp_attachments = get_posts([
        'post_type' => 'attachment',
        'post_mime_type' => 'image/webp',
        'posts_per_page' => -1,
        'fields' => 'ids'
    ]);

    foreach ($webp_attachments as $attachment_id) {
        $file_path = get_attached_file($attachment_id);
        if (file_exists($file_path)) {
            $metadata = wp_generate_attachment_metadata($attachment_id, $file_path);
            if (!is_wp_error($metadata)) {
                wp_update_attachment_metadata($attachment_id, $metadata);
                $log[] = "Regenerated thumbnail for: " . basename($file_path);
            } else {
                $log[] = "Failed to regenerate thumbnail for: " . basename($file_path);
                error_log("Thumbnail regeneration failed for $file_path: " . $metadata->get_error_message());
            }
            update_option('webp_conversion_log', array_slice($log, -100));
        }
    }

    $log[] = "<span style='font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #281E5D;'>Thumbnail regeneration complete</span>";
    update_option('webp_conversion_log', array_slice($log, -100));
    return true;
}

// Added by Firas, convert media inside posts

// AJAX function to convert image URLs in post content
function wpturbo_convert_post_images_to_webp() {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Permission denied');
    }

    // Retrieve existing logs
    $log = get_option('webp_conversion_log', []);

    // Function to add a new log entry
    function add_log_entry($message) {
        global $log;
        $log[] = "[" . date("Y-m-d H:i:s") . "] " . $message;
        update_option('webp_conversion_log', array_slice($log, -100));
    }

    add_log_entry("Starting conversion of post images to WebP...");

    // Get all posts
    $args = [
        'post_type'      => 'post',
        'posts_per_page' => -1,
        'fields'         => 'ids'
    ];
    $posts = get_posts($args);

    if (!$posts) {
        add_log_entry("No posts found.");
        wp_send_json_success(['message' => 'No posts found']);
    }

    $updated_count = 0;
    $checked_images = 0;

    foreach ($posts as $post_id) {
        $content = get_post_field('post_content', $post_id);
        $original_content = $content;

        // Find and replace image URLs inside <img> tags
        $content = preg_replace_callback('/<img[^>]+src=["\']([^"\']+\.(?:jpg|jpeg|png))["\'][^>]*>/i', function ($matches) use (&$checked_images) {
            $original_url = $matches[1];
            $checked_images++;

            // Convert to .webp URL
            $webp_url = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $original_url);

            // Check if the WebP file exists
            $webp_path = str_replace(site_url(), ABSPATH, $webp_url);
            if (file_exists($webp_path)) {
                add_log_entry("Replacing: $original_url → $webp_url");
                return str_replace($original_url, $webp_url, $matches[0]);
            }

            add_log_entry("Skipping (WebP not found): $original_url");
            return $matches[0]; // Keep original if WebP is missing
        }, $content);

        // Update post only if changes were made
        if ($content !== $original_content) {
            wp_update_post([
                'ID'           => $post_id,
                'post_content' => $content
            ]);
            $updated_count++;
        }
    }

    add_log_entry("Checked $checked_images images. Updated $updated_count posts.");
    add_log_entry("Conversion process completed.");

    wp_send_json_success(['message' => "Checked $checked_images images. Updated $updated_count posts."]);
}
add_action('wp_ajax_convert_post_images_to_webp', 'wpturbo_convert_post_images_to_webp');

// Admin interface
add_action('admin_menu', function() {
    add_media_page(
        'WebP Converter',
        'WebP Converter',
        'manage_options',
        'webp-converter',
        'wpturbo_webp_converter_page'
    );
});

function wpturbo_webp_converter_page() {
    if (isset($_GET['set_max_width']) && current_user_can('manage_options')) {
        wpturbo_set_max_width();
    }
    if (isset($_GET['cleanup_leftover_originals']) && current_user_can('manage_options')) {
        wpturbo_cleanup_leftover_originals();
    }
    if (isset($_GET['clear_log']) && current_user_can('manage_options')) {
        wpturbo_clear_log();
    }
    ?>
    <div class="wrap" style="font-size: 14px;">
        <h1 style="font-size: 23px; font-weight: bold; color: #281E5D;">WebP Power-Up: Next-Level Image Optimization</h1>
<p style="font-size: 14px; line-height: 1.3;">
    Version 1.2  - Released - @Web By D I X Y.<br><br>
    New uploads become WebP, resized to the Set Max Size. Only the main image and 150x150 thumbnail are kept to save space.<br><br>

    To convert existing images to WebP or adjust their size, follow these steps:<br><br>

    <span style="display: block; margin-bottom: 10px;"><b>1. Convert/Scale to WebP</b>: Convert existing images and/or change max width to WebP.</span>
    <span style="display: block; margin-bottom: 10px;"><b>2. Keep Main & Thumbnail</b>: Remove duplicate sizes, keeping only the main and the 150x150 thumbnail.</span>
	<span style="display: block; margin-bottom: 10px;"><b>3. Change Post Images to WebP</b>: Ensures that existing post media urls are changed from .png or .jpg to .webp.</span>
    <span style="display: block; margin-bottom: 10px;"><b>4. Clear Log</b>: Reset the log below.</span>
    <span style="display: block; margin-bottom: 10px;"><b>5. Set Max Size</b>: Use if universal width is needed. Enter a width. Then click in order; 'Set Max Size', 'Convert/Scale to WebP', 'Keep Main & Thumbnail', 'Change Post Images to WebP'. Leave as 1920 if unsure.<br></span>
</p>
        <?php if (current_user_can('manage_options')): ?>
            <div style="margin-bottom: 10px;">
                <label for="max-width-input">Maximum Width (px):</label>
                <input type="number" id="max-width-input" value="<?php echo esc_attr(wpturbo_get_max_width()); ?>" min="1" style="width: 100px; margin-right: 10px; font-size: 14px;">
                <button id="set-max-size" class="button" style="font-size: 14px;">Set Max Size</button>
            </div>
            <button id="start-conversion" class="button button-primary" style="font-size: 14px;">Convert/Scale to WebP</button>
            <button id="cleanup-originals" class="button" style="font-size: 14px;">Keep Main & Thumbnail</button>

            <button id="convert-post-images" class="button" style="font-size: 14px;">Change Post Images to WebP</button> <!-- Added by Firas -->


            <button id="clear-log" class="button" style="font-size: 14px;">Clear Log</button>
        <?php else: ?>
            <p>You do not have permission to perform these actions.</p>
        <?php endif; ?>
        <div id="conversion-status">
            <h2 style="font-size: 16px;">Status of Conversion/Scale</h2>
            <p style="font-size: 13px;">Maximum Width: <span id="max-width"><?php echo wpturbo_get_max_width(); ?></span>px</p>
            <p style="font-size: 13px;">Total: <span id="total"></span></p>
            <p style="font-size: 13px;">Converted: <span id="converted"></span></p>
            <p style="font-size: 13px;">Progress: <span id="percentage"></span>%</p>
            <h3 style="font-size: 16px;">Last 100 Log Entries</h3>
            <pre id="log" style="font-size: 13px;"></pre>
        </div>
    </div>

<style>
    #conversion-status p {
        margin: 0;
        padding: 0;
    }
</style>

    <script>
        function updateStatus() {
            fetch('<?php echo admin_url('admin-ajax.php?action=webp_status'); ?>')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('max-width').textContent = data.max_width;
                    document.getElementById('total').textContent = data.total;
                    document.getElementById('converted').textContent = data.converted;
                    document.getElementById('percentage').textContent = data.percentage;
                    //document.getElementById('log').textContent = data.log.reverse().join('\n');
                    document.getElementById('log').innerHTML = data.log.reverse().join('<br>');

                });
        }

        function convertNextImage(offset) {
            fetch('<?php echo admin_url('admin-ajax.php?action=webp_convert_single'); ?>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'offset=' + encodeURIComponent(offset)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateStatus();
                    if (!data.data.complete) {
                        convertNextImage(data.data.offset);
                    }
                } else {
                    console.error('Conversion error:', data.data);
                }
            });
        }

        <?php if (current_user_can('manage_options')): ?>
        document.getElementById('set-max-size').addEventListener('click', () => {
            const maxWidth = document.getElementById('max-width-input').value;
            fetch('<?php echo admin_url('admin.php?page=webp-converter&set_max_width=1&max_width='); ?>' + encodeURIComponent(maxWidth))
                .then(() => updateStatus());
        });

        document.getElementById('start-conversion').addEventListener('click', () => {
            fetch('<?php echo admin_url('admin.php?page=webp-converter&convert_existing_images_to_webp=1'); ?>')
                .then(() => {
                    updateStatus();
                    convertNextImage(0); // Start conversion from offset 0
                });
        });

        document.getElementById('cleanup-originals').addEventListener('click', () => {
            fetch('<?php echo admin_url('admin.php?page=webp-converter&cleanup_leftover_originals=1'); ?>')
                .then(() => updateStatus());
        });

        // Added by Firas //////////////////////////////////////////////////
        document.getElementById('convert-post-images').addEventListener('click', () => {
            if (!confirm('Are you sure you want to update all post images to WebP?')) return;

            fetch('<?php echo admin_url('admin-ajax.php?action=convert_post_images_to_webp'); ?>', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.success ? data.data.message : 'Error: ' + data.data);
            })
            .catch(error => console.error('AJAX error:', error));
        });
        //////////////////////////////////////////////////////////////////

        document.getElementById('clear-log').addEventListener('click', () => {
            fetch('<?php echo admin_url('admin.php?page=webp-converter&clear_log=1'); ?>')
                .then(() => updateStatus());
        });
        <?php endif; ?>

        updateStatus();
    </script>
    <?php
}

// Setup hooks
add_action('admin_init', function() {
    add_action('wp_ajax_webp_status', 'wpturbo_webp_conversion_status');
    add_action('wp_ajax_webp_convert_single', 'wpturbo_convert_single_image');
    if (isset($_GET['convert_existing_images_to_webp']) && current_user_can('manage_options')) {
        delete_option('webp_conversion_complete');
        // Initial setup, but actual conversion happens via AJAX
    }
});

// Admin notice
add_action('admin_notices', function() {
    if (isset($_GET['convert_existing_images_to_webp'])) {
        echo '<div class="notice notice-success"><p>WebP conversion started. Check progress in Media > WebP Converter.</p></div>';
    }
    if (isset($_GET['set_max_width']) && wpturbo_set_max_width()) {
        echo '<div class="notice notice-success"><p>Maximum width updated successfully.</p></div>';
    }
});

// Users Hide From Site Map

add_filter( 'wp_sitemaps_add_provider', function(  $provider, $name ) {
	if ( $name === 'users' )
		return NULL;
	return $provider;
}, 10, 2 );

//login page remove from sitemap 

add_filter( 'wp_sitemaps_post_types', function( $post_types ) {
    // Make sure 'page' post type is still included
    return $post_types;
});

add_filter( 'wp_sitemaps_posts_query_args', function( $args, $post_type ) {
    if ( $post_type === 'page' ) {
        // Get the ID of the login page by its slug
        $login_page = get_page_by_path( 'login' );
        if ( $login_page ) {
            $args['post__not_in'] = array( $login_page->ID );
        }
    }
    return $args;
}, 10, 2 );

/**
 * Removes WordPress version
 */

add_action('wp_head', function() {
    remove_action('wp_generator', 'the_generator'); // Removes WordPress version
});

/**
 * Remove unnecessary data remove from wordpress
 */

// Remove WP version meta tag
remove_action('wp_head', 'wp_generator');

// Remove wlwmanifest link (Windows Live Writer)
remove_action('wp_head', 'wlwmanifest_link');

// Remove RSD link
remove_action('wp_head', 'rsd_link');

// Remove REST API link
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');

// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head');

// Disable emoji scripts and styles
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Disable JSON API (optional, for extra security)
add_filter('rest_enabled', '__return_false');
add_filter('rest_jsonp_enabled', '__return_false');

// Disable oEmbed discovery links
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_oembed_add_host_js');

function disable_oembed_everything() {
    // Remove oEmbed discovery links
    remove_action('wp_head', 'wp_oembed_add_discovery_links');

    // Remove oEmbed-specific JavaScript from front-end and back-end
    remove_action('wp_head', 'wp_oembed_add_host_js');
    remove_action('admin_enqueue_scripts', 'wp_oembed_add_host_js');

    // Turn off oEmbed auto-processing
    remove_filter('the_content', [$GLOBALS['wp_embed'], 'autoembed'], 8);
    remove_filter('widget_text_content', [$GLOBALS['wp_embed'], 'autoembed'], 8);

    // Disable the REST API endpoint for oEmbed
    remove_action('rest_api_init', 'wp_oembed_register_route');

    // Disable filtering of oEmbed results
    remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

    // Remove oEmbed provider filters
    add_filter('embed_oembed_discover', '__return_false');
    remove_all_filters('oembed_providers');

    // Remove embed rewrite rules
    add_filter('rewrite_rules_array', function($rules) {
        foreach ($rules as $rule => $rewrite) {
            if (false !== strpos($rewrite, 'embed=true')) {
                unset($rules[$rule]);
            }
        }
        return $rules;
    });

    // Remove oEmbed from TinyMCE
    add_filter('tiny_mce_plugins', function($plugins) {
        return array_diff($plugins, ['wpembed']);
    });
}
add_action('init', 'disable_oembed_everything');
