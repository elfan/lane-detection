import './App.scss';

import { useDebounce } from './useDebounce';
import React, { useEffect,useState } from 'react';
import { Params } from './types';
import GaussianControl from './GaussianControl';
import CannyControl from './CannyControl';
import HoughControl from './HoughControl';

const App = () => {
  const imgCount = 6;
  const imgUrl = '//' + window.location.hostname + '/laneapi/lane.php';

  const defaultParams: Params = {
    y: true,
    g: 11,
    l: 100,
    h: 150,
    v: 50,
    w: 20,
    r: 3,
    t: 2,
    d: 36,
    n: 34,
    x: 82,
    z: true,
  }

  type AllowedParam = keyof typeof defaultParams;

  type StageParams = Array<AllowedParam>;

  const stages: Array<StageParams> = [
    [],
    ['y'],
    ['g'],
    ['g', 'l', 'h'],
    ['g', 'l', 'h', 'v', 'w'],
    ['g', 'l', 'h', 'v', 'w', 'r', 't', 'd', 'n', 'x'],
    ['g', 'l', 'h', 'v', 'w', 'r', 't', 'd', 'n', 'x', 'z'],
  ];

  const stageNames: Array<string> = [
    'Original',
    'Grayscale',
    'Gaussian',
    'Canny',
    'Region',
    'Hough',
    'Result'
  ];

  type StageShow = Array<boolean>;

  const [stageShow, setStageShow] = useState<StageShow>([true, true, true, true, true, true, true]);

  const updateStageShow = (stageIdx: number, checked: boolean) => {
    const show: StageShow = [...stageShow];
    show[stageIdx] = checked;
    setStageShow(show);
  }

  const [params, setParams] = useDebounce({...defaultParams}, 500);
  const [displayParams, setDisplayParams] = useState({...defaultParams});
  const [isAllImagesShown, setIsAllImagesShown] = useState(false);
  const [selectedImages, setSelectedImages] = useState([0]);

  const changeParamValues = (newParams: Params) => {
    setDisplayParams(Object.assign({}, displayParams, newParams));
    setParams(Object.assign({}, params, newParams));
  }

  const toggleSelectImage = (imgIdx: number) => {
    setSelectedImages((currSelected) => {
      if (currSelected.includes(imgIdx)) {
        return currSelected.filter(v => v !== imgIdx);
      }
      return [...currSelected, imgIdx];
    });
  }

  useEffect(() => {
    //logger('Testing monorepo!');
  }, []);

  return (
    <div className="App">
      <h1>Computer Vision: Lane Detection</h1>
      <div style={{display: 'flex', margin: 'auto', width: 750}}>
        Show
        {
          stageNames.map((name: string, stageIdx: number) => (
            <div key={stageIdx} style={{width: 120}}>
              <label>
                <input
                  type="checkbox"
                  checked={stageShow[stageIdx]}
                  onChange={evt => updateStageShow(stageIdx, evt.target.checked)}
                />
                {name}
              </label>
            </div>
          ))
        }
      </div>

      { 1 && <GaussianControl displayParams={displayParams} changeParamValues={changeParamValues} /> }
      { 1 && <CannyControl displayParams={displayParams} changeParamValues={changeParamValues} /> }
      { 1 && <HoughControl displayParams={displayParams} changeParamValues={changeParamValues} /> }

      <table className="screen-table" style={{marginTop: 20}}>
        <tbody>
          <tr>
          {
            stageNames.map((name: string, stageIdx: number) => (
              stageShow[stageIdx] && (
                <th key={stageIdx}>
                  {
                    stageIdx === 0 ? (
                      <>
                        {name}
                        <button
                          type="button"
                          style={{marginLeft: 10, cursor: 'pointer'}}
                          onClick={() => setIsAllImagesShown(!isAllImagesShown)}
                        >
                          <div className={`chevron ${isAllImagesShown ? 'down' : ''}`}></div>
                          Choose Images ({selectedImages.length})
                        </button>
                      </>
                    ) :
                    stageIdx === 2 ? `${name} blur ${displayParams.g}` :
                    stageIdx === 3 ? `${name} ${displayParams.l}-${displayParams.h}` :
                    name
                  }
                </th>
              )
            ))
          }
          </tr>
          {
            Array.from(Array(imgCount).keys()).map((i: number) => (
              (isAllImagesShown || selectedImages.includes(i)) &&
              <tr key={i}>
                {
                  stages.map((stageParams: StageParams, stageIdx: number) => {
                    const paramStr = stageParams
                      .map((k: AllowedParam) => {
                        return '&' + k + (params[k] === true ? '' : '=' + params[k]);
                      })
                      .join('');

                    return stageShow[stageIdx] && (stageIdx === 0 || selectedImages.includes(i)) && (
                      <td key={stageIdx} className={isAllImagesShown ? 'show-all-images': 'show-selected-images'}>
                        <label>
                          {stageIdx === 0 && (
                            <>
                              <div className="img-number">{i + 1}</div>
                              {
                                isAllImagesShown &&
                                <div className={`img-select ${selectedImages.includes(i) ? 'selected': ''}`}>
                                  <input
                                    type="checkbox"
                                    onChange={() => toggleSelectImage(i)}
                                    checked={selectedImages.includes(i)}
                                  />
                                </div>
                              }
                            </>
                          )}
                          <img className="screen" src={`${imgUrl}?i=${i}${paramStr}`} title={`Stage ${stageIdx} of Case ${i+1}`} />
                        </label>
                      </td>
                    )
                  })
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
