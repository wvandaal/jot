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
        matches = this.collection.search(letters),
        ids     = matches.pluck('id');

    console.log(matches);
    console.log(ids);

    $users.each(function(i, u) {
      (ids.indexOf($(u).data('id')) >= 0 ? $.fn.show : $.fn.hide).call($(u));
    });
  }
});