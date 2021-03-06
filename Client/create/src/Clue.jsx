'use strict';
/* jshint quotmark: false */

var React = require('react');
var Actions = require('../RefluxActions');


module.exports = React.createClass({
  getInitialState: function() {
    return {
      editMode: false,
    };
  },
  toggleEdit: function() {
    if (this.state.editMode) {
      var editedClue = this.refs.clueEdit.getDOMNode().value;
      Actions.updateClue(editedClue, this.props.pinIndex, this.props.clueIndex);
      this.setState({editMode: false});
    } else {
      this.setState({editMode: true});
    }
  },
  deleteClue: function() {
    Actions.removeClue(this.props.pinIndex, this.props.clueIndex);
  },
  render: function() {
    var editBtn;
    var text;
    if (this.state.editMode) {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Save</button>);
      text = (<textarea cols="35" ref="clueEdit" defaultValue={this.props.clue}/>);
    } else {
      editBtn = (<a onClick={this.toggleEdit}>Edit</a>);
      text = this.props.clue;
    }
    return (
      <div className="clueDetails">
        <div className="row">
          <div className="col-xs-2">
            Clue {this.props.clueIndex + 1}:
          </div>
          <div className="col-xs-6">
          {text}
          </div>
          <div className="col-xs-4"> 
            {editBtn}
            <a clickHandler={this.deleteClue}>Delete</a>
          </div>
        </div>
      </div>
    );
  }
});
