/** @jsx React.DOM */
var stores = {
  ColumnStore: new ColumnStore()
};

var flux = new Fluxxor.Flux(stores, ColumnActions);

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var columns = [
  {id: 2, title: 'hats', items: [4, 5, 6]},
  {id: 3, title: 'fake hats', items: [9, 10]},
  {id: 4, title: 'I dunno, crabs?', items: [24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35]}
];

var items = [
  {id: 4, text: 'Fedora'},
  {id: 5, text: 'Pork Pie'},
  {id: 6, text: 'Bowler'},

  {id: 9, text: 'Panama'},
  {id: 10, text: 'A snake? I dunno.'},

  {id: 14, text: 'Cat skin'},
  {id: 15, text: 'Rabit Skin'},
  {id: 17, text: 'Rabit Skin'},
  {id: 18, text: 'Rabit Skin'},
  {id: 16, text: 'Space needle?'},

  {id: 24, text: 'Cat skin2'},
  {id: 25, text: 'Rabit Skin2'},
  {id: 27, text: 'Rabit Skin2'},
  {id: 28, text: 'Rabit Skin2'},
  {id: 29, text: 'Rabit Skin2'},
  {id: 30, text: 'Rabit Skin2'},
  {id: 31, text: 'Rabit Skin2'},
  {id: 32, text: 'Rabit Skin2'},
  {id: 33, text: 'Rabit Skin2'},
  {id: 34, text: 'Rabit Skin2'},
  {id: 35, text: 'Space needle@?'}
];

for (var i=36; i< 200; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[0].items.push(i);
}

for (var i=201; i< 400; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[1].items.push(i);
}

for (var i=401; i< 601; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[2].items.push(i);
}

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
