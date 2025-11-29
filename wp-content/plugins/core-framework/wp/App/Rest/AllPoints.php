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

namespace CoreFramework\App\Rest;

use CoreFramework\Common\Abstracts\Base;
use CoreFramework\Helper;

/**
 * Class AllPoints
 *
 * @package CoreFramework\App\Rest
 * @since 0.0.0
 */
class AllPoints extends Base {

	/**
	 * Check if an addon is enabled and licensed
	 *
	 * @param string $addon The addon name (e.g., 'oxygen', 'bricks', 'gutenberg')
	 * @return bool Whether the addon is enabled and licensed
	 */
	private function is_addon_enabled( $addon ) {
		$options = get_option( 'core_framework_main', array() );

		if ( $addon === 'gutenberg' ) {
			return isset( $options[ $addon ] ) && $options[ $addon ];
		}

		$license_key = get_option( "core_framework_{$addon}_license_key", '' );
		return isset( $options[ $addon ] ) && $options[ $addon ] && ! empty( $license_key );
	}

	/**
	 * Initialize the class.
	 *
	 * @since 0.0.0
	 */
	public function init() {
		/**
		 * This class is only being instantiated if REST_REQUEST is defined in the requester as requested in the Scaffold class
		 *
		 * @see Requester::isRest()
		 * @see Scaffold::__construct
		 */

		if ( class_exists( 'WP_REST_Server' ) ) {
			\add_action( 'rest_api_init', array( $this, 'add_plugin_rest_api' ) );
		}
	}

	/**
	 * @since 0.0.0
	 */
	public function add_plugin_rest_api() {
		$this->register_routes();
		$this->register_options();
	}

