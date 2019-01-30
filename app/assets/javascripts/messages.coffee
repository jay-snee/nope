# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

ready = ->
    $('#message_render').on 'load', ->
      js_height = $('#message_render').contents().find('html').height()
      console.log js_height
      if js_height > 500
        $('#message_render').height(js_height + 20)
        console.log 'js_height'
      else
        $('#message_render').height(500)
        console.log '500'
      return
$(document).on 'turbolinks:load', ready
