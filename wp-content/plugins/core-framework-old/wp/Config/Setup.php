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

namespace CoreFramework\Config;

use CoreFramework\Common\Traits\Singleton;
use CoreFramework\Helper;

/**
 * Plugin setup hooks (activation, deactivation, uninstall)
 *
 * @package CoreFramework\Config
 * @since 0.0.0
 */
final class Setup {


	/**
	 * Singleton trait
	 */
	use Singleton;

	/**
	 * Run only once after plugin is activated
	 *
	 * @docs https://developer.wordpress.org/reference/functions/register_activation_hook/
	 */
	public static function activation( bool $network_wide ): void {
		if ( ! \current_user_can( 'activate_plugins' ) ) {
			return;
		}

		if ( $network_wide ) {
			foreach ( \get_sites() as $site ) {
				\switch_to_blog( $site->blog_id );

				$db_version    = \get_option( 'core_framework_db_version', '1.0' );
				$is_db_upgrade = \version_compare( $db_version, CORE_FRAMEWORK_DB_VER, '<' );

				if ( $is_db_upgrade ) {
					CoreFramework()->db_upgrade();
				}

				CoreFramework()->createSettings();
				CoreFramework()->createTable();

				flush_rewrite_rules();

				\restore_current_blog();
			}

			return;
		}

		$db_version    = \get_option( 'core_framework_db_version', '1.0' );
		$is_db_upgrade = \version_compare( $db_version, CORE_FRAMEWORK_DB_VER, '<' );

		if ( $is_db_upgrade ) {
			CoreFramework()->db_upgrade();
		}

		CoreFramework()->createSettings();
		CoreFramework()->createTable();

		flush_rewrite_rules();

		set_transient( 'core-framework-update-notice', true, 5 );
	}

	/**
	 * Run only once after plugin is deactivated
	 *
	 * @docs https://developer.wordpress.org/reference/functions/register_deactivation_hook/
	 */
	public static function deactivation(): void {
		if ( ! \current_user_can( 'activate_plugins' ) ) {
			return;
		}

		\flush_rewrite_rules();
	}

	/**
	 * Run only once after plugin is uninstalled
	 *
	 * @docs https://developer.wordpress.org/reference/functions/register_uninstall_hook/
	 */
	public static function uninstall(): void {
		if ( ! \current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$is_delete_data = get_option( 'core_framework_main' )['delete_data'] ?? false;

		if ( $is_delete_data ) {
			CoreFrameworkOxygen()->handle_uninstall();
			CoreFrameworkBricks()->handle_uninstall();

			CoreFramework()->removeSettings();
			CoreFramework()->removeTable();
		}
	}

	/**
	 * Restore css file on update and set transient
	 */
	public static function on_plugin_update_completed() {
		if ( get_transient( 'core_framework_updated' ) === CORE_FRAMEWORK_DB_VER ) {
			return;
		}

		if ( is_multisite() ) {
			$helper = new Helper();

			foreach ( \get_sites() as $site ) {
				\switch_to_blog( $site->blog_id );

				if ( get_option( 'core_framework_selected_preset_backup', '' ) !== '' ) {
					file_put_contents( $helper->getStylesheetPath(), get_option( 'core_framework_selected_preset_backup', '' ) );
				}

				\restore_current_blog();
			}
		} elseif ( get_option( 'core_framework_selected_preset_backup', '' ) !== '' ) {
			file_put_contents( plugin_dir_path( CORE_FRAMEWORK_ABSOLUTE ) . '/assets/public/css/core_framework.css', get_option( 'core_framework_selected_preset_backup', '' ) );
		}

		set_transient( 'core_framework_updated', CORE_FRAMEWORK_DB_VER, 0 );
		set_transient( 'core_framework_updated_time', time(), 60 * 60 * 24 );
	}

	public static function on_new_multi_site_blog( object $new_site, $args = array() ): void {
		\switch_to_blog( $new_site->blog_id );

		CoreFramework()->createSettings();
		CoreFramework()->createTable();

		flush_rewrite_rules();

		\restore_current_blog();
	}
}
