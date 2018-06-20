class ProfilesController < ApplicationController
  def create
    @profile = current_user.profiles.create(name: profile_params[:name])

    if @profile.save
      redirect_to @profile, notice: "New profile '#{@profile.name}' created"
    else
      redirect_to root_path, alert: "Nope, that didn't work"
    end
  end

  def show
    @profile = Profile.find params[:id]
  end

  def destroy
    @profile = current_user.profiles.find params[:id]
    @profile.destroy

    redirect_to root_path, notice: 'Profile destroyed'
  end

  private

  def profile_params
    params.require(:profile).permit(:name)
  end
end
