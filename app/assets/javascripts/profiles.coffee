# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

ready = ->
  $('.toggle-button').each (index) ->
    console.log $(this).data('state')
    if $(this).data('state') == 'true'
      $(this).removeClass('btn-outline-warning')
      $(this).addClass('btn-outline-success')




$(document).on 'turbolinks:load', ready