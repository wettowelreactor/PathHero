'use strict';
/* jshint quotmark: false */
/* jshint expr: true */
/* jshint latedef: false */

// Aliasing for shorthand reference
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;

var HuntBox = React.createClass({
  getInitialState: function() {
    return {data: pins};
  },
  render: function() {
    return (
      <div className="huntBox">
        <HuntMap />
        <ClueBox data={this.state.data} />
      </div>
    );
  }
});

var HuntMap = React.createClass({
  render: function() {
    return (
      <div id="gMap" className="col-xs-6">
      </div>  
    );
  }
});

var ClueBox = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      editBoxMode: false,
      title: 'Discover SFs most beautiful views',
      desc: 'Dummy description'
    };
  },
  componentDidMount: function() {
    gMap.addEventListener('addMarker', function() {
      var pin = {
        "desc": "",
        "answer": "",
        "clues": [],
        "geo": [37.8181, 122.3467]
      };
      this.props.data.push(pin);
      this.setState({data: this.props.data});
    }.bind(this));
  },
  inputTitle: function(e) {
    this.setState({title: e.target.value});
  },
  toggleEditTitle: function() {
    var newTitle;
    if (this.state.editTitleMode) {
      newTitle = this.refs.titleEdit.getDOMNode().value;
      console.log(newTitle);
      this.setState({title: newTitle, editTitleMode: false});
    } else {
      this.setState({editTitleMode: true});
    }
  },
  render: function() {
    var title;
    var titleBtn;
    if (this.state.editTitleMode) {
      title = (<input id="hunt-title" ref="titleEdit"
                  defaultValue={this.state.title} 
                  onChange={this.handleInput} />);
      titleBtn = (<Btn label={"Save"} clickHandler={this.toggleEditTitle} />);
    } else {
      title = (<span id="hunt-title">{this.state.title}</span>);
      titleBtn = (<Btn label={"Edit title"} clickHandler={this.toggleEditTitle} />);
    }
    return (
      <div>
        <div id="hunt-info-container" className="col-xs-6">
          <div id="hunt-title-container">
            <h2>Hunt Title</h2>
              {title}
              {titleBtn}
            <div className="tour-summary-container">
              <h2>Tour Summary</h2>
              <div className="summary-box">
                <p>Description: [Insert description]</p>
                <p>Duration: 2 hours</p>
                <p>Distance: 2.8 miles</p>
                <p>Locations: {this.props.data.length}</p>              
              </div>
            <HuntSubmitForm clues={this.state.data} 
                            name={this.state.title} 
                            desc={this.state.desc} />
            </div>
          </div>
          <div id="pin-container">
            <h2>Pins</h2>
            <PinList data={this.props.data} /> 
          </div>
        </div>
      </div>
    );
  }
});

var HuntSubmitForm = React.createClass({
  handleSubmit: function() {
    var newHunt = {
      name: this.props.title,
      desc: this.props.desc,
      clues: this.props.clues,
      createrId: 1
    };

    newHunt = JSON.stringify(newHunt);
    $.ajax({
      url: 'http://create.wettowelreactor.com:3000/create',
      type: 'POST',
      contentType: 'json',
      data: newHunt,
      success: function(returndata) {
        console.log('success!', returndata);
      }
    });
  },
  render: function() {
    console.log(this.props.hunt);
    return (
      <Btn label={"Submit hunt"} clickHandler={this.handleSubmit} />
    );
  }
});

var PinList = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      locations: this.props.data
    };
  },
  componentDidMount: function() {
    console.log(this.state.data);
  },
  render: function() {
    var pinNodes = this.props.data.map(function(pin, index, data) {
      return (
        <Pin  data={data} index={index} answer={pin.answer} 
          clues={pin.clues} key={index}>
        </Pin>
      );
    });
    return (
      <div className="pinList">
        {pinNodes}
      </div>
    );
  }
});

