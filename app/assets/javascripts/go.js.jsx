/** @jsx React.DOM */

var columns = [
  {id: 2, title: 'hats', items: [4, 5, 6, 7, 8]},
  {id: 3, title: 'fake hats', items: [9, 10]}

  {id: 2, title: 'hats', items: [4, 5, 6]},
  {id: 3, title: 'fake hats', items: [9, 10]},
  {id: 4, title: 'I dunno, crabs?', items: [14, 15, 16]}
  {id: 14, text: 'Cat skin'},
  {id: 15, text: 'Rabit Skin'},
  {id: 16, text: 'Space needle?'}
];

var items = [
  {id: 4, text: 'Fedora'},
  {id: 5, text: 'Pork Pie'},
  {id: 6, text: 'Bowler'},
  {id: 7, text: 'Snap back'},
  {id: 8, text: 'Flat brim'},

  {id: 9, text: 'Panama'},
  {id: 10, text: 'A snake? I dunno.'},

  mixins: [StackieRectKeeperMixin],

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

    columns.forEach(
      function(column) {
        if (column.items.indexOf(itemId) !== -1) {
          column.items.splice(column.items.indexOf(itemId), 1);
        }
      }
    );

    var columnIndex = findIndex(columnId, columns);
    var newColItems = columns[columnIndex].items;

    newColItems.splice(position, 0, itemId);

    this.setProps({columns: columns});
  },

  as: function() {
    return <span>asdf</span>;
  },

  buildColumn: function(column) {
    var items = this.getItems(column.items);
    var column = <Stackable overItemPosition={this.state.overColumnKey === column.id && this.state.overItemPosition} overItemKey={this.state.overColumnKey === column.id && this.state.overItemKey} key={column.id} onDrop={this.handleDrop} onGrab={this.handleGrab.bind(null, column.id)} onRect={this.handleRect}>{items}</Stackable>;
    return column.attachScrollie(column);
  },

  render: function() {
    var columns = this.props.columns.map(this.buildColumn, this);
    return (
      <div className="boardie cf">
        {columns}
      </div>
    );
  }
});

function buildTest(data) {
  return <TestBox key={data.id} text={data.text}/>;
}

function go() {
React.renderComponent(
 <Boardie  columns={columns} items={items} itemBuilder={buildTest}/>,
  document.body);
}
