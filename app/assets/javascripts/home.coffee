# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


ready = ->
  console.log 'loaded'
  $('.stripe-button-el').on 'click', ->
    console.log 'clicked'
    $('#upgrade-modal').modal('hide')

$(document).on 'turbolinks:load', ready