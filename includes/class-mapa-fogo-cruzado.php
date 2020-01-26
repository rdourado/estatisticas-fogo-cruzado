<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/includes
 * @author     Rafael Dourado <rdourado@gmail.com>
 */
class Mapa_Fogo_Cruzado {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Mapa_Fogo_Cruzado_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'MAPA_FOGO_CRUZADO_VERSION' ) ) {
			$this->version = MAPA_FOGO_CRUZADO_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'mapa-fogo-cruzado';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Mapa_Fogo_Cruzado_Loader. Orchestrates the hooks of the plugin.
	 * - Mapa_Fogo_Cruzado_i18n. Defines internationalization functionality.
	 * - Mapa_Fogo_Cruzado_Admin. Defines all hooks for the admin area.
	 * - Mapa_Fogo_Cruzado_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-mapa-fogo-cruzado-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-mapa-fogo-cruzado-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-mapa-fogo-cruzado-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-mapa-fogo-cruzado-public.php';

		$this->loader = new Mapa_Fogo_Cruzado_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Mapa_Fogo_Cruzado_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Mapa_Fogo_Cruzado_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Mapa_Fogo_Cruzado_Admin( $this->get_plugin_name(), $this->get_version() );

		// Assets
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		// Admin Tools Page
		$this->loader->add_action( 'admin_menu', $plugin_admin, 'add_plugin_page' );
		$this->loader->add_action( 'plupload_init', $plugin_admin, 'plupload_init' );
		$this->loader->add_action( 'wp_ajax_mapa-fogo-cruzado-import', $plugin_admin, 'import_to_db' );
		$this->loader->add_filter( 'set-screen-option', $plugin_admin, 'set_screen_option', 10, 3 );

		// Page Template
		$this->loader->add_filter( 'theme_page_templates', $plugin_admin, 'add_page_template' );
		$this->loader->add_filter( 'wp_insert_post_data', $plugin_admin, 'save_page_template' );
		$this->loader->add_filter( 'template_include', $plugin_admin, 'show_page_template' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Mapa_Fogo_Cruzado_Public( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		$this->loader->add_action( 'wp_ajax_fetch_map_data', $plugin_public, 'fetch_map_data' );
		$this->loader->add_action( 'wp_ajax_nopriv_fetch_map_data', $plugin_public, 'fetch_map_data' );
		$this->loader->add_action( 'wp_ajax_fetch_map_params', $plugin_public, 'fetch_map_params' );
		$this->loader->add_action( 'wp_ajax_nopriv_fetch_map_params', $plugin_public, 'fetch_map_params' );
		$this->loader->add_action( 'wp_ajax_create_graphic_image', $plugin_public, 'create_graphic_image' );
		$this->loader->add_action( 'wp_ajax_nopriv_create_graphic_image', $plugin_public, 'create_graphic_image' );
		$this->loader->add_action( 'wp_ajax_find_graphic_image', $plugin_public, 'find_graphic_image' );
		$this->loader->add_action( 'wp_ajax_nopriv_find_graphic_image', $plugin_public, 'find_graphic_image' );
		$this->loader->add_action( 'wp_head', $plugin_public, 'set_open_graph_tags', 99 );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Mapa_Fogo_Cruzado_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
