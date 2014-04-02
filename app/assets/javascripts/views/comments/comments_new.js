Jot.Views.CommentsNew = Backbone.View.extend({
  tagName: 'li',
  className: 'new-comment',
  template: JST['comments/new'],

  events: {
    "click .icon-cancel": "close",
    "submit form": "submit"
  },

  initialize: function(options) {
    // data stores information about jot and user which is placed in hidden
    // inputs in the form
    this.data = options.data;

    this.render();
  },

  render: function() {
    var content = this.template({
      comment: this.data
    });
    this.$el.html(content);

    return this;
  },

  close: function(e) {
    this.$el.remove();
  },

  submit: function(e) {
    e.preventDefault();
    var data    = this.$('form').serializeJSON(),
        comment = new Jot.Models.Comment(data),
        that    = this;
  
    comment.save({}, {
      success: function(model) {
        that.collection.add(model);
        that.remove();
      },
      error: function(model, errors) {
        Jot.renderMessages(errors.responseJSON);
      }
    });
  }
});