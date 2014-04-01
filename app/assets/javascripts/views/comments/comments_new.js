Jot.Views.CommentsNew = Backbone.View.extend({
  tagName: 'li',
  className: 'new-comment',
  template: JST['comments/new'],

  events: {
    "click .icon-cancel": "close",
    "submit form": "submit"
  },

  initialize: function(options) {
    this.data = options.data;

    this.render();
  },

  render: function() {
    var content = this.template({
      comment: this.data
    });
    this.$el.html(content);
    console.log(this.$el);

    return this;
  },

  close: function(e) {
    this.$el.remove();
  },

  submit: function(e) {
    e.preventDefault();
    var data    = this.$('form').serializeJSON(),
        comment = new Jot.Models.Comment(data);
    
    console.log(comment);
  }
});