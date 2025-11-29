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

declare (strict_types = 1);

namespace CoreFramework\Common\Utils;

use CoreFramework\Config\Plugin;

/**
 * Utility to show prettified wp_die errors, write debug logs as
 * string or array and to deactivate plugin and print a notice
 *
 * @package CoreFramework\Common\Utils
 * @since 0.0.0
 */
class Errors {

	/**
	 * Get the plugin data in static form
	 *
	 * @since 0.0.0
	 */
	public static function getPluginData(): array {
		return Plugin::init()->data();
	}

	/**
	 * Prettified wp_die error function
	 *
	 * @param $message : The error message
	 * @param string                      $subtitle : Specified title of the error
	 * @param string                      $source : File source of the error
	 * @param string                      $title : General title of the error
	 * @param string                      $exception
	 * @since 0.0.0
	 */
	public static function wpDie( $message = '', $subtitle = '', $source = '', $exception = '', $title = '' ): void {
		if ( $message ) {
			$plugin = (object) self::getPluginData();
			$title  = $title ?: $plugin['name'] .
			' ' .
			$plugin['version'] .
			' ' .
			\__( '&rsaquo; Fatal Error', 'core-framework' );
			self::writeLog(
				array(
					'title'     => $title . ' - ' . $subtitle,
					'message'   => $message,
					'source'    => $source,
					'exception' => $exception,
				)
			);
			$source = $source
			? '<code>' .
			sprintf( /* translators: %s: file path */\__( 'Error source: %s', 'core-framework' ), $source ) .
			'</code><BR><BR>'
			: '';
			\wp_die(
				sprintf(
					'<h1>%s<br><small>%s</small></h1>%s<hr><p>%s</p>',
					esc_html( $title ),
					esc_html( $subtitle ),
					esc_html( $message ),
					esc_html( $source )
				),
				esc_html( $title )
			);
		} else {
			\wp_die();
		}
	}

	/**
	 * De-activates the plugin and shows notice error in back-end
	 *
	 * @param $message : The error message
	 * @param string                      $subtitle : Specified title of the error
	 * @param string                      $source : File source of the error
	 * @param string                      $title : General title of the error
	 * @param string                      $exception
	 * @since 0.0.0
	 */
	public static function pluginDie(
		$message = '',
		$subtitle = '',
		$source = '',
		$exception = '',
		$title = ''
	): void {
		if ( $message ) {
			$plugin = (object) self::getPluginData();
			$title  = $title ?: $plugin['name'] .
			' ' .
			$plugin['version'] .
			' ' .
			\__( '&rsaquo; Plugin Disabled', 'core-framework' );
			self::writeLog(
				array(
					'title'     => $title . ' - ' . $subtitle,
					'message'   => $message,
					'source'    => $source,
					'exception' => $exception,
				)
			);
			$source = $source
			? '<small>' .
			sprintf( /* translators: %s: file path */\__( 'Error source: %s', 'core-framework' ), $source ) .
			'</small> - '
			: '';
			$footer = $source . '<a href="' . $plugin['uri'] . '"><small>' . $plugin['uri'] . '</small></a>';
			$error  = sprintf( '<strong><h3>%s</h3>%s</strong><p>%s</p><hr><p>%s</p>', $title, $subtitle, $message, $footer );
			global $core_framework_die_notice;
			$core_framework_die_notice = $error;
			\add_action(
				'admin_notices',
				static function (): void {
					global $core_framework_die_notice;
					echo \wp_kses_post( sprintf( '<div class="notice notice-error"><p>%s</p></div>', $core_framework_die_notice ) );
				}
			);
		}

		\add_action(
			'admin_init',
			static function (): void {
				\deactivate_plugins( CORE_FRAMEWORK_MAIN_FILE );
				if ( isset( $_GET['activate'] ) ) {
					unset( $_GET['activate'] );
				}
			}
		);
	}

	/**
	 * Writes a log if wp_debug is enables
	 *
	 * @param $log
	 * @since 0.0.0
	 */
	public static function writeLog( $log ): void {
		if ( true === WP_DEBUG ) {
			if ( is_array( $log ) || is_object( $log ) ) {
				error_log( print_r( $log, true ) );
			} else {
				error_log( $log );
			}
		}
	}
}
