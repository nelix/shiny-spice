/** @jsx React.DOM */

var columns = [
  {id: 2, title: 'hats', items: [4, 5, 6]},
  {id: 3, title: 'fake hats', items: [9, 10]}
];

var items = [
  {id: 4, text: 'Fedora'},
  {id: 5, text: 'Pork Pie'},
  {id: 6, text: 'Bowler'},

  {id: 9, text: 'Panama'},
  {id: 10, text: 'A snake? I dunno.'}
];

function buildTest(data) {
  return <TestBox key={data.id} text={data.text}/>;
}

function log() {
  console.log(arguments[0])
}

function go() {
React.renderComponent(
 <Boardie onGrabOver={log} columns={columns} items={items} itemBuilder={buildTest}/>,
  document.body);
}
