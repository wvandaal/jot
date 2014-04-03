class Entry < ActiveRecord::Base
  belongs_to :user, inverse_of: :entries, counter_cache: true
  has_many :comments, inverse_of: :entry

  validates :title, presence: true, length: {minimum: 4}
  validates :title, uniqueness: {scope: :user_id}
  validates :user, :content, presence: true
  validates :description, length: {maximum: 255}

  def as_json(options={})
    options[:methods] ||= [:author]
    super
  end

  def to_json(options={})
    options[:methods] ||= [:author]
    super
  end

  def author
    User.find_by_id(self.user_id).username
  end
end
