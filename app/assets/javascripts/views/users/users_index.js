Jot.Views.UsersIndex = Backbone.View.extend({
  className: 'container',
  template: JST['users/index'],

  events: {
    'keyup #SEARCH': 'filter'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template({
      users: this.collection
    });

    this.$el.html(content);
    return this;
  },

  filter: function() {
    var letters = $('#SEARCH').val(),
        $users  = $('.user'),
        ids     = this.collection.search(letters).pluck('id');

    $users.each(function() {
      (ids.indexOf($(this).data('id')) >= 0 ? $.fn.show : $.fn.hide).call($(this));
    });
  }
});