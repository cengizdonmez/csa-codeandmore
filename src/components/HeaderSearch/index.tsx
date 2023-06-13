import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import useMergeValue from 'use-merge-value';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import React, { useRef } from 'react';

import classNames from 'classnames';
import styles from './index.less';

export interface HeaderSearchProps {
  onSearch?: (value?: string) => void;
  onChange?: (value?: string) => void;
  onVisibleChange?: (b: boolean) => void;
  className?: string;
  placeholder?: string;
  options: AutoCompleteProps['options'];
  defaultOpen?: boolean;
  open?: boolean;
  defaultValue?: string;
  value?: string;
}

const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const {
    className,
    defaultValue,
    onVisibleChange,
    placeholder,
    open,
    defaultOpen,
    ...restProps
  } = props;

  const inputRef = useRef<Input | null>(null);

  const [value, setValue] = useMergeValue<string | undefined>(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });

  const [searchMode, setSearchMode] = useMergeValue(defaultOpen || false, {
    value: props.open,
    onChange: onVisibleChange,
  });

  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });

  return null;


};

export default HeaderSearch;
