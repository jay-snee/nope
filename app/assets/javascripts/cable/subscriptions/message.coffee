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
        $("[data-chat-room='Best Room']").prepend(html)
     
      createLine: (data) ->
        console.log 'creating line'
        """
        <article class="chat-line">
          <span class="speaker">#{data["sent_by"]}</span>
          <span class="body">#{data["body"]}</span>
        </article>
        """

$(document).on 'turbolinks:load', ready