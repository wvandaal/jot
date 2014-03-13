class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :title, null: false
      t.integer :user_id, null: false
      t.string :description
      t.text :content

      t.timestamps
    end
  end
end
