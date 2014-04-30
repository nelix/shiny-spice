/** @jsx React.DOM */

var columns = [
  {id: 2, title: 'hats', items: [4, 5, 6]},
  {id: 3, title: 'fake hats', items: [9, 10]},
  {id: 4, title: 'I dunno, crabs?', items: [14, 15, 16, 17, 18]}
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
  {id: 16, text: 'Space needle?'}
];

function buildTest(data) {
  return <TestBox key={data.id} text={data.text}/>;
}

function go2() {
  React.renderComponent(<DragieOverlay />, document.body);
}
function go() {
React.renderComponent(
 <Boardie  columns={columns} items={items} itemBuilder={buildTest}/>,
  document.body);
}
