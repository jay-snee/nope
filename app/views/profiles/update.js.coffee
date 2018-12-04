$.growl.notice({ title: "Updated!", message: "Profile name successfully updated!" })
$("#profile-<%= @profile.id %>").replaceWith("<%= escape_javascript (render @profile) %>");