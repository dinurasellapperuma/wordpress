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

namespace CoreFramework\App\Oxygen;

use CoreFramework\Common\Abstracts\Base;
use CoreFramework\Helper;

/**
 * Class Oxygen
 *
 * @package CoreFramework\App\Oxygen
 * @since 0.0.0
 */
class Functions extends Base {

	/**
	 * Name of Core Framework selectors folder and color set in Oxygen
	 *
	 * @since 0.0.0
	 * @var string
	 */
	public const CORE_FOLDER = 'CoreFramework';

	/**
	 * Oxygen components classes option
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public const OXYGEN_COMPONENTS_CLASSES_OPTION = 'ct_components_classes';

	/**
	 * Oxygen classes folder option
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public const OXYGEN_CLASSES_FOLDER_OPTION = 'ct_style_folders';

	/**
	 * Oxygen color palettes option
	 *
	 * @since 0.0.1
	 * @var string
	 */
	public const OXYGEN_COLOR_PALETTES_OPTION = 'oxygen_vsb_global_colors';

	/**
	 * Initialize the class.
	 *
	 * @since 0.0.0
	 */
	public function init(): void {
		/**
		 * This Oxygen class is only being instantiated in the Oxygen builder as requested in the Scaffold class
		 *
		 * @see Requester::isOxygen()
		 * @see Scaffold::__construct
		 *
		 * Add plugin code here
		 */
	}

	/**
	 * Refresh Oxygen selectors
	 *
	 * @since 0.0.0
	 */
	public function refresh_selectors( $new_core_selectors_array ): void {
		$this->add_selectors_folder();

		$ct_class_names            = get_option( self::OXYGEN_COMPONENTS_CLASSES_OPTION, array() );
		$prev_core_selectors_array = array();

		foreach ( $ct_class_names as $ct_class_name ) {
			if ( $ct_class_name['parent'] === self::CORE_FOLDER ) {
				array_push( $prev_core_selectors_array, $ct_class_name['key'] );
			}
		}

		foreach ( $prev_core_selectors_array as $prev_core_selector_array ) {
			unset( $ct_class_names[ $prev_core_selector_array ] );
		}

		foreach ( $new_core_selectors_array as $new_core_selector_array ) {
			$is_duplicate = array_key_exists( $new_core_selector_array, $ct_class_names );

			if ( $is_duplicate ) {
				continue;
			}

			$ct_class_names[ $new_core_selector_array ] = array(
				'key'      => $new_core_selector_array,
				'parent'   => self::CORE_FOLDER,
				'original' => array( 'selector-locked' => 'true' ),
			);
		}

		update_option( self::OXYGEN_COMPONENTS_CLASSES_OPTION, $ct_class_names, false );
	}

	/**
	 * Remove Core Framework selectors from Oxygen. Used when uninstalling the plugin
	 *
	 * @since 0.0.0
	 */
	public function remove_selectors(): void {
		$is_oxygen                = $this->is_oxygen();
		$has_ct_components_option = get_option( self::OXYGEN_COMPONENTS_CLASSES_OPTION, array() ) ?: array();

		if ( ! $is_oxygen || ! $has_ct_components_option ) {
			return;
		}

		$ct_class_names = get_option( self::OXYGEN_COMPONENTS_CLASSES_OPTION, array() ) ?: array();

		foreach ( $ct_class_names as $ct_class_name ) {
			if ( ( $ct_class_name['parent'] ?? '' ) === self::CORE_FOLDER ) {
				unset( $ct_class_names[ $ct_class_name['key'] ] );
			}
		}

		update_option( self::OXYGEN_COMPONENTS_CLASSES_OPTION, $ct_class_names, false );
	}

	/**
	 * Check if oxygen is activated
	 *
	 * @since 0.0.0
	 */
	public function is_oxygen(): bool {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
		return is_plugin_active( 'oxygen/functions.php' ) || ( isset( $_GET['ct_builder'] ) && 'true' === $_GET['ct_builder'] ) || class_exists( 'CT_Component' );
	}

