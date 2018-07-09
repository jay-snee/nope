ready = ->
  console.log 'running ready event'

  if $('#profile').length
    console.log 'profile detected: ' + $('#profile').data('id')
    App.cable.subscriptions.create { channel: "ApplicationCable::ProfilesChannel", id: $('#profile').data('id') },
      received: (data) ->
        console.log 'received'
        @prependLine(data)
     
      prependLine: (data) ->
        console.log 'prepending'
        html = @createLine(data)
        $("#messages-list").prepend(html)
     
      createLine: (data) ->
        console.log 'creating line'
        """
        <li class='list-group-item'>
          #{data.inspect}
        </li>
        """

$(document).on 'turbolinks:load', ready