import React from 'react';
import ReactGridLayout from 'react-grid-layout'

import Card from '../../components/CookbookCard';

var layout = [
  {i: 'Card', x: 0, y: 0, w:1, h:1}
];

class CookbookList extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <ReactGridLayout className='layout' cols={12} rowHeight={30} width={800}>
        <Card key={'Card'}/>
      </ReactGridLayout>
    );
  }
}

export default CookbookList;
