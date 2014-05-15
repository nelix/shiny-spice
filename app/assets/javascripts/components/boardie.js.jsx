/** @jsx React.DOM */
// https://twitter.com/mollyclare/status/462831500497391616

function find(needle, haystack, attr) {
  attr = attr || 'id';

  return (haystack || []).filter(
    function(hay) {
      return (needle === hay[attr]);
    }
  )[0];
}

function findIndex(needle, haystack, attr) {
  attr = attr || 'id';
  var index;

  (haystack || []).forEach(
    function(hay, ind) {
      if (needle === hay[attr]) index = ind;
    }
  );

  return index;
}

function mouseOverBottomHalf(e, rect) {
  var clientYRel = e.pageY - rect.top;
  var isTop = (clientYRel <  rect.height/2);
  return !isTop;
}

function mouseOverRightHalf(e, rect) {
  var clientXRel = e.pageX - rect.left;
  var isLeft = (clientXRel <  rect.width/2);
  return !isLeft;
}

var StackieRectKeeperMixin = {
  childRects: {},
  getInitialState: function() {
    return {dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null, dragging: false};
  },

  handleBoardieMove: function(columnId, taskKey, mouseEvent) {
    if (document.msElementsFromPoint) {
      var underlyingNodeList = document.msElementsFromPoint(mouseEvent.pageX, mouseEvent.pageY);
      
      var hitOne = false;
      if (underlyingNodeList && underlyingNodeList[3].className == 'testbox') {
        //underlyingNodeList[3].style.background = 'red';

        console.log(underlyingNodeList[4].className)
        
        $(underlyingNodeList[4]).trigger('mouseover');
        //$(underlyingNodeList[1], underlyingNodeList[2]).css('display', 'block');
        //for (var i = 0; i < underlyingNodeList.length; i++) {
          //if (underlyingNodeList[i].className == 'testbox') {
            

          /*
            if (!hitOne) {

              underlyingNodeList[i].style.display = 'none';
              
              
              underlyingNodeListTwo = document.msElementsFromPoint(mouseEvent.pageX, mouseEvent.pageY);

              for (var k = 0; k < underlyingNodeListTwo.length; k++) {
                if (underlyingNodeListTwo[k].className == 'testbox') {
                  elem = underlyingNodeListTwo[k];
                  console.log('hit')
                  setTimeout(function() {
                    console.log('yes')
                    underlyingNodeListTwo[0].style.display = 'block'; 
                    underlyingNodeListTwo[1].style.display = 'block'; 
                    underlyingNodeListTwo[2].style.display = 'block'; 
                    underlyingNodeListTwo[3].style.display = 'block'; 
                    underlyingNodeListTwo[4].style.display = 'block'; 
                    hitOne = false 
                  }.bind(this,elem), 10)

                }
              }

              


              

              hitOne = true;
            }*/
          //}
        //}
      }


    }

    this.props.onGrabOver && this.props.onGrabOver(this.state);
  },

  handleBoardieHover: function(columnKey, taskKey, position, mouseEvent) {
    this.rectHover = true;
    var targetBoundingRect = mouseEvent.target.getBoundingClientRect();

    mouseOverBottomHalf(mouseEvent, targetBoundingRect) && position++
    this.setState({overItemKey: taskKey, overColumnKey: columnKey, overItemPosition: position});
  },

  handleGrab: function(columnKey, taskKey, position, width, height) {
    this.setState({dragItemKey: taskKey, overItemPosition: position, overColumnKey: columnKey, dragItemWidth: width, dragItemHeight: height});
    this.setState({dragging: true});
  },

  handleDrop: function(key) {
    this.setState({dragging: false});

    if (this.state.dragItemKey !== false && this.state.overItemPosition !== false &&
        this.state.overColumnKey !== false && this.state.overItemPosition !== null) {

      this.handleSort(this.state.dragItemKey, this.state.overItemPosition, this.state.overColumnKey);
    }

    this.setState({dragItemKey: null, overItemKey: null, overItemPosition: null, overColumnKey: null});
  },
};


var Boardie = React.createClass({

  mixins: [StackieRectKeeperMixin],

  getInitialState: function() {
    return {dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0}
  },

  getItems: function(ids) {
    return ids.map(
      function(id) {
        var item = find(id, this.props.items)
        return this.props.itemBuilder ? this.props.itemBuilder(item) : item;
      },this
    );
  },

  handleSort: function(itemId, position, columnId) {
    var columns = this.props.columns;

    var fromColumn;
    var fromPosition;

    if (position >= 0) {

      columns.forEach(
        function(column) {
          if (column.items.indexOf(itemId) !== -1) {
            fromColumn = column;
            fromPosition = column.items.indexOf(itemId);
            column.items.splice(column.items.indexOf(itemId), 1);
          }
        }
      );

      if ((fromColumn.id === columnId) && (fromPosition < position) ) {
        position--;
      }
      var columnIndex = findIndex(columnId, columns);
      var newColItems = columns[columnIndex].items;
      newColItems.splice(position, 0, itemId);

      this.setProps({columns: columns});
    }
  },

  handleColumnHover: function(columnKey, mouseEvent) {
    var position = columnKey;
    mouseOverRightHalf(mouseEvent, mouseEvent.target.getBoundingClientRect()) && position++;
    this.setState({overColumnPosition: position});
  },

  handleColumnGrab: function(key, position, width, height) {
    this.setState({dragColumnKey: key, overColumnPosition: position, dragColumnWidth: width, dragColumnHeight: height});
  },

  handleColumnRelease: function() {
    this.setState({dragColumnKey: null, overColumnPosition: null, dragColumnWidth: 0, dragColumnHeight: 0});
  },

  columnRects: {},

  handleColumnRect: function(component, rect) {
    this.columnRects[component.props.key] = {component: component, rect: rect, columnKey: component.props.key};
  },

  buildColumn: function(column, i) {
    var items = this.getItems(column.items);
    var column =
      <Grabbable
          className="sortie-column"
          position={i}
          key={column.id}
          onGrabieLongGrab={this.handleColumnGrab.bind(null, column.id)}
          onGrabieDragRelease={this.handleColumnRelease.bind(null, column.id)}
          onMouseMove={this.handleColumnHover.bind(null, i)}
          onMouseOut={this.handleColumnLeave}
          onRect={this.handleColumnRect}>
        <Stackable
            overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition}
            placeholderStyle={{height: this.state.dragItemHeight, width: this.state.dragItemWidth}}
            overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id}
            onGrabieDragRelease={this.handleDrop}
            onGrabieLongGrab={this.handleGrab.bind(null, column.id)}
            onGrabieMove={this.handleBoardieMove.bind(null, column.id)}
            onGrabieHover={this.handleBoardieHover.bind(null, column.id)}
            dragging={this.state.dragging}
            onRect={this.handleRect}>
          {items}
        </Stackable>
      </Grabbable>

    return column;
  },

  render: function() {
    var columns = this.props.columns.map(this.buildColumn, this);

    if (this.state.overColumnPosition !== null) {
      columns.splice(this.state.overColumnPosition, 0,
        <span style={{width: this.state.dragColumnWidth, height: this.state.dragColumnHeight}} className="grabbie-placeholder-sortie-column" key={'gap'}></span>
      );
    }
    return (
      <div className="boardie cf">
        {columns}
      </div>
    );
  }
});
