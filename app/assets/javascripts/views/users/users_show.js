Jot.Views.UsersShow = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: JST['users/show'],

  events: {

  },

  initialize: function() {
    this.collection.fetch();
  },

  render: function() {
    console.log(this.collection);
    var content = this.template({
      user: this.model,
      jots: this.collection
    });

    this.$el.html(content);

    return this;
  },

  renderPreview: function(md) {
    var tokens  = marked.lexer(md),
        $output = $('#markdown-output'),
        preview;

    for (var i = 0, tok = tokens[i]; i < tokens.length; ++i) {
      if (tok.type === "code") {
        tok.text = highlight(tok.text, tok.lang);
        tok.escaped = true;
      }
    }

    preview = marked.parser(tokens);

    $output.html(preview);    

    return preview;
  }


});
