class AddEmailSetToUsers < ActiveRecord::Migration
  def change
    add_column :users, :email_set, :string
  end
end
