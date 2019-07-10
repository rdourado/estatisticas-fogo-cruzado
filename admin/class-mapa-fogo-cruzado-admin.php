<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/admin
 * @author     Rafael Dourado <rdourado@gmail.com>
 */
class Mapa_Fogo_Cruzado_Admin {

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
	 *
	 */
	private $menu_slug;

	/**
	 *
	 */
	private $templates;

	/**
	 *
	 */
	private $valid_ufs;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		$this->menu_slug   = $plugin_name . '-importer';
		$this->templates   = array(
			'mapa-fogo-cruzado-public-display.php' => __( 'Mapa Fogo Cruzado', 'mapa-fogo-cruzado' ),
		);
		$this->valid_ufs   = array(
			'AC',
			'AL',
			'AP',
			'AM',
			'BA',
			'CE',
			'DF',
			'ES',
			'GO',
			'MA',
			'MT',
			'MS',
			'MG',
			'PA',
			'PB',
			'PR',
			'PE',
			'PI',
			'RJ',
			'RN',
			'RS',
			'RO',
			'RR',
			'SC',
			'SP',
			'SE',
			'TO',
		);
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		if ( isset( $_GET['page'] ) && 'mapa-fogo-cruzado-importer' === $_GET['page'] ) {
			wp_enqueue_style(
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'css/mapa-fogo-cruzado-admin.css',
				array(),
				filemtime( plugin_dir_path( __FILE__ ) . 'css/mapa-fogo-cruzado-admin.css' ),
				'screen'
			);
		}

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		if ( isset( $_GET['page'] ) && 'mapa-fogo-cruzado-importer' === $_GET['page'] ) {
			wp_enqueue_script(
				$this->plugin_name,
				plugin_dir_url( __FILE__ ) . 'js/mapa-fogo-cruzado-admin.js',
				array( 'jquery', 'plupload-handlers', 'updates' ),
				filemtime( plugin_dir_path( __FILE__ ) . 'js/mapa-fogo-cruzado-admin.js' ),
				false
			);
		}

	}

	/**
	 *
	 */
	public function add_plugin_page() {

		$hook = add_management_page(
			__( 'Mapa Fogo Cruzado', 'mapa-fogo-cruzado' ),
			__( 'Mapa Fogo Cruzado', 'mapa-fogo-cruzado' ),
			'manage_options',
			'mapa-fogo-cruzado-importer',
			function() {
				include plugin_dir_path( __FILE__ ) . 'partials/mapa-fogo-cruzado-admin-display.php';
			}
		);

		add_action( "load-$hook", array( $this, 'screen_option' ) );

	}

	/**
	 * Screen options
	 */
	public function screen_option() {

		$option = 'per_page';
		$args   = array(
			'label'   => __( 'Ocorrências', 'mapa-fogo-cruzado' ),
			'default' => 100,
			'option'  => 'occurrences_per_page',
		);

		add_screen_option( $option, $args );

	}

	/**
	 * Save screen options
	 */
	public function set_screen_option( $status, $option, $value ) {

		return $value;

	}

	/**
	 *
	 */
	public function plupload_init( $plupload_init ) {

		if ( isset( $_GET['page'] ) && wp_unslash( $_GET['page'] ) === $this->menu_slug ) {
			$mime_types = array(
				array(
					'title'      => 'Excel 2007 files',
					'extensions' => 'xlsx',
				),
			);

			$plupload_init['filters'] = array_merge(
				$plupload_init['filters'],
				array( 'mime_types' => $mime_types )
			);
		}

		return $plupload_init;

	}

	/**
	 *
	 */
	private function sanitize_text( $text ) {

		return '1970-01-01 00:00:00' === $text || '?' === $text || '-' === $text ? '' : $text;

	}

	/**
	 *
	 */
	public function import_to_db() {

		require_once plugin_dir_path( __DIR__ ) . 'vendor/autoload.php';

		global $wpdb;
		$wpdb->hide_errors();

		$id        = $_POST['attachment_id'];
		$file      = get_attached_file( $id );
		$xlsx      = SimpleXLSX::parse( $file );
		$errors    = array();
		$lines_in  = 0;
		$lines_out = 0;

		if ( ! $xlsx ) {
			wp_send_json_error( SimpleXLSX::parseError(), 400 );
		}

		foreach ( $xlsx->sheetNames() as $sheet_index => $uf ) {
			if ( ! in_array( strtoupper( $uf ), $this->valid_ufs ) ) {
				continue 1;
			}

			foreach ( $xlsx->rows( $sheet_index ) as $row_index => $row ) {
				if ( ! $row_index ) { // Skip header
					continue 1;
				}

				list(
					$id,
					$street,
					$day,
					$month,
					$year,
					$lat,
					$lng,
					$had_police,
					$police_dead,
					$police_injured,
					$total_dead,
					$total_injured,
					$was_slaughter,
					$nbrhd,
					$city,
					$region,
					$upp
				) = $row;

				// Empty line?
				if ( ( empty( $city ) || '1970-01-01 00:00:00' === $city ) && ( empty( $region ) || '1970-01-01 00:00:00' === $region ) ) {
					continue 1;
				}

				$is_valid = true;

				// Format date
				$formatted_date = date_create_from_format( 'd/m/Y', strval( $day . '/' . $month . '/' . $year ) );

				// Check for errors
				if ( ! $formatted_date || '1970-01-01 00:00:00' === $formatted_date ) {
					$is_valid = false;
					// translators: $1: nome da tabela do Excel $2: número da linha
					$errors[] = sprintf( __( '[%1$s] Linha %2$d: Data não está formatada como texto ou não segue o padrão dd/mm/aaaa', 'mapa-fogo-cruzado' ), $uf, $row_index + 1 );
				}
				if ( empty( $region ) || '1970-01-01 00:00:00' === $region ) {
					$is_valid = false;
					// translators: $1: nome da tabela do Excel $2: número da linha
					$errors[] = sprintf( __( '[%1$s] Linha %2$d: Região não informada', 'mapa-fogo-cruzado' ), $uf, $row_index + 1 );
				}
				if ( empty( $city ) || '1970-01-01 00:00:00' === $city ) {
					$is_valid = false;
					// translators: $1: nome da tabela do Excel $2: número da linha
					$errors[] = sprintf( __( '[%1$s] Linha %2$d: Cidade não informada', 'mapa-fogo-cruzado' ), $uf, $row_index + 1 );
				}
				// if ( empty( $nbrhd ) ) {
				// 	$is_valid = false;
				// 	// translators: $1: nome da tabela do Excel $2: número da linha
				// 	$errors[] = sprintf( __( '[%1$s] Linha %2$d: Bairro não informado', 'mapa-fogo-cruzado' ), $uf, $row_index + 1 );
				// }
				if ( $lines_out + 1 >= 200 ) {
					wp_send_json_error(
						array(
							'errors'   => $errors,
							'imported' => $lines_in,
							'skipped'  => ++$lines_out,
						),
						400
					);
				}
				if ( ! $is_valid ) {
					$lines_out += 1;
					continue 1;
				}

				// Insert payload
				$data   = array(
					'external_id'    => intval( $id ),
					'date'           => date_format( $formatted_date, 'Y-m-d H:i:s' ),
					'latitude'       => floatval( $lat ),
					'longitude'      => floatval( $lng ),
					'had_police'     => intval( $had_police ),
					'police_dead'    => intval( $police_dead ),
					'police_injured' => intval( $police_injured ),
					'total_dead'     => intval( $total_dead ),
					'total_injured'  => intval( $total_injured ),
					'was_slaughter'  => 'Sim' === $was_slaughter,
					'city'           => $this->sanitize_text( $city ),
					'street'         => $this->sanitize_text( $street ),
					'nbrhd'          => $this->sanitize_text( $nbrhd ),
					'upp'            => $this->sanitize_text( $upp ),
					'region'         => $this->sanitize_text( $region ),
					'uf'             => strtolower( $uf ),
				);
				$format = array(
					'%d',
					'%s',
					'%f',
					'%f',
					'%d',
					'%d',
					'%d',
					'%d',
					'%d',
					'%d',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
					'%s',
				);

				$response = $wpdb->replace( $wpdb->prefix . 'mapa_fogo_cruzado', $data, $format );
				if ( $response ) {
					$lines_in += 1;
				} else {
					$lines_out += 1;
					// translators: $1: nome da tabela do Excel $2: número da linha $3: erro mysql
					$errors[] = sprintf( __( '[%1$s] Linha %2$d: %3$s', 'mapa-fogo-cruzado' ), $uf, $row_index + 1, $wpdb->last_error );
				}
			}
		}

		wp_delete_attachment( $id, true );
		wp_send_json_success(
			array(
				'errors'   => $errors,
				'imported' => $lines_in,
				'skipped'  => $lines_out,
			),
			200
		);

	}

	/**
	 *
	 */
	public function add_page_template( $posts_templates ) {

		$posts_templates = array_merge( $posts_templates, $this->templates );

		return $posts_templates;

	}

	/**
	 *
	 */
	public function save_page_template( $attributes ) {

		$cache_key = 'page_templates-' . md5( get_theme_root() . '/' . get_stylesheet() );

		$templates = wp_get_theme()->get_page_templates();
		if ( empty( $templates ) ) {
			$templates = array();
		}

		wp_cache_delete( $cache_key, 'themes' );
		$templates = array_merge( $templates, $this->templates );
		wp_cache_add( $cache_key, $templates, 'themes', 1800 );

		return $attributes;

	}

	/**
	 *
	 */
	public function show_page_template( $template ) {

		global $post;
		if ( ! $post ) {
			return $template;
		}

		$page_template = get_post_meta( $post->ID, '_wp_page_template', true );
		if ( ! isset( $this->templates[ $page_template ] ) ) {
			return $template;
		}

		$file = plugin_dir_path( __DIR__ ) . 'public/partials/' . $page_template;
		if ( file_exists( $file ) ) {
			return $file;
		}

		return $template;

	}

}
