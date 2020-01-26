<?php

/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       http://rafaeldourado.com.br
 * @since      1.0.1
 *
 * @package    Mapa_Fogo_Cruzado
 * @subpackage Mapa_Fogo_Cruzado/public/partials
 */

get_header();

echo '<div id="mapa-fogo-cruzado"></div>';

while ( have_posts() ) {
	the_post();
	echo '<div class="mapa-fogo-cruzado__footer">';
	the_content();
	echo '</div>';
}

get_footer();
