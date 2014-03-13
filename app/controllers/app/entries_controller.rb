class EntriesController < ApplicationController

  def index
    @entries = @current_user.entries
    render json: @entries
  end

  def create
  end

  def update
  end

  def destroy
  end

  private

  def entry_params
    params.require(:entry).permit(:title, :description, :content)
  end
end