	/**
	 * Handle oxygen builder uninstall. Remove Core Framework selectors and colors
	 *
	 * @since 0.0.0
	 */
	public function handle_uninstall(): void {
		if ( ! $this->is_oxygen() ) {
			return;
		}

		$this->remove_selectors();
		$this->remove_selectors_folder();
		$this->remove_colors();
	}

	/**
	 * Add Core Framework folder to organize selectors
	 *
	 * @since 0.0.0
	 */
	public function add_selectors_folder(): void {
		$folders = get_option( self::OXYGEN_CLASSES_FOLDER_OPTION, array() ) ?: array();

		if ( array_key_exists( self::CORE_FOLDER, $folders ) ) {
			return;
		}

		$folders[ self::CORE_FOLDER ] = array(
			'key'    => self::CORE_FOLDER,
			'status' => 1,
		);

		update_option( self::OXYGEN_CLASSES_FOLDER_OPTION, $folders, false );
	}

	/**
	 * Remove Core Framework folder
	 *
	 * @since 0.0.0
	 */
	public function remove_selectors_folder(): void {
		$folders = get_option( self::OXYGEN_CLASSES_FOLDER_OPTION, array() ) ?: array();

		if ( ! array_key_exists( self::CORE_FOLDER, $folders ) ) {
			return;
		}

		unset( $folders[ self::CORE_FOLDER ] );
		update_option( self::OXYGEN_CLASSES_FOLDER_OPTION, $folders, false );
	}

	/**
	 * Add colors to Oxygen color system
	 */
	public function update_colors( $new_colors ): void {
		if ( ( is_countable( $new_colors ) ? count( $new_colors ) : 0 ) < 1 ) {
			$this->remove_colors();
			return;
		}

		$this->add_color_folder_name();

		$oxygen_colors = get_option( self::OXYGEN_COLOR_PALETTES_OPTION, array() );
		$oxygen_sets   = $oxygen_colors['sets'] ?: array();
		$core_set_id   = null;

		foreach ( $oxygen_sets as $oxygen_set ) {
			if ( $oxygen_set['name'] === self::CORE_FOLDER ) {
				$core_set_id = $oxygen_set['id'];
			}
		}

		if ( $core_set_id === null ) {
			return;
		}

		$colors = $oxygen_colors['colors'] ?: array();
		$colors = array_filter( $colors, fn ( $color ): bool => $color['set'] !== $core_set_id );

		foreach ( $new_colors as $new_color ) {
			if ( isset( $new_color['dark'] ) && $new_color['dark'] ) {
				continue;
			}

			$colors[] = array(
				'name'  => $new_color['name'],
				'value' => $new_color['raw'],
				'id'    => substr( $new_color['id'], -6 ),
				'set'   => $core_set_id,
			);
		}

		$colors                           = array_values( $colors );
		$oxygen_colors['colors']          = $colors;
		$oxygen_colors['colorsIncrement'] = is_countable( $colors ) ? count( $colors ) : 0;
		$oxygen_colors['setsIncrement']   = is_countable( $oxygen_sets ) ? count( $oxygen_sets ) : 0;

		update_option( self::OXYGEN_COLOR_PALETTES_OPTION, $oxygen_colors, false );
	}

	/**
	 * Add color folder name to Oxygen color system
	 *
	 * @since 0.0.0
	 */
	public function add_color_folder_name(): void {
		$oxygen_colors = get_option( self::OXYGEN_COLOR_PALETTES_OPTION, array() );

		if ( empty( $oxygen_colors ) ) {
			$oxygen_colors = array(
				'colors' => array(),
				'sets'   => array(),
			);
		}

		$oxygen_sets = $oxygen_colors['sets'] ?: array();

		$existing_set = CoreFramework()->array_some( $oxygen_sets, fn ( $set ): bool => $set['name'] === self::CORE_FOLDER );

		if ( $existing_set ) {
			return;
		}

		$oxygen_sets[] = array(
			'name' => self::CORE_FOLDER,
			'id'   => ( is_countable( $oxygen_sets ) ? count( $oxygen_sets ) : 0 ) + 1,
		);

		$oxygen_colors['sets'] = $oxygen_sets;

		update_option( self::OXYGEN_COLOR_PALETTES_OPTION, $oxygen_colors, false );
	}

