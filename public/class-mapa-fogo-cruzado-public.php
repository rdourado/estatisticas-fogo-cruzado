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
				'googlefonts',
				'//fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700&display=swap',
				array(),
				null,
				'screen'
			);
			wp_enqueue_style(
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'css/mapa-fogo-cruzado-public.css',
				array( 'googlefonts', 'dashicons' ),
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
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'js/mapa-fogo-cruzado-public.js',
				array(),
				filemtime( plugin_dir_path( __FILE__ ) . 'js/mapa-fogo-cruzado-public.js' ),
				true
			);
			wp_enqueue_script(
				'facebook-sdk',
				'https://connect.facebook.net/pt_BR/sdk.js',
				array( $this->plugin_name ),
				null,
				true
			);

			$key      = (string) file_get_contents( '.apikey' );
			$localize = array(
				'key'       => trim( $key ),
				'ajax_url'  => str_replace( $this->get_domain(), '', admin_url( 'admin-ajax.php' ) ),
				'logo'      => plugin_dir_url( __FILE__ ) . 'img/logo-fogo-cruzado.png',
				'loading'   => plugin_dir_url( __FILE__ ) . 'img/loading.gif',
				'pin'       => plugin_dir_url( __FILE__ ) . 'img/pin.png',
				'permalink' => get_permalink(),
			);

			if ( isset( $_GET['hash'] ) && ! empty( $_GET['hash'] ) ) {
				list($filters_hash) = explode( '_', $_GET['hash'] );
				$transient          = 'mapa_fogo_cruzado-' . $filters_hash;
				$filters            = (array) get_transient( $transient );
				if ( false !== reset( $filters ) ) {
					$localize = array_merge( $localize, $filters );
				}
			}

			wp_localize_script( $this->plugin_name, 'mapa_fogo_cruzado', $localize );
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
		$transient = 'mapa_fogo_cruzado-' . md5( wp_json_encode( $uf ) );
		$data      = get_transient( $transient );

		if ( false === $data ) {
			// phpcs:disable
			$ufs = $wpdb->get_col(
				"
				SELECT DISTINCT LOWER(`uf`) `uf`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `date` > '1000-00-00'
				ORDER BY `uf` DESC
				"
			);
			$years = $wpdb->get_results(
				"
				SELECT YEAR(`date`) `year`, MIN(`date`) `first`, MAX(`date`) `last`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `uf` = '{$uf}' AND `date` > '1000-00-00'
				GROUP BY `year`
				ORDER BY `year` DESC
				"
			);
			$locations = $wpdb->get_results(
				"
				SELECT DISTINCT `region`, `city`, `nbrhd`
				FROM `{$wpdb->prefix}mapa_fogo_cruzado`
				WHERE `uf` = '{$uf}' AND `date` > '1000-00-00'
				ORDER BY `region`, `city`, `nbrhd`
				"
			);
			// phpcs:enable

			$data = array(
				'ufs'       => $ufs,
				'years'     => $years,
				'locations' => $locations,
			);

			set_transient( $transient, $data, DAY_IN_SECONDS );
		}

		wp_send_json_success( $data, 200 );

	}

	/**
	 *
	 */
	public function fetch_map_data() {

		global $wpdb;

		$filters   = json_decode( file_get_contents( 'php://input' ) );
		$chunk     = isset( $filters->chunk ) && intval( $filters->chunk ) >= 0 ? intval( $filters->chunk ) : 0;
		$transient = 'mapa_fogo_cruzado-' . md5( wp_json_encode( $filters ) );
		$data      = get_transient( $transient );

		if ( false === $data ) {
			$date_end   = ! empty( $filters->dates ) && is_array( $filters->dates )
				? date( 'Y-m-t 23:59:59', end( $filters->dates ) )
				: date( 'Y-m-t 23:59:59' );
			$time_start = strtotime( '-12 months', strtotime( $date_end ) );
			$date_start = date( 'Y-m-01 00:00:00', $time_start );

			$where = array_filter(
				array(
					'1=1',
					"`date` >= '" . $date_start . "'",
					"`date` <= '" . $date_end . "'",
					! empty( $filters->uf )
						? "`uf` = '" . $wpdb->_escape( $filters->uf ) . "'" : "`uf` = 'rj'",
				)
			);
			$where = implode( ' AND ', $where );

			$count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM `{$wpdb->prefix}mapa_fogo_cruzado` WHERE {$where}" ); // phpcs:ignore
			$limit = ( ceil( $count / 2 ) * $chunk ) . ',' . ceil( $count / 2 );

			$sql  = "SELECT DATE_FORMAT(`date`, '%Y-%m-%d') as 'date', `lat`, `lng`, `police`, `police_dead`, `police_hurt`, `civil_dead`, `civil_hurt`, `massacre`, `uf`, `region`, `city`, `nbrhd`, `upp` FROM `{$wpdb->prefix}mapa_fogo_cruzado` WHERE {$where} ORDER BY `date` DESC LIMIT {$limit}";
			$data = $wpdb->get_results( $sql ); // phpcs:ignore

			set_transient( $transient, $data, DAY_IN_SECONDS );
		}

		wp_send_json_success( $data, 200 );

	}

	/**
	 *
	 */
	public function create_graphic_image() {

		$input = json_decode( file_get_contents( 'php://input' ) );

		if ( ! isset( $input->base64, $input->filters, $input->data, $input->labels ) ) {
			wp_send_json_error( __( 'Parâmetros incorretos', 'mapa-fogo-cruzado' ), 400 );
		}

		$filters_hash = md5( wp_json_encode( $input->filters ) );
		$image_hash   = md5( wp_json_encode( array_merge( $input->data, $input->labels ) ) );
		$upload_dir   = wp_get_upload_dir();
		$filename     = $upload_dir['basedir'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';
		$fileurl      = $upload_dir['baseurl'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';
		$result       = array(
			'image' => $fileurl,
			'share' => 'hash=' . $filters_hash . '_' . $image_hash,
		);

		// Saving filters before creating image.
		$transient = 'mapa_fogo_cruzado-' . $filters_hash;
		set_transient( $transient, $input->filters, DAY_IN_SECONDS );

		if ( file_exists( $filename ) ) {
			wp_send_json_success( $result, 304 );
		}

		if ( false === file_put_contents( $filename, base64_decode( $input->base64 ) ) ) {
			wp_send_json_error( $result, 403 );
		}

		wp_send_json_success( $result, 201 );

	}

	/**
	 *
	 */
	public function find_graphic_image() {

		$input = json_decode( file_get_contents( 'php://input' ) );

		if ( ! isset( $input->filters, $input->data, $input->labels ) ) {
			wp_send_json_error( __( 'Parâmetros incorretos', 'mapa-fogo-cruzado' ), 400 );
		}

		$filters_hash = md5( wp_json_encode( $input->filters ) );
		$image_hash   = md5( wp_json_encode( array_merge( $input->data, $input->labels ) ) );
		$transient    = 'mapa_fogo_cruzado-' . $filters_hash;
		$upload_dir   = wp_get_upload_dir();
		$filename     = $upload_dir['basedir'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';
		$fileurl      = $upload_dir['baseurl'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';
		$result       = array(
			'image' => $fileurl,
			'share' => 'hash=' . $filters_hash . '_' . $image_hash,
		);

		if ( file_exists( $filename ) && false !== get_transient( $transient ) ) {
			wp_send_json_success( $result, 200 );
		}

		wp_send_json_success( '', 200 );

	}

	/**
	 *
	 */
	public function set_open_graph_tags() {

		if ( is_page_template( 'mapa-fogo-cruzado-public-display.php' ) && isset( $_GET['hash'] ) ) {
			list( $filters_hash, $image_hash ) = explode( '_', $_GET['hash'] );

			$upload_dir = wp_get_upload_dir();
			$filename   = $upload_dir['basedir'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';
			$fileurl    = $upload_dir['baseurl'] . '/mapa-fogo-cruzado/' . $image_hash . '.png';

			if ( file_exists( $filename ) ) {
				$title = get_the_title();
				$url   = add_query_arg( 'hash', $filters_hash . '_' . $image_hash, get_permalink() );
				echo '<meta property="fb:app_id" content="2372121396378115" />';
				echo '<meta property="og:title" content="' . $title . '" />';
				echo '<meta property="og:description" content="' . $title . '" />';
				echo '<meta property="og:url" content="' . $url . '" />';
				echo '<meta property="og:image" content="' . $fileurl . '" />';
				echo '<meta property="og:image:alt" content="Mapa Fogo Cruzado" />';
				echo '<meta property="og:image:width" content="440" />';
				echo '<meta property="og:image:height" content="515" />';
				echo '<meta property="og:type" content="website" />';
				echo '<meta name="twitter:card" content="summary_large_image">';
				echo '<meta name="twitter:site" content="@fogocruzadoapp">';
				echo '<meta name="twitter:title" content="' . $title . '">';
				echo '<meta name="twitter:description" content="Up than 200 characters.">';
				echo '<meta name="twitter:creator" content="@fogocruzadoapp">';
				echo '<meta name="twitter:image" content="' . $fileurl . '">';
				echo '<meta name="twitter:domain" content="fogocruzado.org.br">';
			}
		}

	}

}
