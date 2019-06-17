/* globals jQuery ajaxurl pluploadL10n wp */
/* eslint-disable */
;(function($) {
	'use strict'

	uploadSuccess = function(fileObj, serverData) {
		var item = $('#media-item-' + fileObj.id)
		serverData = serverData.replace(/^<pre>(\d+)<\/pre>$/, '$1')

		if (serverData.match(/media-upload-error|error-div/)) {
			return item.html(serverData)
		} else {
			$('.percent', item).html(pluploadL10n.crunching)
		}

		prepareMediaItem(fileObj, serverData)
	}

	function prepareMediaItem(fileObj, serverData) {
		var item = $('#media-item-' + fileObj.id)
		item.load(
			'async-upload.php',
			{
				attachment_id: serverData,
				fetch: 3,
			},
			function() {
				prepareMediaItemInit(fileObj, serverData)
			}
		)
	}

	function prepareMediaItemInit(fileObj, attachId) {
		var item = $('#media-item-' + fileObj.id)
		$('.filename.original', item).replaceWith($('.filename.new', item))
		$('.edit-attachment', item)
			.text('Importar')
			.on('click', function(event) {
				event.preventDefault()
				runAction(item, attachId)
			})
	}

	function runAction(item, attachId) {
		$('.edit-attachment', item).replaceWith(
			'<div class="progress"><div class="percent">Importando…</div><div class="bar"></div></div>'
		)
		$('.progress', item).css('backgroundColor', '#22272c')
		$.post(ajaxurl, {
			action: 'mapa-fogo-cruzado-import',
			attachment_id: attachId,
		})
			.done(function(response) {
				actionSuccess(item, response)
			})
			.fail(function(response) {
				actionFail(item, response)
			})
	}

	function actionSuccess(item, response) {
		var data = response.responseJSON && response.responseJSON.data
		if (data && data.skipped) showErrors(data.errors, data.imported, data.skipped)
		$('.percent', item).text('Deu certo!')
		$('.progress', item).css('backgroundColor', '#4ab866')
	}

	function actionFail(item, response) {
		var data = response.responseJSON && response.responseJSON.data
		if (data && data.skipped) showErrors(data.errors, data.imported, data.skipped)
		$('.percent', item).text('Erro!')
		$('.progress', item).css('backgroundColor', '#d94f4f')
	}

	function showErrors(errorMessages, successes, errors) {
		var $bulkActionNotice
		wp.updates.adminNotice = wp.template('fc-bulk-updates-admin-notice')
		wp.updates.addAdminNotice({
			id: 'bulk-action-notice',
			className: 'bulk-action-notice',
			successes: successes,
			errors: errors,
			errorMessages: errorMessages,
		})
		$bulkActionNotice = $('#bulk-action-notice').on('click', 'button', function() {
			$(this)
				.toggleClass('bulk-action-errors-collapsed')
				.attr('aria-expanded', !$(this).hasClass('bulk-action-errors-collapsed'))
			$bulkActionNotice.find('.bulk-action-errors').toggleClass('hidden')
		})
	}
})(jQuery)