	/**
	 * Remove colors and color set from Oxygen color system
	 *
	 * @since 0.0.0
	 */
	public function remove_colors(): bool {
		$oxygen_global_colors = get_option( self::OXYGEN_COLOR_PALETTES_OPTION, array() );

		if ( empty( $oxygen_global_colors ) ) {
			return false;
		}

		$oxygen_sets   = $oxygen_global_colors['sets'] ?: array();
		$oxygen_colors = $oxygen_global_colors['colors'] ?: array();

		if ( empty( $oxygen_sets ) || empty( $oxygen_colors ) ) {
			return false;
		}

		$core_set_id = null;

		foreach ( $oxygen_sets as $set ) {
			if ( $set['name'] === self::CORE_FOLDER ) {
				$core_set_id = $set['id'];
			}
		}

		if ( $core_set_id === null ) {
			return false;
		}

		$oxygen_colors = array_filter( $oxygen_colors, fn ( $color ): bool => $color['set'] !== $core_set_id );

		$oxygen_sets = array_filter( $oxygen_sets, fn ( $set ): bool => $set['name'] !== self::CORE_FOLDER );

		$oxygen_global_colors['colors']          = $oxygen_colors;
		$oxygen_global_colors['sets']            = $oxygen_sets;
		$oxygen_global_colors['colorsIncrement'] = count( (array) $oxygen_colors );
		$oxygen_global_colors['setsIncrement']   = count( (array) $oxygen_sets );

		update_option( self::OXYGEN_COLOR_PALETTES_OPTION, $oxygen_global_colors, false );

		return true;
	}

	/**
	 * Enqueue styles for Oxygen
	 *
	 * @return void
	 */
	public function enqueue() {
		$helper = new Helper();

		global $wp_styles;

		$wp_styles->add(
			'core-framework-frontend',
			$helper->getStylesheetUrl(),
			array(),
			$helper->getStylesheetVersion(),
			'all'
		);
		$wp_styles->do_items( 'core-framework-frontend' );
	}

	/**
	 * Enqueue styles in oxygen builder iframe
	 *
	 * @return void
	 */
	public function enqueue_styles_oxygen_iframe() {
		$helper  = new Helper();
		$version = $helper->getStylesheetVersion();
		$url     = $helper->getStylesheetUrl();

		echo '<link rel="stylesheet" id="core-framework-frontend-css" href="' . $url . '?ver=' . esc_attr( $version ) . '" type="text/css" media="all">';
	}

	/**
	 * Enqueue Helper styles for Oxygen allowing preview of colors defined by a variable
	 *
	 * @return void
	 */
	public function enqueue_helper() {
		CoreFramework()->enqueue_core_framework_connector();

		$name       = 'core_framework_oxygen_css_helper';
		$css_string = get_option(
			$name,
			''
		);

		wp_register_style( $name, false );
		wp_enqueue_style( $name );
		wp_add_inline_style(
			$name,
			$css_string
		);

		$script_name = 'core_framework_oxygen_js_helper';
		\wp_register_script(
			$script_name,
			\plugins_url( '/assets/public/js/oxygen_builder.js', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . '/assets/public/js/oxygen_builder.js' ),
			true,
		);
		\wp_enqueue_script( $script_name );

		\wp_register_style(
			'core_framework_oxygen_css_builder',
			\plugins_url( '/assets/public/css/oxygen_builder.css', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . 'assets/public/css/oxygen_builder.css' ),
		);
		\wp_enqueue_style( 'core_framework_oxygen_css_builder' );

		\wp_register_style(
			'core_framework_oxygen_variable_ui',
			\plugins_url( '/assets/public/css/variable_ui.css', CORE_FRAMEWORK_ABSOLUTE ),
			array(),
			\filemtime( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . 'assets/public/css/variable_ui.css' ),
		);
		\wp_enqueue_style( 'core_framework_oxygen_variable_ui' );
	}

	/**
	 * Determine loading of integration
	 *
	 * @since 1.1.2
	 */
	public function determine_load(): bool {
		$option  = get_option( 'core_framework_main', array() );
		$license = get_option( 'core_framework_oxygen_license_key', false );
		return isset( $option['oxygen'] ) && $option['oxygen'] && $license;
	}
}
