import React from 'react';
import './styles.less';

export interface RadioGroupProps extends React.HTMLAttributes<string> {
  name: string;
  value: any;
  setValue: (param: any) => void;
  dataList: any[];
}

const RadioGroup = ({
  name,
  value,
  setValue,
  dataList,
  className,
}: RadioGroupProps) => (
  <div className={`render-radio ${className}`}>
    {name}:
    {dataList.map((item) => (
      <span
        key={`${item}`}
        item-value={item}
        className={`radio ${value === item ? 'checked' : ''}`}
        onClick={() => setValue(item)}
      >
        {`${item}`}
      </span>
    ))}
  </div>
);

export default RadioGroup;
