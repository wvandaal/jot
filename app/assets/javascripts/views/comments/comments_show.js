Jot.Views.CommentsShow = Backbone.View.extend({
  tagName: 'ul',
  className: 'comments',
  template: JST['comments/show'],

  events: {

  },

  initialize: function() {
    this.render();
  },

  render: function() {
    window.cc = this.collection;
    var content = this.template({
      comments: this.collection.commentsByParent(),
      template: this.template,
      key: null
    });

    this.$el.html(content);

    return this;
  }

});