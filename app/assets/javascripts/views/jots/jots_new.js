Jot.Views.JotsNew = Backbone.View.extend({
  tagName: 'div',
  className: 'container',
  template: JST["jots/new"],

  events: {
    "click #save": "beforeSubmit",
    "submit form": "submit",
    "reset form": "resetOutput",
    "keyup textarea#jot-content": "handleKeyup",
    "keydown textarea#jot-content": "handleKeydown",
    "click .resize-large": "resizeLarge",
    "click .resize-small": "resizeSmall"
  },

  // Renders the view
  render: function() {
    var content = this.template();
    this.$el.html(content);

    return this;
  },

  // Resizes the markdown output, exposes the title and description inputs, and
  // changes the #save button to type="submit"
  beforeSubmit: function(e) {
    var $output = $('#markdown-output'),
        $form   = $('#jot-form'),
        $save   = $('#save'),
        confirm = "<i class='icon-floppy'></i>save";

    this.resizeLarge(function() {
      $output.animate({height: "75%", top: 0}, 1000);
      $form.children(':not(#markdown-output)').animate({top: 0}, 1000);
      $save.attr('type', 'submit').html(confirm);
    });
  },

  submit: function(e) {
    e.preventDefault();

    var params = $(e.currentTarget).serializeJSON();

    console.log(params);
  },

  // Handles any keyup events
  handleKeyup: function() {
    this.renderMarkdown();
  },

  // TODO: add additional hotkeys to allow greater editing functionality:
  // 1) SUPER + '[' or ']' for indenting (allow use with selection)
  handleKeydown: function(e) {
    this.preventTabFocus(e);
  },

  // Resizes the markdown output to fill the width of the form
  resizeLarge: function(callback) {
    var $output   = $('#markdown-output'),
        $input    = $('#jot-content'),
        $button   = $('.resize-large'),
        interval  = 500;

    $input.animate({width: 0, margin: 0, padding: 0}, interval, function() {
      $input.css({height:0});
    });
    $output.animate({width: "100%"}, interval).promise().done(callback);

    $button.children().toggleClass('icon-resize-full icon-resize-small');
    $button.toggleClass('resize-large resize-small');
  },

  // Returns the form layout to its original size
  resizeSmall: function(callback) {
    var $output   = $('#markdown-output'),
        $input    = $('#jot-content'),
        $button   = $('.resize-small'),
        width     = "48.82117%"
        inputMarg = "0 2.35765% 1em 0"
        inputPad  = "0.75em 1em 0.75em 1em"
        interval  = 500;

    $output.animate({width: width}, interval);

    // Chaining animations avoids jQuery flickering bug when animating margin
    $input.css({height: $output.outerHeight()}).animate({width: width, padding: inputPad}, interval)
      .animate({margin: inputMarg}, 100).promise().done(callback);

    // Switch icons and button classes 
    $button.children().toggleClass('icon-resize-full icon-resize-small');
    $button.toggleClass('resize-large resize-small');
  },

  // Renders the content of the #jot-cotent as markdown in the #markdown-output
  // <div>. Note that this function uses a workaround to prevent double-escaping
  // of highlighted code by manually calling the marked.lexer and .parser
  renderMarkdown: function() {
    var md        = this.$("#jot-content").val(),
        $output   = this.$("#markdown-output"),
        tokens    = marked.lexer(md),
        prev      = $output.prop('innerHTML'),
        tok, cur;

    // Workaround to prevent double-escaping of code blocks
    for (var i = 0, tok = tokens[i]; i < tokens.length; ++i) {
      if (tok.type === "code") {
        tok.text = highlight(tok.text, tok.lang);
        tok.escaped = true;
      }
    }

    cur = marked.parser(tokens);

    // Insert a new waypoint and render the content in the output div
    $output.html(this.insertWaypoint(prev, cur));

    if (!!$output.find('#_waypoint').length) {
      
      // Scroll the output div to the waypoint minus half the output height
      $output.scrollTop($output.scrollTop() 
        + $output.find('#_waypoint').position().top 
        - $output.height()/2);
    }
  },

  // Inserts a waypoint into the output markdown to allow scroll-following
  // in the output as the user edits within the textarea
  insertWaypoint: function(prev, cur) {
    var waypoint  = '<span id="_waypoint">.</span>',
        closeRegx = /<\/\w+>/,
        _prev     = prev.replace(waypoint, ""),
        diff, diffInd, waypointInd, match;

    if (_prev !== cur) {
      // Calculates the difference between the previous and current outputs
      diff = Differ.diff_main(_prev, cur);

      // Finds the index of the first difference
      diffInd = !!diff[0] ? diff[0][1].length : 0;

      // Searches for the nearest closing tag after the first difference
      match = closeRegx.exec(cur.substring(diffInd));

      // If there is a match, set the waypoint index to the sum of diffInd and
      // the match index. If not, return the previous value
      if (!!match) {
        waypointInd = diffInd + match.index;
        return cur.substring(0, waypointInd) + waypoint 
          + cur.substring(waypointInd);
      } 
    } 
    return prev;
  }, 

  // Allows users to indent using the 'tab' key
  preventTabFocus: function(e) {
    // Prevent tab focus
    if (e.keyCode === 9) {
        // get caret position/selection
        var input = document.querySelector('#jot-content'),
            start = input.selectionStart,
            end   = input.selectionEnd,
            val   = $(input).val();

        // Set textarea value to: text before caret + tab + text after caret
        $(input).val(val.substring(0, start) + "\t" + val.substring(end));

        // Move the caret to the correct position and add +1 for the tab
        input.selectionStart = input.selectionEnd = start + 1;

        // Prevent the focus lose
        e.preventDefault();
    }
    this.renderMarkdown();
  }, 

  resetOutput: function() {
    var $output     = $('#markdown-output'),
        placeholder = $('<div id="placeholder">markdown preview</div>');

    $output.html(placeholder);
  }

});