import React from 'react';
import ReactNestable from 'react-nestable';

function Nestable({items, renderItem, onChange, maxDepth}) {
  return <ReactNestable items={items} renderItem={renderItem} maxDepth={maxDepth} onChange={onChange} />;
}

export default Nestable;
