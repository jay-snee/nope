## Handle tenant 404s without producing an error
module Profiler  
  class Apartment < ::Apartment::Elevators::FirstSubdomain
    def call(env)
      super
    rescue ::Apartment::TenantNotFound
      [302, {'Location' => '/'}, []]
    end
  end
end