	/**
	 * @since   0.0.0
	 * @version 1.0
	 */
	public function register_options(): void {
		$preferences = array(
			'oxygen'                               => array(
				'type' => 'boolean',
			),
			'bricks'                               => array(
				'type' => 'boolean',
			),
			'gutenberg'                            => array(
				'type' => 'boolean',
			),
			'figma'                                => array(
				'type' => 'boolean',
			),
			'selected_id'                          => array(
				'type' => 'string',
			),
			'delete_data'                          => array(
				'type' => 'boolean',
			),
			'show_update_notice'                   => array(
				'type' => 'boolean',
			),
			'theme_mode'                           => array(
				'type' => 'string',
			),
			'plugin_name'                           => array(
				'type' => 'string',
			),
			'has_theme'                            => array(
				'type' => 'boolean',
			),
			'oxygen_enable_variable_dropdown'      => array(
				'type' => 'boolean',
			),
			'oxygen_enable_dark_mode_preview'      => array(
				'type' => 'boolean',
			),
			'oxygen_variable_ui'                   => array(
				'type' => 'boolean',
			),
			'oxygen_enable_variable_ui_auto_hide'  => array(
				'type' => 'boolean',
			),
			'oxygen_enable_variable_ui_hint'       => array(
				'type' => 'boolean',
			),
			'oxygen_apply_class_on_hover'          => array(
				'type' => 'boolean',
			),
			'oxygen_enable_variable_context_menu'  => array(
				'type' => 'boolean',
			),
			'oxygen_enable_unit_and_value_preview' => array(
				'type' => 'boolean',
			),
			'bricks_enable_variable_dropdown'      => array(
				'type' => 'boolean',
			),
			'bricks_enable_dark_mode_preview'      => array(
				'type' => 'boolean',
			),
			'bricks_variable_ui'                   => array(
				'type' => 'boolean',
			),
			'bricks_enable_variable_ui_auto_hide'  => array(
				'type' => 'boolean',
			),
			'bricks_enable_variable_ui_hint'       => array(
				'type' => 'boolean',
			),
			'bricks_apply_class_on_hover'          => array(
				'type' => 'boolean',
			),
			'bricks_apply_variable_on_hover'       => array(
				'type' => 'boolean',
			),
			'bricks_bem_generator'       					 => array(
				'type' => 'boolean',
      ),
			'bricks_enable_variable_context_menu'  => array(
				'type' => 'boolean',
			),
			'gutenberg_enable_dark_mode_preview'   => array(
				'type' => 'boolean',
			),
			'gutenberg_place_controls_at_the_top'  => array(
				'type' => 'boolean',
			),
			'gutenberg_close_widget_default'  => array(
				'type' => 'boolean',
			),
			// Legacy
			'root_font_size'                       => array(
				'type' => 'number',
			),
			'postcss'                              => array(
				'type' => 'boolean',
			),
			'min_screen_width'                     => array(
				'type' => 'number',
			),
			'max_screen_width'                     => array(
				'type' => 'number',
			),
			'is_rem'                               => array(
				'type' => 'boolean',
			),
		);

		\register_setting(
			'core_framework',
			'core_framework_main',
			array(
				'type'         => 'object',
				'show_in_rest' => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => $preferences,
					),
				),
			)
		);
	}

	protected function permission( string $nonce, bool $readonly_capabilites = false ): bool {
		if ( ! isset( $nonce ) || empty( $nonce ) ) {
			return false;
		}

		if ( $readonly_capabilites ) {
			return ( \current_user_can( 'manage_options' ) || \current_user_can( 'editor' ) ) && \wp_verify_nonce( $nonce, 'wp_rest' );
		}

		return \current_user_can( 'manage_options' ) && \wp_verify_nonce( $nonce, 'wp_rest' );
	}

	/**
	 * @since 0.0.0
	 * @return bool
	 */
	public function verify_nonce( \WP_REST_Request $request ): bool {
		$route           = $request->get_route() ?? '';
		$readonly_routes = array(
			'/get-builders',
			'/get-classes',
			'/get-variables',
			'/builders-var-ui',
		);

		foreach ( $readonly_routes as $key => $value ) {
			$readonly_routes[ $key ] = '/core-framework/v2' . $value;
		}

		$nonce = $request->get_header( 'X-WP-Nonce' );
		return $this->permission( $nonce, in_array( $route, $readonly_routes ) );
	}

	/**
	 * Verify API Key
	 *
	 * @return bool
	 */
	public function verify_api_key( \WP_REST_Request $request ): bool {
		$key = $request->get_param( 'key' ) ?? '';

		if ( ! $key || strlen( $key ) < 24 ) {
			return false;
		}

		$target_key = \get_option( 'core_framework_api_key', '' );

		if ( ! $target_key ) {
			return false;
		}

		$target_checksum = substr( $target_key, 0, 24 );
		$key_checksum    = substr( $key, 0, 24 );

		if ( $key_checksum !== $target_checksum ) {
			return false;
		}

		return true;
	}

	/**
	 * Register the routes
	 *
	 * @return void
	 * @since 0.0.0
	 */
	public function register_routes() {
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-presets',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_presets' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/upload-fonts',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_font_upload' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/delete-fonts',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_font_delete' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-core-fonts',
			array(
				'methods' 						=> \WP_REST_Server::READABLE,
				'callback' 						=> array( $this, 'get_core_fonts' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/delete-preset',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'delete_preset_row' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-preset-row',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_preset_row' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-main',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_main' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		// THIS
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-colors',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_colors' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		// THIS
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-classes',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_classes' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		// THIS
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-grouped-classes',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_grouped_classes' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-builders',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_builders' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-license-keys',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_license_keys' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-license-key',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_license_key' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-classes',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_classes' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		// THIS
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/update-prefixed-css-file',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'update_prefixed_css_file' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		// THIS
		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/save-oxygen-css-helper',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'save_oxygen_css_helper' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/get-variables',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_variables' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/builders-var-ui',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'builders_var_ui' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/api-key',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_api_key' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/api-key',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_api_key' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/api-key',
			array(
				'methods'             => \WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_api_key' ),
				'permission_callback' => array( $this, 'verify_nonce' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/preset',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_preset' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/preset',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_preset' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/preset-css',
			array(
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_preset_css' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/figma/update-colors',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'figma_update_colors' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/figma/update-classes',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'figma_update_classes' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/figma/update-grouped-classes',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'figma_update_grouped_classes' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/figma/update-prefixed-css-file',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'figma_update_prefixed_css_file' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);

		register_rest_route(
			CORE_FRAMEWORK_NAME . '/v2',
			'/figma/save-oxygen-css-helper',
			array(
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'figma_save_oxygen_css_helper' ),
				'permission_callback' => array( $this, 'verify_api_key' ),
			)
		);
	}

	/**
	 * Update the 'core_framework_presets' table
	 *
	 * @since 0.0.0
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response
	 */
	public function update_presets( \WP_REST_Request $request ) {
		$data = $request->get_param( 'data' ) ?? '';
		$id   = $request->get_param( 'id' ) ?? '';

		$time = \current_time( 'mysql' );

		global $wpdb;
		$table_name   = $wpdb->prefix . 'core_framework_presets';
		$target_table = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );

		if ( $target_table != $table_name ) {
			CoreFramework()->createTable();
		}

		$exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $table_name WHERE id = %s", $id ) );

		if ( $exists ) {
			$wpdb->update(
				$table_name,
				array(
					'id'   => $id,
					'time' => $time,
					'data' => $data,
				),
				array( 'id' => $id )
			);

			if ( \is_wp_error( $wpdb->insert_id ) ) {
				http_response_code( 400 );
				exit();
			}

			CoreFramework()->purge_cache();

			return new \WP_REST_Response(
				array(
					'success' => true,
					'action'  => 'updated',
				)
			);
		}

		$wpdb->insert(
			$table_name,
			array(
				'id'   => $id,
				'time' => $time,
				'data' => $data,
			)
		);

		if ( \is_wp_error( $wpdb->insert_id ) ) {
			http_response_code( 400 );
			exit();
		}

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'action'  => 'created',
			)
		);
	}

	public function handle_font_upload(\WP_REST_Request $request) {
		$upload_dir = wp_upload_dir()['basedir'] . '/core-framework/fonts/';

		if (!file_exists($upload_dir)) {
				wp_mkdir_p($upload_dir);
		}

		$fonts = $request->get_param('fonts');
		if (empty($fonts) || !is_array($fonts)) {
				return new WP_Error(
						'invalid_request',
						'No fonts provided or invalid format.',
						['status' => 400]
				);
		}

		$saved_files = [];
		$errors = [];

		foreach ($fonts as $font) {
			$font_content = base64_decode($font['font_base64']);
			$filename = $font['filename'];
			$file_path = $upload_dir . $filename;

			if (file_put_contents($file_path, $font_content) === false) {
				$errors[] = [
					'filename' => $filename,
					'error' => 'Failed to save file.'
				];
			} else {
				$saved_files[] = [
					'filename' => $filename,
					'file_path' => $file_path
				];
			}
		}

		return [
				'success' => true,
				'saved_files' => $saved_files,
				'errors' => $errors,
		];
	}

	public function handle_font_delete(\WP_REST_Request $request) {
  	$upload_dir = wp_upload_dir()['basedir'] . '/core-framework/fonts/';
  	$fonts = $request->get_param('fonts');

  	if (empty($fonts) || !is_array($fonts)) {
  		return new WP_Error(
  			'invalid_request',
  			'No fonts provided or invalid format.',
  			['status' => 400]
  		);
  	}

  	$deleted = [];
  	$errors = [];

  	foreach ($fonts as $font) {
  		if (!isset($font['filename'])) {
  			$errors[] = [
  				'filename' => null,
  				'error' => 'Missing filename key in font entry.'
  			];
  			continue;
  		}

  		$sanitized = basename($font['filename']);
  		$file_path = $upload_dir . $sanitized;

  		if (file_exists($file_path)) {
  			if (unlink($file_path)) {
  				$deleted[] = $sanitized;
  			} else {
  				$errors[] = [
  					'filename' => $sanitized,
  					'error' => 'Failed to delete file.'
  				];
  			}
  		} else {
  			$errors[] = [
  				'filename' => $sanitized,
  				'error' => 'File does not exist.'
  			];
  		}
  	}

  	return [
  		'success' => true,
  		'deleted' => $deleted,
  		'errors' => $errors,
  	];
  }

	function get_core_fonts() {
      $helper = new Helper();
			$preset = $helper->loadPreset();
			$preset_fonts = isset( $preset['modulesData'] ) && isset( $preset['modulesData']['FONTS'] )
				? $preset['modulesData']['FONTS']['fonts']
				: array();

			return ['success' => true, 'fonts' => $preset_fonts];
  }

	/**
	 * Delete a row from the 'core_framework_presets' table
	 *
	 * @since 0.0.0
	 * @param \WP_REST_Request $request { id: string }
	 * @return \WP_REST_Response
	 */
	public function delete_preset_row( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' ) ?? '';

		global $wpdb;
		$table_name = $wpdb->prefix . 'core_framework_presets';

		$wpdb->delete(
			$table_name,
			array( 'id' => $id )
		);

		if ( \is_wp_error( $wpdb->insert_id ) ) {
			http_response_code( 400 );
			exit();
		}

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'action'  => 'deleted',
			)
		);
	}

	/**
	 * Returns a row from the 'core_framework_presets' table
	 *
	 * @since 0.0.0
	 * @param \WP_REST_Request $request { id: string }
	 * @return \WP_REST_Response { success: boolean, data: Row }
	 */
	public function get_preset_row( \WP_REST_Request $request ) {
		$id = $request->get_param( 'id' ) ?? '';

		global $wpdb;
		$table_name = $wpdb->prefix . 'core_framework_presets';
		$row        = $wpdb->get_row(
			$wpdb->prepare( "SELECT * FROM $table_name WHERE id = %s", $id )
		);

		if ( \is_wp_error( $row ) ) {
			http_response_code( 400 );
			exit();
		}

		return new \WP_REST_Response(
			array(
				'success' => $row ? true : false,
				'data'    => $row,
			)
		);
	}

	/**
	 * Updates code and id in `core_framework_main` table
	 *
	 * @since 0.0.0
	 * @param \WP_REST_Request $request
	 * @return \WP_REST_Response
	 */
	public function update_main( \WP_REST_Request $request ) {
		$cssString = $request->get_param( 'cssString' ) ?? '';
		$id        = $request->get_param( 'id' ) ?? '';

		if ( ! $cssString || ! $id ) {
			http_response_code( 400 );
			exit();
		}

		$option_name             = 'core_framework_main';
		$settings                = \get_option( $option_name );
		$settings['selected_id'] = $id;

		\update_option( $option_name, $settings, false );

		$plugins_root = WP_CONTENT_DIR . '/plugins';

		if ( is_multisite() ) {
			$bytes_saved = \file_put_contents( $plugins_root . '/core-framework/assets/public/css/core_framework_' . get_current_blog_id() . '.css', $cssString );
		} else {
			$bytes_saved = \file_put_contents( $plugins_root . '/core-framework/assets/public/css/core_framework.css', $cssString );
		}

		if ( \is_wp_error( $settings ) ) {
			http_response_code( 400 );
			exit();
		}

		\update_option( 'core_framework_selected_preset_backup', $cssString, false );

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success'      => true,
				'bytes_saved'  => $bytes_saved,
				'is_multisite' => is_multisite(),
				'blog_id'      => get_current_blog_id(),
			)
		);
	}

	/**
	 * Class names sync
	 *
	 * @since 0.0.0
	 */
	public function update_classes( $request ) {
		$classes            = $request->get_param( 'classes' ) ?? '';
		$addon_enable_array = $request->get_param( 'addonEnableArray' ) ?? array();

		function is_addon_enabled( $addon_enable_array, $addon ) {
			foreach ( $addon_enable_array as $addon_enable ) {
				if ( $addon_enable['addon'] === $addon ) {
					return $addon_enable['enabled'];
				}
			}
			return false;
		}

		if ( $classes === null || $addon_enable_array === null ) {
			http_response_code( 400 );
			exit();
		}

		$new_selectors_array = explode( ',', $classes ) ?? array();
		$builder_array       = array(
			'oxygen' => array(
				'is_active'     => CoreFrameworkOxygen()->is_oxygen(),
				'class'         => CoreFrameworkOxygen(),
				'key'           => 'oxygen',
				'addon_license' => is_addon_enabled( $addon_enable_array, 'oxygen' ),
			),
			'bricks' => array(
				'is_active'     => CoreFrameworkBricks()->is_bricks(),
				'class'         => CoreFrameworkBricks(),
				'key'           => 'bricks',
				'addon_license' => is_addon_enabled( $addon_enable_array, 'bricks' ),
			),
		);

		$active_builders = array();
		$core_option     = \get_option( 'core_framework_main' );

		foreach ( $builder_array as $builder ) {
			if ( ! $builder['is_active'] ) {
				continue;
			}

			if ( ! $builder['addon_license'] ) {
				continue;
			}

			if ( ! $core_option[ $builder['key'] ] ) {
				continue;
			}

			if ( method_exists( $builder['class'], 'refresh_selectors' ) ) {
				$builder['class']->refresh_selectors( $new_selectors_array );
			}

			if ( method_exists( $builder['class'], 'refresh_variables' ) ) {
				$builder['class']->refresh_variables();
			}

			$active_builders[] = $builder['key'];

			break;
		}

		return new \WP_REST_Response(
			array(
				'success'         => true,
				'active_builders' => $active_builders,
			)
		);
	}

	/**
	 * @since 1.0.3
	 */
	public function update_grouped_classes( $request ) {
		$grouped_classes = $request->get_param( 'groupedClassNames' ) ?? '';

		if ( $grouped_classes === null ) {
			http_response_code( 400 );
			exit();
		}

		$response = update_option( 'core_framework_grouped_classes', $grouped_classes, false );

		if ( \is_wp_error( $response ) ) {
			http_response_code( 400 );
			exit();
		}

		return new \WP_REST_Response(
			array(
				'success' => $response,
			)
		);
	}

	/**
	 * Color palette sync
	 *
	 * @since 0.0.0
	 * @param \WP_REST_Request
	 */
	public function update_colors( \WP_REST_Request $request ) {
		$colors             = $request->get_param( 'colors' ) ?? '';
		$addon_enable_array = $request->get_param( 'addonEnableArray' ) ?? array();

		function is_addon_enabled( $addon_enable_array, $addon ) {
			foreach ( $addon_enable_array as $addon_enable ) {
				if ( $addon_enable['addon'] === $addon ) {
					return $addon_enable['enabled'];
				}
			}
			return false;
		}

		if ( $colors === null ) {
			http_response_code( 400 );
			exit();
		}

		update_option( 'core_framework_colors', $colors, false );

		$builder_array = array(
			'oxygen' => array(
				'is_active'     => CoreFrameworkOxygen()->is_oxygen(),
				'class'         => CoreFrameworkOxygen(),
				'key'           => 'oxygen',
				'addon_license' => is_addon_enabled( $addon_enable_array, 'oxygen' ),
			),
			'bricks' => array(
				'is_active'     => CoreFrameworkBricks()->is_bricks(),
				'class'         => CoreFrameworkBricks(),
				'key'           => 'bricks',
				'addon_license' => is_addon_enabled( $addon_enable_array, 'bricks' ),
			),
		);

		$active_builders = array();
		$core_setting    = \get_option( 'core_framework_main' );

		foreach ( $builder_array as $builder ) {
			if ( ! $builder['addon_license'] ) {
				continue;
			}

			if ( ! $builder['is_active'] ) {
				continue;
			}

			if ( ! $core_setting[ $builder['key'] ] ) {
				continue;
			}

			$builder['class']->update_colors( $colors );
			$active_builders[] = $builder['key'];

			break;
		}

		return new \WP_REST_Response(
			array(
				'success'         => true,
				'active_builders' => $active_builders,
			)
		);
	}

	/**
	 * Returns activate builders array
	 *
	 * @since 0.0.0
	 * @return \WP_REST_Response { builders: string[] }
	 */
	public function get_builders() {
		$builders       = array();
		$builders_array = array(
			'oxygen'    => CoreFrameworkOxygen()->is_oxygen(),
			'bricks'    => CoreFrameworkBricks()->is_bricks(),
			'gutenberg' => true,
		);

		foreach ( $builders_array as $key => $value ) {
			if ( $value ) {
				array_push( $builders, $key );
			}
		}

		return new \WP_REST_Response(
			array(
				'builders' => $builders,
			)
		);
	}

	/**
	 * Get license keys from the database
	 *
	 * @since 1.0.0
	 */
	public function get_license_keys() {
		$license_keys       = array();
		$license_keys_array = array(
			'oxygen' => '',
			'bricks' => '',
			'figma'  => '',
		);

		foreach ( $license_keys_array as $key => $value ) {
			$license_keys[ $key ] = get_option( 'core_framework_' . $key . '_license_key' );
		}

		return new \WP_REST_Response(
			array(
				'license_keys' => $license_keys,
			)
		);
	}

	/**
	 * Update license key in the database
	 *
	 * @since 1.0.0
	 */
	public function update_license_key( \WP_REST_Request $request ) {
		$license_key = $request->get_param( 'license_key' ) ?? '';
		$type        = $request->get_param( 'type' ) ?? '';

		if ( $license_key === null || $type === null ) {
			http_response_code( 400 );
			exit();
		}

		update_option( 'core_framework_' . $type . '_license_key', $license_key, false );

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
			)
		);
	}

	/**
	 * Get classes
	 *
	 * @since 1.0.0
	 */
	public function get_classes() {
		$classes = get_option( 'core_framework_grouped_classes' );

		return new \WP_REST_Response(
			array(
				'classes' => $classes,
			)
		);
	}

	/**
	 * @since 1.0.3
	 * @param \WP_REST_Request $request
	 */
	public function update_prefixed_css_file( \WP_REST_Request $request ) {
		$cssString = $request->get_param( 'cssString' ) ?? '';

		if ( ! $cssString ) {
			http_response_code( 400 );
			exit();
		}

		$success = update_option( 'core_framework_editor_prefixed_css', $cssString, false );

		if ( \is_wp_error( $success ) ) {
			http_response_code( 400 );
			exit();
		}

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => $success,
			)
		);
	}

	/**
	 * @since 1.0.3
	 * @param \WP_REST_Request $request
	 */
	public function save_oxygen_css_helper( \WP_REST_Request $request ) {
		$cssString = $request->get_param( 'cssString' ) ?? '';

		if ( ! $cssString ) {
			http_response_code( 400 );
			exit();
		}

		$success = update_option( 'core_framework_oxygen_css_helper', $cssString, false );

		if ( \is_wp_error( $success ) ) {
			http_response_code( 400 );
			exit();
		}

		return new \WP_REST_Response(
			array(
				'success' => $success,
			)
		);
	}

	/**
	 * @since 1.2.4
	 */
	public function get_variables( \WP_REST_Request $request ) {
		$type = $request->get_param( 'type' ) ?? '';

		if ( $type === 'oxygen_dropdown' || $type === 'bricks_dropdown' ) {
			$helper    = new Helper();
			$variables = $helper->getVariables(
				array(
					'group_by_category' => true,
				)
			);

			return new \WP_REST_Response(
				array(
					'variables' => $variables,
				)
			);
		}

		$helper    = new Helper();
		$variables = $helper->getVariables(
			array(
				'group_by_category' => false,
				'excluded_keys'     => array( 'colorStyles' ),
			)
		);

		return new \WP_REST_Response(
			array(
				'variables' => $variables,
			)
		);
	}

	/**
	 *
	 * @since 1.3.0
	 * @return mixed
	 */
	public function builders_var_ui() {
		$empty_response = array(
			'variables'                          => array(),
			'color_system_data'                  => array(),
			'variable_prefix'                    => '',
			'fluid_typography_naming_convention' => array(),
			'fluid_spacing_naming_convention'    => array(),
		);
		$options        = get_option( 'core_framework_main' );
		$is_bricks      = isset( $options['bricks'] ) ? $options['bricks'] : false;
		$is_oxygen      = isset( $options['oxygen'] ) ? $options['oxygen'] : false;

		if ( ! $is_bricks && ! $is_oxygen ) {
			return new \WP_REST_Response(
				$empty_response
			);
		}

		$key = $is_bricks ? get_option( 'core_framework_bricks_license_key' ) : get_option( 'core_framework_oxygen_license_key' );

		if ( ! $key ) {
			return new \WP_REST_Response(
				$empty_response
			);
		}

		$response = wp_remote_get( CORE_FRAMEWORK_EDD_STORE_URL . '?edd_action=check_license&item_id=' . ( $is_bricks ? '12' : '15' ) . '&license=' . $key . '&url=' . get_site_url() . '&version=' . CORE_FRAMEWORK_VERSION );
		$res_json = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( isset( $res_json['license'] ) && $res_json['success'] === false ) {
			return new \WP_REST_Response(
				$empty_response
			);
		}

		$helper    = new Helper();
		$variables = $helper->getVariablesGroupedByCategoriesAndGroups(
			array(
				'group_by_category'              => true,
				'exclude_color_system_variables' => true,
			)
		);

		$preset = $helper->getPreset();

		$color_system_data = isset( $preset['modulesData'] ) && isset( $preset['modulesData']['COLOR_SYSTEM'] ) ? $preset['modulesData']['COLOR_SYSTEM'] : array();
		$variable_prefix   = isset( $preset['variablePrefix'] ) ? $preset['variablePrefix'] : '';
		$fluid_typography  = isset( $preset['modulesData'] ) && isset( $preset['modulesData']['FLUID_TYPOGRAPHY'] ) ? $preset['modulesData']['FLUID_TYPOGRAPHY'] : array();
		$fluid_spacing     = isset( $preset['modulesData'] ) && isset( $preset['modulesData']['FLUID_SPACING'] ) ? $preset['modulesData']['FLUID_SPACING'] : array();

		return new \WP_REST_Response(
			array(
				'variables'                          => $variables,
				'color_system_data'                  => $color_system_data,
				'variable_prefix'                    => $variable_prefix,
				'fluid_typography_naming_convention' => $fluid_typography,
				'fluid_spacing_naming_convention'    => $fluid_spacing,
			)
		);
	}

	/**
	 * Create API key
	 *
	 * @since 1.6.0
	 */
	public function create_api_key( \WP_REST_Request $request ) {
		if ( ! in_array( 'administrator', wp_get_current_user()->roles ) ) {
			http_response_code( 400 );
			exit();
		}

		$key = $request->get_param( 'key' ) ?? '';

		if ( strlen( $key ) < 24 ) {
			http_response_code( 400 );
			exit();
		}

		\update_option( 'core_framework_api_key', $key, false );

		return new \WP_REST_Response(
			array(
				'success' => true,
			)
		);
	}

	/**
	 * Get API key
	 *
	 * @since 1.6.0
	 */
	public function get_api_key() {
		if ( ! in_array( 'administrator', wp_get_current_user()->roles ) ) {
			http_response_code( 400 );
			exit();
		}

		$key = \get_option( 'core_framework_api_key', '' );

		return new \WP_REST_Response(
			array(
				'key' => $key,
			)
		);
	}

	/**
	 * Delete API key
	 *
	 * @since 1.6.0
	 */
	public function delete_api_key() {
		if ( ! in_array( 'administrator', wp_get_current_user()->roles ) ) {
			http_response_code( 400 );
			exit();
		}

		\delete_option( 'core_framework_api_key' );

		return new \WP_REST_Response(
			array(
				'success' => true,
			)
		);
	}

	/**
	 * Get preset using API key
	 *
	 * @since 1.6.0
	 */
	public function get_preset( \WP_REST_Request $request ) {
		try {
			$helper = new Helper();
			$preset = $helper->loadPreset();

			return new \WP_REST_Response(
				array(
					'success' => true,
					'data'    => $preset,
				)
			);
		} catch ( Exception $e ) {
			http_response_code( 400 );
			exit();
		}
	}

	/**
	 * Update preset using API key
	 *
	 * @since 1.6.0
	 */
	public function update_preset( \WP_REST_Request $request ) {
		$body   = $request->get_body();
		$json   = json_decode( $body, true );
		$preset = isset( $json['preset'] ) ? $json['preset'] : null;
		$data   = json_encode( $preset );

		if ( ! $data || $data == null || $data == '' ) {
			http_response_code( 200 );
			exit();
		}

		$helper    = new Helper();
		$preset_id = $helper->getPresetId();

		$time = \current_time( 'mysql' );

		if ( ! $preset_id ) {
			$preset_id = Functions()->get_random_id();
			$helper->setPresetId( $preset_id );
		}

		global $wpdb;
		$table_name   = $wpdb->prefix . 'core_framework_presets';
		$target_table = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );

		if ( $target_table != $table_name ) {
			CoreFramework()->createTable();
		}

		$exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM $table_name WHERE id = %s", $preset_id ) );

		if ( $exists ) {
			$wpdb->update(
				$table_name,
				array(
					'id'   => $preset_id,
					'time' => $time,
					'data' => $data,
				),
				array( 'id' => $preset_id )
			);

			if ( \is_wp_error( $wpdb->insert_id ) ) {
				http_response_code( 400 );
				exit();
			}

			CoreFramework()->purge_cache();

			return new \WP_REST_Response(
				array(
					'success' => true,
					'action'  => 'updated',
				)
			);
		}

		$wpdb->insert(
			$table_name,
			array(
				'id'   => $preset_id,
				'time' => $time,
				'data' => $data,
			)
		);

		if ( \is_wp_error( $wpdb->insert_id ) ) {
			http_response_code( 400 );
			exit();
		}

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'action'  => 'created',
			)
		);
	}

	/**
	 * Update css
	 *
	 * @since 1.6.0
	 */
	public function update_preset_css( \WP_REST_Request $request ) {
		$body = $request->get_body();
		$data = json_decode( $body, true );
		$css  = isset( $data['css'] ) ? $data['css'] : null;

		if ( ! $css || $css == null || $css == '' ) {
			http_response_code( 400 );
			exit();
		}

		$plugins_root = WP_CONTENT_DIR . '/plugins';

		if ( is_multisite() ) {
			$bytes_saved = \file_put_contents( $plugins_root . '/core-framework/assets/public/css/core_framework_' . get_current_blog_id() . '.css', $css );
		} else {
			$bytes_saved = \file_put_contents( $plugins_root . '/core-framework/assets/public/css/core_framework.css', $css );
		}

		\update_option( 'core_framework_selected_preset_backup', $css, false );
		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
			)
		);
	}

	/**
	 * @since 1.8.0
	 */
	public function figma_update_colors( \WP_REST_Request $request ) {
		$body   = $request->get_body();
		$data   = json_decode( $body, true );
		$colors = isset( $data['colors'] ) ? $data['colors'] : null;

		if ( $colors === null ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Colors are null',
				),
				400
			);
		}

		update_option( 'core_framework_colors', $colors, false );

		$builder_array = array(
			'oxygen' => array(
				'is_active'     => CoreFrameworkOxygen()->is_oxygen(),
				'class'         => CoreFrameworkOxygen(),
				'key'           => 'oxygen',
				'addon_license' => $this->is_addon_enabled( 'oxygen' ),
			),
			'bricks' => array(
				'is_active'     => CoreFrameworkBricks()->is_bricks(),
				'class'         => CoreFrameworkBricks(),
				'key'           => 'bricks',
				'addon_license' => $this->is_addon_enabled( 'bricks' ),
			),
		);

		$active_builders = array();
		$core_setting    = \get_option( 'core_framework_main' );

		foreach ( $builder_array as $builder ) {
			if ( ! $builder['addon_license'] ) {
				continue;
			}

			if ( ! $builder['is_active'] ) {
				continue;
			}

			if ( ! $core_setting[ $builder['key'] ] ) {
				continue;
			}

			$builder['class']->update_colors( $colors );
			$active_builders[] = $builder['key'];

			break;
		}

		return new \WP_REST_Response(
			array(
				'success'         => true,
				'active_builders' => $active_builders,
			)
		);
	}

	/**
	 * @since 1.8.0
	 */
	public function figma_update_classes( \WP_REST_Request $request ) {
		$body    = $request->get_body();
		$json    = json_decode( $body, true );
		$classes = isset( $json['classes'] ) ? $json['classes'] : null;

		if ( $classes === null ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Classes or addon enable array is null',
				),
				400
			);
		}

		$new_selectors_array = explode( ',', $classes ) ?? array();
		$builder_array       = array(
			'oxygen' => array(
				'is_active'     => CoreFrameworkOxygen()->is_oxygen(),
				'class'         => CoreFrameworkOxygen(),
				'key'           => 'oxygen',
				'addon_license' => $this->is_addon_enabled( 'oxygen' ),
			),
			'bricks' => array(
				'is_active'     => CoreFrameworkBricks()->is_bricks(),
				'class'         => CoreFrameworkBricks(),
				'key'           => 'bricks',
				'addon_license' => $this->is_addon_enabled( 'bricks' ),
			),
		);

		$active_builders = array();
		$core_option     = \get_option( 'core_framework_main' );

		foreach ( $builder_array as $builder ) {
			if ( ! $builder['is_active'] ) {
				continue;
			}

			if ( ! $builder['addon_license'] ) {
				continue;
			}

			if ( ! $core_option[ $builder['key'] ] ) {
				continue;
			}

			if ( method_exists( $builder['class'], 'refresh_selectors' ) ) {
				$builder['class']->refresh_selectors( $new_selectors_array );
			}

			if ( method_exists( $builder['class'], 'refresh_variables' ) ) {
				$builder['class']->refresh_variables();
			}

			$active_builders[] = $builder['key'];

			break;
		}

		return new \WP_REST_Response(
			array(
				'success'         => true,
				'active_builders' => $active_builders,
			)
		);
	}

	/**
	 * @since 1.8.0
	 */
	public function figma_update_grouped_classes( \WP_REST_Request $request ) {
		try {
			if ( ! $this->is_addon_enabled( 'gutenberg' ) ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => 'Gutenberg addon not active or licensed',
					),
					200
				);
			}

			$body            = $request->get_body();
			$data            = json_decode( $body, true );
			$grouped_classes = isset( $data['groupedClassNames'] ) ? $data['groupedClassNames'] : null;

			if ( $grouped_classes === null ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => 'Grouped classes are null',
					),
					400
				);
			}

			$response = update_option( 'core_framework_grouped_classes', $grouped_classes, false );

			if ( \is_wp_error( $response ) ) {
				return new \WP_REST_Response(
					array(
						'success' => false,
						'message' => 'Failed to update grouped classes',
					),
					400
				);
			}

			return new \WP_REST_Response(
				array(
					'success' => true,
					'message' => 'Grouped classes updated successfully',
				)
			);
		} catch ( \Exception $e ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'An error occurred: ' . $e->getMessage(),
				),
				500
			);
		}
	}

	/**
	 * @since 1.8.0
	 */
	public function figma_update_prefixed_css_file( \WP_REST_Request $request ) {
		if ( ! $this->is_addon_enabled( 'gutenberg' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Gutenberg addon not active or licensed',
				),
				200
			);
		}

		$body      = $request->get_body();
		$data      = json_decode( $body, true );
		$cssString = isset( $data['cssString'] ) ? $data['cssString'] : null;

		if ( ! $cssString ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'CSS string is null',
				),
				400
			);
		}

		$success = update_option( 'core_framework_editor_prefixed_css', $cssString, false );

		if ( \is_wp_error( $success ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Failed to update prefixed CSS file',
				),
				400
			);
		}

		CoreFramework()->purge_cache();

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => 'Prefixed CSS file updated successfully',
			)
		);
	}

	/**
	 * @since 1.8.0
	 */
	public function figma_save_oxygen_css_helper( \WP_REST_Request $request ) {
		if ( ! $this->is_addon_enabled( 'oxygen' ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Oxygen addon not active or licensed',
				),
				200
			);
		}

		$body      = $request->get_body();
		$data      = json_decode( $body, true );
		$cssString = isset( $data['cssString'] ) ? $data['cssString'] : null;

		if ( ! $cssString ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'CSS string is null',
				),
				400
			);
		}

		$success = update_option( 'core_framework_oxygen_css_helper', $cssString, false );

		if ( \is_wp_error( $success ) ) {
			return new \WP_REST_Response(
				array(
					'success' => false,
					'message' => 'Failed to update Oxygen CSS helper',
				),
				400
			);
		}

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => 'Oxygen CSS helper updated successfully',
			)
		);
	}
}
