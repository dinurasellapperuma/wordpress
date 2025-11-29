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

namespace CoreFramework\Common\Traits;

use CoreFramework\Common\Utils\Errors;
use CoreFramework\Config\Plugin;

/**
 * The requester trait to determine what we request; used to determine
 * which classes we instantiate in the Scaffold class
 *
 * @see Scaffold
 *
 * @package CoreFramework\Common\Traits
 * @since 0.0.0
 */
trait Requester {

	/**
	 * Get the plugin data in static form
	 *
	 * @since 0.0.0
	 */
	public static function getPluginData(): array {
		return Plugin::init()->data();
	}

	/**
	 * What type of request is this?
	 *
	 * @param string $type admin, cron, cli, amp or frontend.
	 * @since 0.0.0
	 */
	public function request( string $type ): bool {
		switch ( $type ) {
			case 'installing_wp':
				return $this->isInstallingWp();
			case 'frontend':
				return $this->isFrontend();
			case 'backend':
				return $this->isAdminBackend();
			case 'rest':
				return $this->isRest();
			case 'cron':
				return $this->isCron();
			case 'cli':
				return $this->isCli();
			case 'oxygen':
				return CoreFrameworkOxygen()->is_oxygen();
			case 'bricks':
				return CoreFrameworkBricks()->is_bricks();
			case 'gutenberg':
				return CoreFrameworkGutenberg()->is_gutenberg() && ! CoreFrameworkOxygen()->is_oxygen() && ! CoreFrameworkBricks()->is_bricks();
			default:
				Errors::wpDie(
					sprintf(
						/* translators: %s: request function */
						\__( 'Unknown request type: %s', 'core-framework' ),
						$type
					),
					\__( 'Classes are not being correctly requested', 'core-framework' ),
					__FILE__
				);
				return false;
		}
	}

	/**
	 * Is installing WP
	 *
	 * @since 0.0.0
	 */
	public function isInstallingWp(): bool {
		return defined( 'WP_INSTALLING' );
	}

	/**
	 * Is frontend
	 *
	 * @since 0.0.0
	 */
	public function isFrontend(): bool {
		return ! $this->isAdminBackend() && ! $this->isCron() && ! $this->isRest();
	}

	/**
	 * Is admin
	 *
	 * @since 0.0.0
	 */
	public function isAdminBackend(): bool {
		return \is_user_logged_in() && \is_admin();
	}

	/**
	 * Is rest
	 *
	 * @since 0.0.0
	 */
	public function isRest(): bool {
		$rest_url = apply_filters('rest_url_prefix', 'wp-json');
		return strpos( $_SERVER['REQUEST_URI'] ?? '', $rest_url ) !== false || defined( 'REST_REQUEST' );
	}

	/**
	 * Is cron
	 *
	 * @since 0.0.0
	 */
	public function isCron(): bool {
		return ( function_exists( 'wp_doing_cron' ) && \wp_doing_cron() ) || defined( 'DOING_CRON' );
	}

	/**
	 * Is cli
	 *
	 * @since 0.0.0
	 */
	public function isCli(): bool {
		return defined( 'WP_CLI' ) && \WP_CLI;
	}
}
