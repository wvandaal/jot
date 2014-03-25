Jot.Views.Messages = Backbone.View.extend({
  tagName: 'ul',
  template: JST['layouts/messages'],

  initialize: function(options) {
    this.messages = options.messages;
    this.render();
  },

  render: function() {
    var content = this.template({
      messages: this.messages.msgs,
      errors: this.messages.errors
    });

    this.$el.html(content);

    return this;
  }
});