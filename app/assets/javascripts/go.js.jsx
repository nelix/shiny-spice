/** @jsx React.DOM */
var stores = {
  ColumnStore: new ColumnStore(),
  TaskStore: new TaskStore(),
};

var flux = new Fluxxor.Flux(stores, ColumnActions);

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var i = 0;

function addSomeItems() {
  flux.actions.addItem({text:prompt(), id: i++, columnId: 0});
}
addSomeItems();
addSomeItems();

function buildTest(data) {
  return <TestBox key={data.id} text={data.text}/>;
}

function go() {
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
    return flux.store('ColumnStore').getState();
  },

  render: function() {
    return (
      <Boardie  columns={columns} items={items} itemBuilder={buildTest}/> ||
      <div>
        <form onSubmit={this.handleSubmitForm}>
          <input ref="input" type="text" size="30" placeholder="New Item" />
          <input type="submit" value="Add Item" />
        </form>
      </div>
    );
  },

  handleSubmitForm: function(e) {
    e.preventDefault();
    var node = this.refs.input.getDOMNode();
    this.getFlux().actions.addItem(node.value);
    node.value = '';
  }
});
