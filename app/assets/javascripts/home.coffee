# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/


ready = ->
  $('.stripe-button-el').on 'click', ->
    $('#upgrade-modal').modal('hide')

  $("#dashboard-table").dataTable
    processing: true
    serverSide: true
    ajax:
      url: $('#users-datatable').data('source')
    pagingType: 'full_numbers'
    columns: [
      {data: 'subject'}
      {data: 'from'}
      {data: 'created_at'}
      {data: 'profile_id'}
    ]

$(document).on 'turbolinks:load', ready
