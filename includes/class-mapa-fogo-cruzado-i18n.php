<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 * @author     Rafael Dourado <rdourado@gmail.com>
 */
class Mapa_Fogo_Cruzado_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'mapa-fogo-cruzado',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
