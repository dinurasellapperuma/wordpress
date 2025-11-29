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

namespace CoreFramework\Config;

use CoreFramework\Common\Abstracts\Base;

/**
 * Internationalization and localization definitions
 *
 * @package CoreFramework\Config
 * @since 0.0.0
 */
final class I18n extends Base {

	/**
	 * Load the plugin text domain for translation
	 *
	 * @docs https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/#loading-text-domain
	 *
	 * @since 0.0.0
	 */
	public function load(): void {
		\load_plugin_textdomain( 'core-framework', false, CORE_FRAMEWORK_DIR_ROOT . 'languages' );
	}
}
