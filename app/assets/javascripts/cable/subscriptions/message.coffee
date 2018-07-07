ready = ->
  console.log 'running subscription'

  App.cable.subscriptions.create { channel: "MessagesChannel" },
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