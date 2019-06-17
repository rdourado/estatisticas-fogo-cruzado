<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/public
 * @author     Rafael Dourado <rdourado@gmail.com>
 */
class Mapa_Fogo_Cruzado_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 *
	 */
	private function get_domain() {
		$home_url = wp_parse_url( home_url() );
		$domain   = $home_url['scheme'] . '://' . $home_url['host'];
		if ( isset( $home_url['port'] ) && $home_url['port'] ) {
			$domain .= ':' . $home_url['port'];
		}
		return $domain;
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		if ( is_page_template( 'mapa-fogo-cruzado-public-display.php' ) ) {
			wp_register_style(
				'socicon',
				'//s3.amazonaws.com/icomoon.io/114779/Socicon/style.css?u8vidh',
				array(),
				null,
				'screen'
			);
			wp_enqueue_style(
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'css/mapa-fogo-cruzado-public.css',
				array( 'socicon' ),
				null
			);
		}

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		if ( is_page_template( 'mapa-fogo-cruzado-public-display.php' ) ) {
			wp_register_script(
				$this->plugin_name . '-chunk',
				plugin_dir_url( __FILE__ ) . 'js/mapa-fogo-cruzado-public.chunk.js',
				array(),
				$this->version,
				true
			);
			wp_register_script(
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'js/mapa-fogo-cruzado-public.js',
				array( $this->plugin_name . '-chunk' ),
				$this->version,
				true
			);
			$key = file_get_contents( plugin_dir_path( __FILE__ ) . '.apikey' );
			wp_localize_script(
				$this->plugin_name,
				'mapa_fogo_cruzado',
				array(
					'ajax_url' => str_replace( $this->get_domain(), '', admin_url( 'admin-ajax.php' ) ),
					'logo'     => plugin_dir_url( __FILE__ ) . 'img/logo-fogo-cruzado.png',
					'loading'  => plugin_dir_url( __FILE__ ) . 'img/loading.gif',
					'pin'      => plugin_dir_url( __FILE__ ) . 'img/pin.png',
					'key'      => $key,
				)
			);
			wp_enqueue_script( $this->plugin_name );
		}

	}

	/**
	 *
	 */
	public function fetch_map_params() {

		global $wpdb;

		$uf = json_decode( file_get_contents( 'php://input' ) );
		if ( empty( $uf ) ) {
			wp_send_json_error( 'Missing UF', 400 );
		}
		$uf        = strtolower( trim( $uf ) );
		$transient = 'mapa_fogo_cruzado_' . md5( json_encode( $uf ) );
		$data      = get_transient( $transient );

		if ( false === $data ) {
			// phpcs:disable
			$ufs    = $wpdb->get_col(
				"
				SELECT DISTINCT LOWER(`uf`) `uf`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `date` > '1000-00-00'
				ORDER BY `uf` DESC
				"
			);
			$years  = $wpdb->get_col(
				"
				SELECT DISTINCT DATE_FORMAT( `date`, '%Y' ) `year`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `date` > '1000-00-00'
				ORDER BY `date` DESC
				"
			);
			$params = $wpdb->get_results(
				"
				SELECT DISTINCT `region`, `city`, `nbrhd`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `uf` = '{$uf}' AND `date` > '1000-00-00'
				ORDER BY `region`, `city`, `nbrhd`
				"
			);
			// phpcs:enable

			$data = array(
				'ufs'    => $ufs,
				'years'  => $years,
				'params' => $params,
			);

			set_transient( $transient, $data, HOUR_IN_SECONDS );
		}

		wp_send_json_success( $data, 200 );

	}

	/**
	 *
	 */
	public function fetch_map_data() {

		global $wpdb;

		$input     = json_decode( file_get_contents( 'php://input' ) );
		$transient = 'mapa_fogo_cruzado-' . md5( json_encode( $input ) );
		$data      = get_transient( $transient );

		if ( false === $data ) {
			$date_end   = ! empty( $input->end )
				? date( 'Y-m-t 23:59:59', $input->end )
				: date( 'Y-m-t 23:59:59' );
			$time       = strtotime( '-12 months', strtotime( $date_end ) );
			$date_start = date( 'Y-m-01 00:00:00', $time );

			$where = array_filter(
				array(
					'1=1',
					"`date` >= '" . $date_start . "'",
					"`date` <= '" . $date_end . "'",
					isset( $input->type ) && 'dead' === $input->type
						? "`total_dead` > '0'" : false,
					isset( $input->type ) && 'injured' === $input->type
						? "`total_injured` > '0'" : false,
					isset( $input->type ) && 'none' === $input->type
						? "`total_dead` = '0' AND `total_injured` = '0'" : false,
					! empty( $input->uf )
						? "`uf` = '" . $wpdb->_escape( $input->uf ) . "'" : false,
					! empty( $input->region )
						? "`region` = '" . $wpdb->_escape( $input->region ) . "'" : false,
					! empty( $input->cities )
						? "`city` IN ('" . implode( "','", $wpdb->_escape( $input->cities ) ) . "')" : false,
					! empty( $input->nbrhds )
						? "`nbrhd` IN ('" . implode( "','", $wpdb->_escape( $input->nbrhds ) ) . "')" : false,
				)
			);

			$sql  = "SELECT `date`, `latitude`, `longitude`, `had_police`, `police_dead`, `police_injured`, `total_dead`, `total_injured`, `city`, `uf`, `nbrhd`, `region` FROM `{$wpdb->prefix}mapa_fogo_cruzado` WHERE " . implode( ' AND ', $where ) . ' ORDER BY `date` DESC LIMIT 10000';
			$data = $wpdb->get_results( $sql ); // phpcs:ignore

			set_transient( $transient, $data, HOUR_IN_SECONDS );
		}

		wp_send_json_success( $data, 200 );

	}

	/**
	 *
	 */
	public function create_graphic_image() {

		$input = json_decode( file_get_contents( 'php://input' ) );

		if ( ! isset( $input->hash, $input->base64 ) ) {
			wp_send_json_error( __( 'Parâmetros incorretos', 'mapa-fogo-cruzado' ), 400 );
		}

		$hash       = md5( $input->hash );
		$upload_dir = wp_get_upload_dir();
		$filename   = $upload_dir['basedir'] . '/mapa-fogo-cruzado/' . $hash . '.png';
		$fileurl    = $upload_dir['baseurl'] . '/mapa-fogo-cruzado/' . $hash . '.png';

		if ( file_exists( $filename ) ) {
			wp_send_json_success( $fileurl, 304 );
		}

		if ( false === file_put_contents( $filename, base64_decode( $input->base64 ) ) ) {
			wp_send_json_error( $fileurl, 403 );
		}

		wp_send_json_success( $fileurl, 201 );

	}

	/**
	 *
	 */
	public function find_graphic_image() {

		$input = json_decode( file_get_contents( 'php://input' ) );

		if ( ! isset( $input->hash ) ) {
			wp_send_json_error( __( 'Parâmetros incorretos', 'mapa-fogo-cruzado' ), 400 );
		}

		$hash       = md5( $input->hash );
		$upload_dir = wp_get_upload_dir();
		$filename   = $upload_dir['basedir'] . '/mapa-fogo-cruzado/' . $hash . '.png';
		$fileurl    = $upload_dir['baseurl'] . '/mapa-fogo-cruzado/' . $hash . '.png';

		if ( file_exists( $filename ) ) {
			wp_send_json_success( $fileurl, 200 );
		}

		wp_send_json_success( '', 200 );

	}

}
