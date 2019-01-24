# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

ready = ->
	$('#message_render').on 'load', ->
	  $('#message_render').height $('#message_render').contents().find('html').height()
	  return
$(document).on 'turbolinks:load', ready
