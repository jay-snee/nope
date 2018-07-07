ready = ->
  App.cable.subscriptions.create { channel: "MessagesChannel" },
    received: (data) ->
      @prependLine(data)
   
    prependLine: (data) ->
      html = @createLine(data)
      $("[data-chat-room='Best Room']").prepend(html)
   
    createLine: (data) ->
      """
      <article class="chat-line">
        <span class="speaker">#{data["sent_by"]}</span>
        <span class="body">#{data["body"]}</span>
      </article>
      """

$(document).on 'turbolinks:load', ready