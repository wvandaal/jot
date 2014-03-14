class Api::EntriesController < ApplicationController

  def index
    @entries = User.find(params[:user_id]).entries
    render json: @entries
  end

  def show
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  # Use @current_user.entries.build to negate need for :user_id
  def create
    @entry = User.find(params[:user_id]).entries.build(entry_params)

    if @entry.save
      render json: @entry
    else
      render json: @entry.errors.full_messages, status: :unprocessable_entity 
    end
  end

  def edit
    @entry = Entry.find(params[:id])
    render json: @entry
  end

  def update
    @entry = Entry.find(params[:id])
  end

  def destroy
  end

  private

  # Remove user_id to incorporate @current_user
  def entry_params
    params.require(:entry).permit(:title, :description, :content)
  end
end
