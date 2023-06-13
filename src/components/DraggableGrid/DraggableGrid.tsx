import React, {useRef} from 'react';
import {createDndContext, DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import ProTable from '@ant-design/pro-table';
import {ProTableProps} from "@ant-design/pro-table/lib/Table";
import {ProCoreActionType} from "@ant-design/pro-utils";

const RNDContext = createDndContext(HTML5Backend);

const type = 'DragableBodyRow';

const DragableBodyRow = ({index, moveRow, className, style, ...restProps}: any) => {
  const ref = React.useRef(null);
  const [{isOver, dropClassName}, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const {index: dragIndex} = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: {type, index},
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{cursor: 'move', ...style}}
      {...restProps}
    />
  );
};
const components = {
  body: {
    row: DragableBodyRow,
  },
};

interface DragSortingTableProps<T, U extends { [key: string]: any }> extends ProTableProps<T, U> {
  updateItem: (item: T) => Promise<void>
}

const DragSortingTable = <T, U extends { [key: string]: any } = {}>(props: DragSortingTableProps<T, U>) => {
  const manager = useRef(RNDContext);
  const actionRef = useRef<ProCoreActionType>(null);

  const moveRow: any = async (dragIndex, hoverIndex) => {
    if (!actionRef.current) {
      return null;
    }


    // @ts-ignore
    const dataSource: any = actionRef.current.getDataSource();


    const newDataSource = dataSource.reverse();
    if (dragIndex > hoverIndex) {
      const dragRow: T = newDataSource[dragIndex];
      dragRow.order = hoverIndex + 1;
      props.updateItem(dragRow).then(() => null);
      for (let i = hoverIndex; i < dragIndex; i += 1) {
        const hoverRow: T = newDataSource[i];
        hoverRow.order += 1;
        props.updateItem(hoverRow).then(() => null);
      }
    } else {
      const dragRow = newDataSource[dragIndex];
      dragRow.order = hoverIndex + 1;
      props.updateItem(dragRow).then(() => null);
      for (let i: number = hoverIndex; i > dragIndex; i -= 1) {
        const hoverRow = newDataSource[i];
        hoverRow.order -= 1;
        props.updateItem(hoverRow).then(() => null);
      }
    }
    // @ts-ignore
    actionRef.current.setDataSource(
      JSON.parse(JSON.stringify(newDataSource.sort((a: any, b: any) => a.order - b.order).reverse())));

  }
  // @ts-ignore
  return <DndProvider manager={manager.current.dragDropManager}>
    <ProTable<T, U> options={{density: false}}
                    {...props} actionRef={actionRef} components={components} onRow={(record: T, index: any): any => ({
      index,
      moveRow,
    })}
    />
  </DndProvider>
}
export default DragSortingTable;
