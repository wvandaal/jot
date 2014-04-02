Jot.Views.JotsEdit = Backbone.View.extend({
  className: 'container',
  template: JST['jots/edit'],

  events: {
    "submit form": "submit",
    "click .save": "beforeSubmit",
    "keyup textarea#JOT-CONTENT": "handleKeyup",
    "keydown textarea#JOT-CONTENT": "handleKeydown",
    "click .resize-large": "resizeLarge",
    "click .resize-small": "resizeSmall",
    "click #DOWNLOAD": "download"
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    var content = this.template({
      jot: this.model
    });

    this.$el.html(content);
    return this;
  },

  submit: function(e) {
    e.preventDefault();

    var params = $(e.currentTarget).serializeJSON();

    this.model.save(params, {
      success: function(jot) {
        Jot.Messages = {msgs: ['"' + jot.escape('title') + '"' + ' successfully updated.']};
        Backbone.history.navigate('', {trigger: true});
      },
      error: function(model, errors) {
        Jot.renderMessages(errors.responseJSON);
      }
    });
  },

  // Resizes the markdown output, exposes the title and description inputs, and
  // changes the .save button to type="submit"
  beforeSubmit: function(e) {
    var $output = $('#MARKDOWN-OUTPUT'),
        $form   = $('#JOT-FORM'),
        $save   = $('.save'),
        confirm = "<i class='icon-check'></i> confirm";

    this.resizeLarge(function() {
      $output.animate({top: "+=4em"}, 500);
      $form.find('textarea').animate({top: "+=4em"}, 500);
      $form.find('input').animate({top: 1}, 500);
      $save.attr('type', 'submit').html(confirm);
      $save.toggleClass('save');
    });
  },

  // Handles any keyup events
  handleKeyup: function() {
    if (this._timeout) {
      window.clearTimeout(this._timeout);
    }
    this._timeout = window.setTimeout(this._renderMD.bind(this), 250);
  },

  handleKeydown: function(e) {
    this._preventTabFocus(e);
  },

  // Resizes the markdown output to fill the width of the form
  resizeLarge: function(callback) {
    var $output   = $('#MARKDOWN-OUTPUT'),
        $input    = $('#JOT-CONTENT'),
        $button   = $('.resize-large'),
        interval  = 250;

    $input.animate({width: 0, padding: 0}, interval);
    $output.animate({width: "100%"}, interval).promise().done(callback);

    $button.children().toggleClass('icon-resize-full icon-resize-small');
    $button.toggleClass('resize-large resize-small');
  },

  // Returns the form layout to its original size
  resizeSmall: function(callback) {
    var $output   = $('#MARKDOWN-OUTPUT'),
        $input    = $('#JOT-CONTENT'),
        $button   = $('.resize-small'),
        width     = "48.82117%",
        inputMarg = "0 2.35765% 1em 0",
        inputPad  = "0.75em 1em 0.75em 1em",
        interval  = 250;

    $output.animate({width: width}, interval);

    $input.animate({width: width, padding: inputPad, margin: inputMarg}, interval)
      .promise().done(callback);

    // Switch icons and button classes 
    $button.children().toggleClass('icon-resize-full icon-resize-small');
    $button.toggleClass('resize-large resize-small');
  },

  // Render markdown based on textarea content when keyup is triggered
  _renderMD: function() {
    var md        = this._addWaypoint(),
        $output   = this.$("#MARKDOWN-OUTPUT");

    // Insert a new waypoint and render the content in the output div
    $output.html(marked(md));

    if ($output.find('#_WAYPOINT').length) {
      // Scroll the output div to the waypoint minus half the output height
      $output.scrollTop($output.scrollTop() +
        $output.find('#_WAYPOINT').position().top -
        $output.height()/2);
    }
  },

  // Adds a unique span element with an id of #_WAYPOINT, allowing for text
  // following when markdown is rendered. Note: this method relies on custom
  // renderer definition in main application file (jot.js). 
  _addWaypoint: function() {
    var $content      = this.$('#JOT-CONTENT'),
        cur           = $content.val(),
        waypoint      = '<span id="_WAYPOINT"></span>',
        charRegx      = /[a-z0-9]/i,
        lastcharRegx  = /[a-z0-9](?=\W*$)/gi,
        cursorPos     = $content.prop('selectionStart'),
        waypointInd, match;

    // If the char at the cursor position is not a word char
    if (!charRegx.test(cur[cursorPos])) {
      match = charRegx.exec(cur.substring(cursorPos));

      // If there is a word char after the cursor position
      if (match) {

        // Set the waypoint index to the cursor position + the index of next
        // word character in the remaining substring
        waypointInd = cursorPos + match.index;
      } else {
        match = lastcharRegx.exec(cur.substring(0, cursorPos));

        // Else set the waypoint index to the index of the last word character
        // in the previous substring
        waypointInd = (!match ? 0 : match.index - 1);
      }
    } else {

      // If the character at the cursor position is a word character, set the
      // waypoint index to the cursor position
      waypointInd = cursorPos;
    }

    return cur.substring(0, waypointInd) + waypoint + cur.substring(waypointInd); 
  },

  // Allows users to indent using the 'tab' key
  _preventTabFocus: function(e) {

    if (e.keyCode === 9) {
        e.preventDefault();

        // get caret position/selection
        var input = document.querySelector('#JOT-CONTENT'),
            start = input.selectionStart,
            end   = input.selectionEnd,
            val   = $(input).val();

        // Set textarea value to: text before caret + tab + text after caret
        $(input).val(val.substring(0, start) + "\t" + val.substring(end));

        // Move the caret to the correct position and add +1 for the tab
        input.selectionStart = input.selectionEnd = start + 1;
    }
  },

  // Requests the pdf generation from the server and downloads the resulting file
  download: function(e) {
    var id  = this.model.get('id'),
        url = 'api/jots/' + id + '/download';
    $.fileDownload(url);
  }
});