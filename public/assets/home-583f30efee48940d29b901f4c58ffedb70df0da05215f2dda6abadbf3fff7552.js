(function() {
  var ready;

  ready = function() {
    $(".dropdown-toggle").dropdown();
    return $("#dashboard-table").dataTable({
      processing: true,
      serverSide: true,
      ajax: {
        url: $('#users-datatable').data('source')
      },
      pagingType: 'full_numbers',
      columns: [
        {
          data: 'subject'
        }, {
          data: 'from'
        }, {
          data: 'created_at'
        }, {
          data: 'profile_id'
        }
      ]
    });
  };

  $(document).on('turbolinks:load', ready);

}).call(this);
