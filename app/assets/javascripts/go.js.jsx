/** @jsx React.DOM */

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

for (var i=36; i< 100; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[0].items.push(i);
}

for (var i=101; i< 200; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[1].items.push(i);
}

for (var i=201; i< 201; i++) {
  items.push({id: i, text: 'test item' + i});
  columns[2].items.push(i);
}

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
