class Entry < ActiveRecord::Base
  belongs_to :user

  validates :title, presence: true, length: {minimum: 4}
  validates :title, uniqueness: {scope: :user_id}
  validates :user, :content, presence: true
  validates :description, length: {maximum: 255}
end
