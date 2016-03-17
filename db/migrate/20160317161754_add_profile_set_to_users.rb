class AddProfileSetToUsers < ActiveRecord::Migration
  def change
    add_column :users, :profile_set, :string
  end
end
