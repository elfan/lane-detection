import React from 'react';
import { Params } from './types';

const HoughControl = (props: any) => {
  const { displayParams, changeParamValues } = props;
  return (
    <>
      <div style={{marginTop: 10}}>
        <div className="control-label">
          Hough rho
        </div>
        <div className="control-value">
          {displayParams.r}
        </div>
        <input
          type="range"
          value={displayParams.r}
          min="1"
          max="10"
          onChange={evt => changeParamValues({r: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
        <br />

        <div className="control-label">
          Hough theta
        </div>
        <div className="control-value">
          {displayParams.t}
        </div>
        <input
          type="range"
          value={displayParams.t}
          min="0"
          max="10"
          onChange={evt => changeParamValues({t: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
        <br />

        <div className="control-label">
          Hough threshold
        </div>
        <div className="control-value">
          {displayParams.d}
        </div>
        <input
          type="range"
          value={displayParams.d}
          min="0"
          max="100"
          onChange={evt => changeParamValues({d: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
        <br />

        <div className="control-label">
          Hough min length
        </div>
        <div className="control-value">
          {displayParams.n}
        </div>
        <input
          type="range"
          value={displayParams.n}
          min="0"
          max="300"
          onChange={evt => changeParamValues({n: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
        <br />

        <div className="control-label">
          Hough max gap
        </div>
        <div className="control-value">
          {displayParams.x}
        </div>
        <input
          type="range"
          value={displayParams.x}
          min="0"
          max="300"
          onChange={evt => changeParamValues({x: evt.target.value})}
          style={{width: 200, verticalAlign: 'bottom'}}
        />
      </div>
    </>
  )
}

export default HoughControl;
