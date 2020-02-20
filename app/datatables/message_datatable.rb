class MessageDatatable < AjaxDatatablesRails::ActiveRecord
  extend Forwardable

  def_delegator :@view, :link_to

  def initialize(params, opts = {})
    @view = opts[:view_context]
    super
  end

  def view_columns
    @view_columns ||= {
      subject: { source: 'Message.subject', cond: :like, orderable: false },
      from: { source: 'Message.from', cond: :like, orderable: false },
      created_at: { source: 'Message.created_at', orderable: false },
      profile_id: { source: 'Message.profile_id', orderable: false }
    }
  end

  def data
    records.map do |record|
      {
        id: record.id,
        from: link_to(record.from, record, class: 'text-info'),
        subject: link_to(record.subject, record, class: 'text-info'),
        profile_id: link_to(record.profile.name, record.profile, class: 'text-info'),
        created_at: record.created_at.strftime('%H:%M %d/%m/%Y'),
        DT_RowId: record.id
      }
    end
  end
end
