<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.0
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/admin/partials
 */

if ( ! current_user_can( 'upload_files' ) ) {
	wp_die( __( 'Sorry, you are not allowed to upload files.' ) );
}

require_once plugin_dir_path( __DIR__ ) . 'class-mapa-fogo-cruzado-list-table.php';

$post_id    = 0;
$title      = __( 'Importar estatísticas para o Mapa do Fogo Cruzado', 'fogocruzado' );
$subtitle   = __( 'Dados Importados', 'fogocruzado' );
$form_class = 'media-upload-form type-form validate';

if ( get_user_setting( 'uploader' ) || isset( $_GET['browser-uploader'] ) ) {
	$form_class .= ' html-uploader';
}

$list_table = new Mapa_Fogo_Cruzado_List_Table();
$list_table->prepare_items();

?>
<div class="wrap">
	<h1><?php echo esc_html( $title ); ?></h1>

	<form enctype="multipart/form-data" method="post" action="<?php echo admin_url( 'media-new.php' ); ?>" class="<?php echo esc_attr( $form_class ); ?>" id="file-form">

		<?php media_upload_form(); ?>

		<script type="text/javascript">
		var post_id = <?php echo $post_id; ?>, shortform = 3;
		</script>
		<input type="hidden" name="post_id" id="post_id" value="<?php echo $post_id; ?>" />

		<?php wp_nonce_field( 'media-form' ); ?>
		<div id="media-items" class="hide-if-no-js"></div>

	</form>
	<div id="bulk-action-notice"></div>

	<br>
	<h2><?php echo esc_html( $subtitle ); ?></h2>

	<form id="mapa-fogo-cruzado" method="post">
		<input type="hidden" name="page" value="<?php echo $_REQUEST['page']; ?>" />
		<?php $list_table->display(); ?>
	</form>
</div>

<script id="tmpl-fc-bulk-updates-admin-notice" type="text/html">
	<div id="{{ data.id }}" class="{{ data.className }} notice <# if ( data.errors ) { #>notice-error<# } else { #>notice-success<# } #>">
		<p>
			<# if ( data.successes ) { #>
				<# if ( 1 === data.successes ) { #>
					<?php _e( '{{ data.successes }} linha da tabela foi importada.', 'mapa-fogo-cruzado' ); ?>
				<# } else { #>
					<?php _e( '{{ data.successes }} linhas da tabela foram importadas.', 'mapa-fogo-cruzado' ); ?>
				<# } #>
			<# } #>
			<# if ( data.errors ) { #>
				<button class="button-link bulk-action-errors-collapsed" aria-expanded="false">
					<# if ( 1 === data.errors ) { #>
						<?php _e( '{{ data.errors }} linha com erro.', 'mapa-fogo-cruzado' ); ?>
					<# } else { #>
						<?php _e( '{{ data.errors }} linhas com erro.', 'mapa-fogo-cruzado' ); ?>
					<# } #>
					<span class="screen-reader-text"><?php _e( 'Show more details' ); ?></span>
					<span class="toggle-indicator" aria-hidden="true"></span>
				</button>
			<# } #>
		</p>
		<# if ( data.errors ) { #>
			<ul class="bulk-action-errors hidden">
				<# _.each( data.errorMessages, function( errorMessage ) { #>
					<li>{{ errorMessage }}</li>
				<# } ); #>
			</ul>
		<# } #>
	</div>
</script>
