<?php

/**
 * @package   CoreFramework
 * @author    Core Framework <hello@coreframework.com>
 * @copyright 2023 Core Framework
 * @license   EULA + GPLv2
 * @link      https://coreframework.com
 *
 * Plugin Name:     Core Framework
 * Plugin URI:      https://coreframework.com
 * Description:     The CORE of your website
 * Version:         1.7.1
 * Author:          Core Framework
 * Author URI:      https://coreframework.com
 * Text Domain:     core-framework
 * Domain Path:     /languages
 * License:         GPLv2
 * License URI:     https://coreframework.com/eula + https://www.gnu.org/licenses/gpl-2.0.html
 * Requires PHP:    7.4
 * Requires WP:     6.0
 * Namespace:       CoreFramework
 */

declare(strict_types=1);

use CoreFramework\Common\Functions;
use CoreFramework\Config\Setup;
use CoreFramework\Scaffold;

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

define( 'CORE_FRAMEWORK_ABSOLUTE', __FILE__ );
define( 'CORE_FRAMEWORK_MAIN_FILE', plugin_basename( __FILE__ ) );
define( 'CORE_FRAMEWORK_DIR_ROOT', plugin_dir_path( __FILE__ ) );
define( 'CORE_FRAMEWORK_DIR_URL', plugin_dir_url( __FILE__ ) );

define( 'CORE_FRAMEWORK_NAME', dirname( CORE_FRAMEWORK_MAIN_FILE ) );

define( 'CORE_FRAMEWORK_DB_VER', '1.3' );
define( 'CORE_FRAMEWORK_VERSION', '1.7.1' );

define( 'CORE_FRAMEWORK_EDD_STORE_URL', 'https://edd.coreframework.com' );
define( 'CORE_FRAMEWORK_FREE_ITEM_ID', 40 );

define( 'CORE_FRAMEWORK_ASSETS_PREFIX', 'core-framework/core-framework/' );

$core_framework_autoloader = require CORE_FRAMEWORK_DIR_ROOT . 'vendor/autoload.php';

if ( ! wp_installing() ) {
	register_activation_hook( __FILE__, array( Setup::class, 'activation' ) );
	register_deactivation_hook( __FILE__, array( Setup::class, 'deactivation' ) );
	register_uninstall_hook( __FILE__, array( Setup::class, 'uninstall' ) );

	add_action( 'admin_init', array( Setup::class, 'on_plugin_update_completed' ), 10, 2 );
}

if ( ! class_exists( '\\' . Scaffold::class ) ) {
	wp_die( __( 'Core Framework is unable to find the Scaffold class.', 'core-framework' ) );
}

add_action(
	'plugins_loaded',
	function () use ( $core_framework_autoloader ): void {
		try {
			new Scaffold( $core_framework_autoloader );
		} catch ( Exception $e ) {
			wp_die( __( 'Core Framework is unable to run the Scaffold class.', 'core-framework' ) );
		}
	}
);

add_action( 'wp_initialize_site', array( Setup::class, 'on_new_multi_site_blog' ), 999, 2 );
add_action( 'admin_notices', 'core_framework_update_notices' );

function core_framework_update_notices(){
    if( get_transient( 'core-framework-update-notice' ) ){
        ?>
        <div class="updated notice is-dismissible">
            <p>Core Framework has been installed. Please save changes in Core Framework plugin to update your stylesheet.</p>
        </div>
        <?php
        delete_transient( 'core-framework-update-notice' );
    }
}

/**
 * Create a main function for external uses
 *
 * @return Functions
 * @since 0.0.0
 */
function CoreFramework(): Functions {
	return new Functions();
}

/**
 * Create a Oxygen function for external uses
 *
 * @since 0.0.0
 */
function CoreFrameworkOxygen(): \CoreFramework\App\Oxygen\Functions {
	return new \CoreFramework\App\Oxygen\Functions();
}

/**
 * Create a Bricks function for external uses
 *
 * @since 0.0.1
 */
function CoreFrameworkBricks(): \CoreFramework\App\Bricks\Functions {
	return new \CoreFramework\App\Bricks\Functions();
}

/**
 * Create a Gutenberg function for external uses
 *
 * @since 1.0.0
 */
function CoreFrameworkGutenberg(): \CoreFramework\App\Gutenberg\Functions {
	return new \CoreFramework\App\Gutenberg\Functions();
}

CoreFrameworkGutenberg()->init();
