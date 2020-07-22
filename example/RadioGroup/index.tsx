import React from 'react';
import './styles.less';

export interface RadioGroupProps {
  name: string;
  value: any;
  setValue: (param: any) => void;
  dataList: any[];
}

const RadioGroup = ({ name, value, setValue, dataList }: RadioGroupProps) => (
  <div className="render-radio">
    {name}:
    {dataList.map((item) => (
      <span
        key={`${item}`}
        className={`radio ${value === item ? 'checked' : ''}`}
        onClick={() => setValue(item)}
      >
        {`${item}`}
      </span>
    ))}
  </div>
);

export default RadioGroup;
