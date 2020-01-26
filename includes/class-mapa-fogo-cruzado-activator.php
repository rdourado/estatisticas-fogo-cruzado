<?php

/**
 * Fired during plugin activation
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 * @author     Rafael Dourado <rdourado@gmail.com>
 */
class Mapa_Fogo_Cruzado_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		self::create_db_table();
		self::create_uploads_dir();

	}

	/**
	 *
	 */
	private static function create_db_table() {

		global $wpdb;
		$mapa_fogo_cruzado_db_version = '1.1';
		$table_name                   = $wpdb->prefix . 'mapa_fogo_cruzado';
		$charset_collate              = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE `$table_name` (
			`ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			`external_id` bigint(20) unsigned DEFAULT NULL,
			`date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`lat` double NOT NULL,
			`lng` double NOT NULL,
			`police` tinyint(1) DEFAULT '0',
			`police_dead` int(11) DEFAULT '0',
			`police_hurt` int(11) DEFAULT '0',
			`civil_dead` int(11) DEFAULT '0',
			`civil_hurt` int(11) DEFAULT '0',
			`massacre` tinyint(1) DEFAULT '0',
			`uf` varchar(2) NOT NULL DEFAULT 'rj',
			`region` varchar(255) DEFAULT NULL,
			`city` varchar(255) NOT NULL,
			`nbrhd` varchar(255) DEFAULT NULL,
			`upp` varchar(255) DEFAULT NULL,
			PRIMARY KEY (`ID`),
			UNIQUE KEY `external_id` (`external_id`)
		  ) $charset_collate;";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );

		add_option( 'mapa_fogo_cruzado_db_version', $mapa_fogo_cruzado_db_version );

	}

	/**
	 *
	 */
	private static function create_uploads_dir() {

		$upload_dir = wp_get_upload_dir();
		$basedir    = $upload_dir['basedir'];

		wp_mkdir_p( $basedir . '/mapa-fogo-cruzado' );

	}

}
