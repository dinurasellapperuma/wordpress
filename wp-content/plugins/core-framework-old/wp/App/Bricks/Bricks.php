<?php

/**
 * CoreFramework
 *
 * @package   CoreFramework
 * @author    Core Framework <hello@coreframework.com>
 * @copyright 2023 Core Framework
 * @license   EULA + GPLv2
 * @link      https://coreframework.com
 */

declare(strict_types=1);

namespace CoreFramework\App\Bricks;

use CoreFramework\Common\Abstracts\Base;

/**
 * Class Bricks
 *
 * @package CoreFramework\App\Bricks
 * @since 0.0.1
 */
class Bricks extends Base {

	/**
	 * Initialize the class.
	 *
	 * @since 0.0.1
	 */
	public function init(): void {
		/**
		 * This Bricks class is only being instantiated in the Bricks builder as requested in the Scaffold class
		 *
		 * @see Requester::is_brick()
		 * @see Scaffold::__construct
		 *
		 * Add plugin code here
		 */

		if ( ! CoreFrameworkBricks()->determine_load() ) {
			return;
		}

		\add_action( 'init', array( $this, 'enqueue_builder_helpers' ), 9 );
		\add_action( 'init', array( $this, 'register_frontend_theme_helper' ), 10 );
		\add_action( 'init', array( $this, 'register_bricks_elements' ), 11 );
	}

	/**
	 * Determine if the plugin should be loaded.
	 *
	 * @since 1.2.0
	 */
	public static function register_bricks_elements() {
		if (
			! CoreFrameworkBricks()->is_bricks() ||
			! class_exists( 'Bricks\Elements' )
		) {
			return;
		}

		foreach ( glob( ( __DIR__ ) . '/Elements/*.php' ) as $filename ) {
			\Bricks\Elements::register_element( $filename );
		}
	}

	/**
	 * Enqueue helper scripts and styles in bricks builder
	 *
	 * @since 1.2.0
	 */
	public function enqueue_builder_helpers() {
		if ( ! ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) ) {
			return;
		}

		CoreFramework()->enqueue_core_framework_connector();

		$name = 'core-framework-bricks-helper';

		\wp_register_script(
			$name,
			\plugins_url( '/assets/public/js/bricks_builder.js', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . 'assets/public/js/bricks_builder.js' ),
			true,
		);
		\wp_enqueue_script( $name );

		\wp_register_style(
			$name,
			\plugins_url( '/assets/public/css/bricks_builder.css', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . 'assets/public/css/bricks_builder.css' ),
		);
		\wp_enqueue_style( $name );

		\wp_register_style(
			'core_framework_bricks_variable_ui',
			\plugins_url( '/assets/public/css/variable_ui.css', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . 'assets/public/css/variable_ui.css' ),
		);
		\wp_enqueue_style( 'core_framework_bricks_variable_ui' );
	}

	/**
	 * Register frontend theme helper
	 *
	 * @since 1.2.0
	 */
	public static function register_frontend_theme_helper() {
		if ( function_exists( 'bricks_is_builder_iframe' ) && bricks_is_builder_iframe() ) {
			return;
		}

		\wp_register_script(
			'core_framework_theme',
			\plugins_url( '/assets/public/js/core_framework_theme.js', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			filemtime( CORE_FRAMEWORK_DIR_ROOT . '/assets/public/js/core_framework_theme.js' ),
			false
		);
	}
}
