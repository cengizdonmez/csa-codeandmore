import { TreeList } from '@/pages/MenuList';
import { Card, Col, Input, Row, Spin, Tree } from 'antd';
import React, { ReactElement, useState, useEffect } from 'react';
import { arrayMove, SortableElement, SortableContainer } from 'react-sortable-hoc';

interface Props {}

function TreeAndSort({ list, onChange, loading, defaultValue }: any): ReactElement {
  const [sortableItems, setSortableItems] = useState<any[]>(defaultValue || []);
  const [_isMounted, _setMounted] = useState<boolean>(false);
  console.log({defaultValue, sortableItems});

  useEffect(() => {
    if (!_isMounted) {
      _setMounted(true);
    } else {
      onChange(sortableItems);
    }
  }, [sortableItems]);

  return (
    <div>
      <Row gutter={12}>
        <Col md={12}>
          <Card style={{ height: 400 }}>
            {!loading && (
              <TreeList
                list={list}
                onChange={(data: any[]) => {
                  setSortableItems([]);
                  data.forEach((item) => {
                    const _doctor = list.find((_item) => _item.id === item);
                    if (_doctor) {
                      setSortableItems((_sortableDoctors) => [..._sortableDoctors, _doctor]);
                    }
                  });
                }}
                checkedKeys={sortableItems.filter((_item) => !!_item).map((_item) => _item.id)}
              />
            )}
            {loading && <Spin />}
          </Card>
        </Col>
        <Col md={12}>
          <Card style={{ maxHeight: 500, overflowY: 'scroll' }}>
            {sortableItems.length === 0 && <h4>Veri Seçilmedi</h4>}
            <SortableList
              items={sortableItems}
              onSortEnd={({ oldIndex, newIndex }) => {
                setSortableItems((_sortableItems) => arrayMove(_sortableItems, oldIndex, newIndex));
              }}
              onChangeItem={(oldIndex, newIndex) => {
                setSortableItems((_sortableItems) => arrayMove(_sortableItems, oldIndex, newIndex));
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TreeAndSort;

const SortableItem = SortableElement(({ value, valIndex, onChangeItem }) => {
  const [data, setData] = useState(valIndex);

  return (
    <div
      style={{
        padding: 10,
        border: '1px solid lightgrey',
        borderRadius: 2,
        marginBottom: 2,
        cursor: 'grab',
        background: 'white',
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <span>{value.name}</span>

      <div>
        <Input
          type="number"
          value={data}
          onChange={({ currentTarget: { value } }) => {
            setData(value);
          }}
          onBlur={(e) => {
            onChangeItem(valIndex, parseInt(e.currentTarget.value));
            setData(valIndex);
          }}
          style={{ width: 70 }}
        />
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ items, onChangeItem }) => {
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          valIndex={index}
          value={value}
          onChangeItem={onChangeItem}
        />
      ))}
    </div>
  );
});
