module RescuedApartmentMiddleware
  def call(env)
    begin
      super
    rescue Apartment::TenantNotFound
      return [ 302, {'Location' =>"https://www.profiler.datawrks.io"}, [] ]
    end
  end
end