ready = ->

  if $('#profile').length
    App.cable.subscriptions.create { channel: "ApplicationCable::ProfilesChannel", id: $('#profile').data('id') },
      received: (data) ->
        @prependLine(data)
     
      prependLine: (data) ->
        html = @createLine(data)
        $("#messages-list").prepend(html)
     
      createLine: (data) ->        
        # parse ISO8601 date and format for display
        dtstr = data.created_at 
        dtstr = dtstr.replace(/\D/g," ")
        dtcomps = dtstr.split(" ")
        # JS months are zero indexed, IS08601 aren't...
        dtcomps[1]--;
        convdt = new Date(Date.UTC(dtcomps[0],dtcomps[1],dtcomps[2],dtcomps[3],dtcomps[4],dtcomps[5]))
        date_string = convdt.toLocaleDateString("en-GB");
        # extract the time
        time = convdt.toTimeString()
        time_string = time.split(' ')[0].slice(0, -3);

        """
        <li class='list-group-item' data-envelope='#{data.envelope}'>
          <div class='d-flex justify-content-center align-items-center'>
            <div class='mr-auto p2'>
              <a href="/messages/#{data.id}">#{data.subject}</a>
            </div>
            <div class='mr-auto p2'>
              #{data.from} <#{data.envelope[1]}>
            </div>
            <div class='p1'>
              #{time_string} #{date_string}
            </div>
          </div>
        </li>
        """

$(document).on 'turbolinks:load', ready