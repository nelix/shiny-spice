/** @jsx React.DOM */
var stores = {
  ColumnStore: new ColumnStore(),
  TaskStore: new TaskStore(),
  ColumnHeightStore: new ColumnHeightStore(),
};

var flux = new Fluxxor.Flux(stores, ColumnActions);

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ii = 0;

function addSomeItems() {
  flux.actions.addColumn(0, "column 1");
  setTimeout(flux.actions.addColumn.bind(1, "column 2"),1);
  //setTimeout(flux.actions.addColumn.bind(2, "column 3"), 2);
  //setTimeout(flux.actions.addItem.bind("a task", i++, 0),3);
}



function buildTest(data) {
  return <TestBox key={data.id} text={data.text}/>;
}

function go() {
  addSomeItems();
React.renderComponent(
 <Application flux={flux}/>,
  document.body);
}


var Application = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('ColumnStore')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    // Normally we'd use one key per store, but we only have one store, so
    // we'll use the state of the store as our entire state here.
    return {"columnHashes": flux.store('ColumnHeightStore').getState(),"columns": flux.store('ColumnStore').getState(), items: flux.store('TaskStore').getState()};
  },

  render: function() {
    return (
      <div style={{height: "100%"}}>
      <form onSubmit={this.handleSubmitForm}>
        <input ref="input" type="text" size="30" placeholder="New Item" />
        <input type="submit" value="Add Item" />
      </form>
      <Boardie onSort={this.handleSort} columnHashes={this.state.columnHashes} columns={this.state.columns} items={this.state.items} itemBuilder={buildTest}/>
      </div>
    );
  },

  handleSort: function(item, position, column) {
    //debugger
    this.getFlux().actions.moveItem(item, position, column)
  },

  handleSubmitForm: function(e) {
    e.preventDefault();
    var node = this.refs.input.getDOMNode();
    this.getFlux().actions.addItem(node.value, ii++, 0);
    node.value = '';
  }
});