var Pin = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      clues: this.props.clues,
      editLocationMode: false,
      location: this.props.answer
    };
  },
  handleClue: function() {
    var newClue = this.refs.clueInput.getDOMNode().value;
    this.props.clues.push(newClue);
    this.setState({clues: this.props.clues});
    React.findDOMNode(this.refs.clueInput).value = '';
  },
  inputLocation: function(locationName) {
    if (this.state.editLocationMode) {
      this.state.data[this.props.index].answer = locationName;
      this.setState({editLocationMode: !this.state.editLocationMode, 
                      data: this.state.data});
    } else {
      this.setState({editLocationMode: !this.state.editLocationMode});
    }
  },
  deleteClue: function (index) {
    this.state.data[this.props.index].clues.splice(index, 1);
    this.setState({data: this.state.data});
  },
  render: function() {
    var index = this.props.index;
    var clueNodes = this.props.clues.map(function(clue, index) {
      return (
        <Clue data={this.state.data} parentIndex={this.props.index} index={index} 
          text={clue} key={index} editMode={this.state.editMode} 
          toggleEdit={this.toggleEdit} deleteClue={this.deleteClue} />
      );
    }.bind(this));

    return (
      <div className="pinContainer">
        <NameLocation editLocationMode={this.state.editLocationMode} 
                         answer={this.state.data[index].name} inputLocation={this.inputLocation} />
        <Accordion>
          <Panel onDoubleClick={this.nameLocation} eventKey={index}
            header={"Pin " + (index+1) + ": " +this.state.data[index].answer} >
          {clueNodes}
          <textarea col="35" row="30" ref="clueInput" />
          <Btn label={"Add Clue"} clickHandler={this.handleClue} />
          </Panel>
        </Accordion>  
      </div>
    );
  }
});

var NameLocation = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.answer
    };
  },
  inputLocation: function() {
    var locationName;
    if (this.props.editLocationMode) {
      locationName = this.refs.locationName.getDOMNode().value;
      this.props.inputLocation(locationName);
    } else {
      this.props.inputLocation();
    }
  },
  handleLocationName: function(e) {
    this.setState({location: e.target.value});
  },
  render: function() {
    var locationInput;
    if (this.props.editLocationMode) {
      locationInput = (<form><input type="text" ref="locationName" 
                          onChange={this.handleLocationName} 
                          defaultValue={this.props.answer} />
                       <Btn label={"Save"} clickHandler={this.inputLocation} /></form>);
    } else {
      locationInput = (<Btn label={"Set location name"} clickHandler={this.inputLocation} />);
    }
    return (
      (locationInput)
    );
  }
});

var Clue = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data,
      editMode: false,
      clueText: this.props.text,
      value: this.props.text
    };
  },
  toggleEdit: function() {
    if (this.state.editMode === true) {
      var editedClue = this.refs.clueEdit.getDOMNode().value;
      this.state.data[this.props.parentIndex].clues[this.props.index] = editedClue;
      this.setState({data: this.state.data, editMode: false});
    } else {
      this.setState({editMode: true});
    }
  },
  handleInput: function(e) {
    this.setState({value: e.target.value});
  },
  deleteClue: function() {
    this.props.deleteClue(this.props.index);
  },
  render: function() {
    var editBtn;
    var text;
    if (this.state.editMode) {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Save</button>);
      text = (<textarea cols="35" ref="clueEdit" defaultValue={this.props.text} 
                onChange={this.handleInput} />);
    } else {
      editBtn = (<button className="btn" onClick={this.toggleEdit}>Edit</button>);
      text = (this.props.data[this.props.parentIndex].clues[this.props.index]);
    }
    if (this.props.editMode) {

    } else {
    }
    return (
      <div className="clueDetails">
        <div className="row">
          <div className="col-xs-2">
            Clue {this.props.index+1}:
          </div>
          <div className="col-xs-6">
          {text}
          </div>
          <div className="col-xs-4"> 
            {editBtn}
            <Btn clickHandler={this.deleteClue} label={"Delete"} />
          </div>
        </div>
      </div>
    );
  }
});


var pins = [
  {
    "answer": "Bay Bridge",
    "desc": "Landmark used by commuters",
    "clues": ['Refurbished in 2013', 'Not the Golden Gate Bridge'],
    "geo": [37.8181, 122.3467]
  },
  {
    "answer": "Transamerica Building",
    "desc": "Pointed building in SF",
    "clues": ['Named after a company', 'In Financial District'],
    "geo": [37.8181, 122.3467]

  }
];

React.render(
  <HuntBox/>, document.getElementById('app-container')
  );
