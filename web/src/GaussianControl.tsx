import React from 'react';
import { Params } from './types';

const GaussianControl = (props: any) => {
  const { displayParams, changeParamValues } = props;
  return (
    <>
      <div style={{marginTop: 10}}>
        <div className="control-label">
          Gaussian blur
        </div>
        <div className="control-value">
          {displayParams.g}
        </div>
        <input
          type="range"
          value={displayParams.g}
          min="1"
          max="19"
          step="2"
          onChange={evt => changeParamValues({g: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
      </div>
    </>
  )
}

export default GaussianControl;
