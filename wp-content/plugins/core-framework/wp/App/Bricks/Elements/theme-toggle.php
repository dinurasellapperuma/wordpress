<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class CoreFrameworkThemeToggle extends \Bricks\Element {

	public $category     = 'Core Framework';
	public $name         = 'cf-theme-toggle';
	public $icon         = 'ti-flickr';
	public $css_selector = '';
	public $scripts      = array( 'core_framework_theme' );
	public $id           = 'cf-theme-toggle';

	public function get_label() {
		return esc_html__( 'Theme Toggle', 'bricks' );
	}

	public function set_control_groups() {
		$this->control_groups['icons']  = array(
			'title' => esc_html__( 'Icons', 'bricks' ),
			'tab'   => 'content',
		);
		$this->control_groups['colors'] = array(
			'title' => esc_html__( 'Colors', 'bricks' ),
			'tab'   => 'content',
		);
	}

	public function set_controls() {
		/**
		 * General
		 */
		$this->controls['_padding'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Padding', 'bricks' ),
			'type'    => 'spacing',
			'css'     => array(
				array(
					'property' => 'padding',
				),
			),
			'default' => array(
				'top'    => 'var(--space-xs)',
				'right'  => 'var(--space-xs)',
				'bottom' => 'var(--space-xs)',
				'left'   => 'var(--space-xs)',
			),
		);

		$this->controls['_width'] = array(
			'tab'   => 'style',
			'group' => '_layout',
			'label' => esc_html__( 'Width', 'bricks' ),
			'type'  => 'number',
			'units' => true,
			'css'   => array(
				array(
					'property' => 'width',
				),
			),
		);

		$this->controls['_height'] = array(
			'tab'   => 'style',
			'group' => '_layout',
			'label' => esc_html__( 'Height', 'bricks' ),
			'type'  => 'number',
			'units' => true,
			'css'   => array(
				array(
					'property' => 'height',
				),
			),
		);

		$this->controls['_display'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Display', 'bricks' ),
			'type'    => 'select',
			'options' => array(
				'flex'         => esc_html__( 'Flex', 'bricks' ),
				'block'        => esc_html__( 'Block', 'bricks' ),
				'inline-block' => esc_html__( 'Inline Block', 'bricks' ),
			),
			'css'     => array(
				array(
					'property' => 'display',
				),
			),
			'default' => 'flex',
		);

		$this->controls['_justifyContent'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Justify Content', 'bricks' ),
			'type'    => 'select',
			'options' => array(
				'flex-start'    => esc_html__( 'Flex Start', 'bricks' ),
				'flex-end'      => esc_html__( 'Flex End', 'bricks' ),
				'center'        => esc_html__( 'Center', 'bricks' ),
				'space-between' => esc_html__( 'Space Between', 'bricks' ),
				'space-around'  => esc_html__( 'Space Around', 'bricks' ),
				'space-evenly'  => esc_html__( 'Space Evenly', 'bricks' ),
			),
			'css'     => array(
				array(
					'property' => 'justify-content',
				),
			),
			'default' => 'center',
		);

		$this->controls['_alignSelf'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Align Self', 'bricks' ),
			'type'    => 'select',
			'options' => array(
				'flex-start' => esc_html__( 'Flex Start', 'bricks' ),
				'flex-end'   => esc_html__( 'Flex End', 'bricks' ),
				'center'     => esc_html__( 'Center', 'bricks' ),
				'stretch'    => esc_html__( 'Stretch', 'bricks' ),
				'baseline'   => esc_html__( 'Baseline', 'bricks' ),
			),
			'css'     => array(
				array(
					'property' => 'align-self',
				),
			),
			'default' => 'center',
		);

		$this->controls['_alignItems'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Align Items', 'bricks' ),
			'type'    => 'select',
			'options' => array(
				'flex-start' => esc_html__( 'Flex Start', 'bricks' ),
				'flex-end'   => esc_html__( 'Flex End', 'bricks' ),
				'center'     => esc_html__( 'Center', 'bricks' ),
				'stretch'    => esc_html__( 'Stretch', 'bricks' ),
				'baseline'   => esc_html__( 'Baseline', 'bricks' ),
			),
			'css'     => array(
				array(
					'property' => 'align-items',
				),
			),
			'default' => 'center',
		);

		$this->controls['_border_radius'] = array(
			'tab'     => 'style',
			'group'   => '_layout',
			'label'   => esc_html__( 'Border Radius', 'bricks' ),
			'type'    => 'number',
			'units'   => true,
			'css'     => array(
				array(
					'property' => 'border-radius',
				),
			),
			'default' => '999px',
		);

		/**
		 * Component specific
		 */
		$this->controls['custom_light_mode_icon'] = array(
			'tab'   => 'content',
			'group' => 'icons',
			'label' => esc_html__( 'Custom light mode icon', 'bricks' ),
			'type'  => 'icon',
			'root'  => true,
		);

		$this->controls['custom_dark_mode_icon'] = array(
			'tab'   => 'content',
			'group' => 'icons',
			'label' => esc_html__( 'Custom dark mode icon', 'bricks' ),
			'type'  => 'icon',
			'root'  => true,
		);

		$this->controls['icon_size'] = array(
			'tab'     => 'content',
			'group'   => 'icons',
			'label'   => esc_html__( 'Icon Size', 'bricks' ),
			'type'    => 'number',
			'units'   => true,
			'inline'  => true,
			'css'     => array(
				array(
					'property' => 'font-size',
					'selector' => '.cf-light-mode-icon, .cf-dark-mode-icon',
				),
				array(
					'property' => 'width',
					'selector' => 'svg.cf-theme-icon',
				),
				array(
					'property' => 'height',
					'selector' => 'svg.cf-theme-icon',
				),
			),
			'default' => '1.5rem',
		);

		$this->controls['icon_variant'] = array(
			'tab'     => 'content',
			'group'   => 'icons',
			'label'   => esc_html__( 'Icon Variant (Affects only default icon)', 'bricks' ),
			'type'    => 'select',
			'options' => array(
				'filled'  => esc_html__( 'Filled', 'bricks' ),
				'outline' => esc_html__( 'Outline', 'bricks' ),
			),
		);

		$this->controls['light_mode_icon_color'] = array(
			'tab'     => 'content',
			'group'   => 'colors',
			'label'   => esc_html__( 'Light Mode Icon Color', 'bricks' ),
			'type'    => 'color',
			'inline'  => true,
			'css'     => array(
				array(
					'property' => 'color',
					'selector' => '.cf-light-mode-icon',
				),
			),
			'default' => array( 'hex' => '#ffffff' ),
		);

		$this->controls['dark_mode_icon_color'] = array(
			'tab'     => 'content',
			'group'   => 'colors',
			'label'   => esc_html__( 'Dark Mode Icon Color', 'bricks' ),
			'type'    => 'color',
			'inline'  => true,
			'css'     => array(
				array(
					'property' => 'color',
					'selector' => '.cf-dark-mode-icon',
				),
			),
			'default' => array( 'hex' => '#000000' ),
		);

		$this->controls['background'] = array(
			'tab'     => 'content',
			'group'   => 'colors',
			'label'   => esc_html__( 'Background', 'bricks' ),
			'type'    => 'color',
			'inline'  => true,
			'css'     => array(
				array(
					'property' => 'background-color',
				),
			),
			'default' => array( 'hex' => '#00000000' ),
		);
	}

	public function enqueue_scripts() {
		\wp_enqueue_script( 'core_framework_theme' );

		$css = '
			.cf-theme-toggle-button.cf-theme-dark .cf-theme-icon.cf-light-mode-icon {
				display: none;
			}
			.cf-theme-toggle-button.cf-theme-dark .cf-theme-icon.cf-dark-mode-icon {
				display: block;
			}
			.cf-theme-toggle-button.cf-theme-light .cf-theme-icon.cf-light-mode-icon {
				display: block;
			}
			.cf-theme-toggle-button.cf-theme-light .cf-theme-icon.cf-dark-mode-icon {
				display: none;
			}
			.cf-theme-icon-button .cf-theme-icon svg {
				display: block;
			}
		';

		\wp_register_style( 'core-framework-theme', false, array(), CORE_FRAMEWORK_VERSION );
		\wp_enqueue_style( 'core-framework-theme' );
		\wp_add_inline_style( 'core-framework-theme', $css );
	}

	public function render() {
		$settings               = $this->settings;
		$is_outline             = empty( $settings['icon_variant'] ) || $settings['icon_variant'] === 'outline';
		$custom_light_mode_icon = ! empty( $settings['custom_light_mode_icon'] ) ? $settings['custom_light_mode_icon'] : false;
		$custom_dark_mode_icon  = ! empty( $settings['custom_dark_mode_icon'] ) ? $settings['custom_dark_mode_icon'] : false;

		$classes = 'cf-theme-toggle-button';

		if ( ! ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) ) {
			$classes .= ' cf-theme-dark';
		}

		$svg_base_class = 'cf-theme-icon';

		$filled_light_mode_icon = '<svg xmlns="http://www.w3.org/2000/svg" class="' . esc_html( $svg_base_class ) . ' cf-light-mode-icon" color="currentColor" fill="currentColor" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391l-19.9 107.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121l19.9-107.9c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1l90.3-62.3c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 11192 0 96 96 0 11-192 0zm224 0a128 128 0 10-256 0 128 128 0 10256 0z"></path></svg>';
		$filled_dark_mode_icon  = '<svg xmlns="http://www.w3.org/2000/svg" class="' . esc_html( $svg_base_class ) . ' cf-dark-mode-icon" color="currentColor" fill="currentColor" viewBox="0 0 384 512"><path d="M223.5 32C100 32 0 132.3 0 256s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg>';

		$outline_light_mode_icon = '<svg xmlns="http://www.w3.org/2000/svg" class="' . esc_html( $svg_base_class ) . ' cf-light-mode-icon" color="currentColor" fill="currentColor" viewBox="0 0 512 512"><path d="M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5-98.5 18.2c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4l82.6-56.8 82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1-18.2-98.5zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4-45.2 65.6c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3-65.6-45.2c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3l-78.3-14.4 45.2-65.6c5.7-8.2 5.7-19 0-27.2l-45.2-65.6 78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3 65.6 45.2c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 100-224 112 112 0 100 224zm-64-112a64 64 0 11128 0 64 64 0 11-128 0z"></path></svg>';
		$outline_dark_mode_icon  = '<svg xmlns="http://www.w3.org/2000/svg" class="' . esc_html( $svg_base_class ) . ' cf-dark-mode-icon" color="currentColor" fill="currentColor" viewBox="0 0 384 512"><path d="M144.7 98.7c-21 34.1-33.1 74.3-33.1 117.3 0 98 62.8 181.4 150.4 211.7-12.4 2.8-25.3 4.3-38.6 4.3C126.6 432 48 353.3 48 256c0-68.9 39.4-128.4 96.8-157.3zm62.1-66C91.1 41.2 0 137.9 0 256c0 123.7 100 224 223.5 224 47.8 0 92-15 128.4-40.6 1.9-1.3 3.7-2.7 5.5-4 4.8-3.6 9.4-7.4 13.9-11.4 2.7-2.4 5.3-4.8 7.9-7.3 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-3.7.6-7.4 1.2-11.1 1.6-5 .5-10.1.9-15.3 1h-4c-96.8-.2-175.2-78.9-175.2-176 0-54.8 24.9-103.7 64.1-136 1-.9 2.1-1.7 3.2-2.6 4-3.2 8.2-6.2 12.5-9 3.1-2 6.3-4 9.6-5.8 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-3.6-.3-7.1-.5-10.7-.6-2.7-.1-5.5-.1-8.2-.1-3.3 0-6.5.1-9.8.2-2.3.1-4.6.2-6.9.4z"></path></svg>';

		$light_mode_icon = $is_outline ? $outline_light_mode_icon : $filled_light_mode_icon;
		$dark_mode_icon  = $is_outline ? $outline_dark_mode_icon : $filled_dark_mode_icon;

		if ( $custom_light_mode_icon ) {
			$icon_classes    = array( 'cf-theme-icon', 'cf-light-mode-icon', 'cf-theme-icon-custom' );
			$light_mode_icon = self::render_icon( $custom_light_mode_icon, $icon_classes );
		}

		if ( $custom_dark_mode_icon ) {
			$icon_classes   = array( 'cf-theme-icon', 'cf-dark-mode-icon', 'cf-theme-icon-custom' );
			$dark_mode_icon = self::render_icon( $custom_dark_mode_icon, $icon_classes );
		}

		$this->set_attribute( '_root', 'class', $classes );
		$this->set_attribute( '_root', 'aria-label', 'Toggle theme' );

		$wp_kses_options = CoreFramework()->get_wp_kses_options();

		echo wp_kses(
			'<button ' . $this->render_attributes( '_root' ) . '>',
			'post'
		);
		echo wp_kses(
			$light_mode_icon,
			$wp_kses_options
		);
		echo wp_kses(
			$dark_mode_icon,
			$wp_kses_options
		);
		echo wp_kses(
			'</button>',
			'post'
		);
	}
}
