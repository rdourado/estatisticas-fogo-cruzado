<?php

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

/**
 *
 */
class Mapa_Fogo_Cruzado_List_Table extends WP_List_Table {

	public function __construct() {

		parent::__construct(
			array(
				'singular' => __( 'Dados', 'mapa-fogo-cruzado' ),
				'plural'   => __( 'Dados', 'mapa-fogo-cruzado' ),
				'ajax'     => false,
			)
		);

	}

	/**
	 * Render a column when no column specific method exist.
	 *
	 * @param array $item A singular item (one full row's worth of data)
	 * @param array $column_name The name/slug of the column to be processed
	 *
	 * @return string Text or HTML to be placed inside the column <td>
	 */
	public function column_default( $item, $column_name ) {

		switch ( $column_name ) {
			case 'police':
				return 1 === intval( $item[ $column_name ] )
					? __( 'Sim', 'mapa-fogo-cruzado' )
					: __( 'Não', 'mapa-fogo-cruzado' );
			case 'date':
				return date( 'd/m/Y', strtotime( $item[ $column_name ] ) );
			case 'uf':
				return strtoupper( $item[ $column_name ] );
			default:
				return $item[ $column_name ];
		}

	}

	/**
	 * Render the bulk edit checkbox
	 *
	 * @see WP_List_Table::::single_row_columns()
	 * @param array $item A singular item (one full row's worth of data)
	 *
	 * @return string Text to be placed inside the column <td>
	 */
	function column_cb( $item ) {

		return sprintf(
			'<input type="checkbox" name="bulk-delete[]" value="%s" />',
			$item['ID']
		);

	}

	/**
	 * Method for name column
	 *
	 * @param array $item an array of DB data
	 *
	 * @return string
	 */
	/*
	function column_name( $item ) {

		$delete_nonce = wp_create_nonce( 'fc_delete_occurrence' );
		$title        = '<strong>' . $item['name'] . '</strong>';
		$actions      = array(
			'delete' => sprintf(
				'<a href="?page=%s&action=%s&occurrence=%s&_wpnonce=%s">%s</a>',
				esc_attr( $_REQUEST['page'] ),
				'delete',
				absint( $item['ID'] ),
				$delete_nonce,
				__( 'Delete' )
			),
		);

		return $title . $this->row_actions( $actions );
	}
	*/

	/**
	 *  Associative array of columns
	 *
	 * @see WP_List_Table::::single_row_columns()
	 *
	 * @return array An associative array containing column information: 'slugs' => 'Visible Titles'
	 */
	function get_columns() {

		return array(
			'cb'          => '<input type="checkbox" />',
			'uf'          => __( 'UF', 'mapa-fogo-cruzado' ),
			'external_id' => __( 'ID', 'mapa-fogo-cruzado' ),
			'date'        => __( 'Data', 'mapa-fogo-cruzado' ),
			'region'      => __( 'Região', 'mapa-fogo-cruzado' ),
			'city'        => __( 'Cidade', 'mapa-fogo-cruzado' ),
			'nbrhd'       => __( 'Bairro', 'mapa-fogo-cruzado' ),
			'police'      => __( 'Polícia', 'mapa-fogo-cruzado' ),
			'police_dead' => __( 'P. Mortos', 'mapa-fogo-cruzado' ),
			'police_hurt' => __( 'P. Feridos', 'mapa-fogo-cruzado' ),
			'civil_dead'  => __( 'C. Mortos', 'mapa-fogo-cruzado' ),
			'civil_hurt'  => __( 'C. Feridos', 'mapa-fogo-cruzado' ),
		);

	}

	/**
	 * Columns to make sortable.
	 *
	 * @return array An associative array containing all the columns that should be sortable: 'slugs'=>array('data_values',bool)
	 */
	public function get_sortable_columns() {

		return array(
			'external_id' => array( 'external_id', false ),
			'uf'          => array( 'uf', false ),
			'date'        => array( 'date', false ),
			'region'      => array( 'region', false ),
			'city'        => array( 'city', false ),
			'nbrhd'       => array( 'nbrhd', false ),
			'police'      => array( 'police', false ),
			'police_dead' => array( 'police_dead', false ),
			'police_hurt' => array( 'police_hurt', false ),
			'civil_dead'  => array( 'civil_dead', false ),
			'civil_hurt'  => array( 'civil_hurt', false ),
		);

	}

	/**
	 * Retrieve occurrences data from the database
	 *
	 * @param int $per_page
	 * @param int $page_number
	 *
	 * @return mixed
	 */
	public static function get_occurrences( $per_page = 100, $page_number = 1 ) {

		global $wpdb;

		$sql = "SELECT * FROM {$wpdb->prefix}mapa_fogo_cruzado";

		if ( ! empty( $_REQUEST['orderby'] ) ) {
			$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
		}

		$sql .= " LIMIT $per_page";
		$sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;

		return $wpdb->get_results( $sql, 'ARRAY_A' ); // phpcs:ignore

	}

	/**
	 * Returns the count of records in the database.
	 *
	 * @return null|string
	 */
	public static function record_count() {

		global $wpdb;

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}mapa_fogo_cruzado";

		return $wpdb->get_var( $sql ); // phpcs:ignore

	}

	/**
	 * Handles data query and filter, sorting, and pagination.
	 *
	 * @global WPDB $wpdb
	 * @uses $this->_column_headers
	 * @uses $this->items
	 * @uses $this->get_columns()
	 * @uses $this->get_sortable_columns()
	 * @uses $this->get_pagenum()
	 * @uses $this->set_pagination_args()
	 */
	public function prepare_items() {

		$columns  = $this->get_columns();
		$hidden   = array();
		$sortable = $this->get_sortable_columns();

		$this->_column_headers = array( $columns, $hidden, $sortable );

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'occurrences_per_page', 100 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$this->set_pagination_args(
			array(
				'total_items' => $total_items,
				'per_page'    => $per_page,
			)
		);

		$this->items = self::get_occurrences( $per_page, $current_page );

	}

	/**
	 * Delete a occurrence record.
	 *
	 * @param int $id occurrence ID
	 */
	public static function delete_occurrence( $id ) {

		global $wpdb;

		$wpdb->delete(
			"{$wpdb->prefix}mapa_fogo_cruzado",
			array( 'ID' => $id ),
			array( '%d' )
		);

	}

	/**
	 * Returns an associative array containing the bulk action
	 *
	 * @return array An associative array containing all the bulk actions: 'slugs'=>'Visible Titles'
	 */
	public function get_bulk_actions() {

		return array(
			'bulk-delete' => 'Delete',
		);

	}

	/**
	 * Process bulk actions
	 *
	 * @see $this->prepare_items()
	 */
	public function process_bulk_action() {

		if ( 'delete' === $this->current_action() ) {
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'fc_delete_occurrence' ) ) {
				wp_die( 'Go get a life script kiddies' );
			} else {
				self::delete_occurrence( absint( $_GET['occurrence'] ) );
			}
		}

		if ( ( isset( $_POST['action'] ) && 'bulk-delete' === $_POST['action'] )
			|| ( isset( $_POST['action2'] ) && 'bulk-delete' === $_POST['action2'] )
		) {
			$delete_ids = esc_sql( $_POST['bulk-delete'] );

			foreach ( $delete_ids as $id ) {
				self::delete_occurrence( $id );
			}
		}

	}

	/** Text displayed when no occurrence data is available */
	public function no_items() {

		_e( 'Nenhum dado disponível.', 'mapa-fogo-cruzado' );

	}

}
