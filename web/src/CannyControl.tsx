import React from 'react';
import { Params } from './types';

const CannyControl = (props: any) => {
  const { displayParams, changeParamValues } = props;
  return (
    <>
      <div style={{marginTop: 10}}>
        <div className="control-label">
          Canny low
        </div>
        <div className="control-value">
          {displayParams.l}
        </div>
        <input
          type="range"
          value={displayParams.l}
          min="0"
          max="300"
          onChange={evt => changeParamValues({l: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
        <br />

        <div className="control-label">
          Canny high
        </div>
        <div className="control-value">
          {displayParams.h}
        </div>
        <input
          type="range"
          value={displayParams.h}
          min="0"
          max="300"
          onChange={evt => changeParamValues({h: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
      </div>
    </>
  )
}

export default CannyControl;
