import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { Elevator } from './lib/elevator';
import './lib/elevator.scss';
import {Leva, useControls} from "leva";

export type alignType = ("center" | "left" | "right" | undefined)
const App = () => {
  const search = new URLSearchParams(window.location.search);
  const isDebug = search.get('debug') === '1';
  const [maxWidth, setMaxWidth] = useState(window.innerWidth)

  useEffect(() => {
    const update = () => setMaxWidth(window.innerWidth)
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  let number = 5.5;
  let paddingTab = 0;
  let widthInPx = 728;
  let zIndex = 10;
  let align: alignType = 'center';

  if (isDebug) {
    ({ number, paddingTab, widthInPx, zIndex, align } = useControls({
      number: { value: number, min: 3, max: 8, step: 0.5 },
      paddingTab: { value: paddingTab, min: 0, max: 30, step: 1 },
      widthInPx: { value: 728, min: 250, max: maxWidth, step: 1 },
      zIndex: { value: zIndex, min: 1, max: 999, step: 1 },
      align: {
        options: ['left', 'center', 'right'] as alignType[],
        value: align as alignType,
      },
    }));
  }

  const anchors = ['section1', 'section2', 'section3', 'section4', 'section5'];
  const imgs = anchors.map(id =>
    `https://dummyimage.com/180x60/eeeeee/555555&text=${id}` // 灰底深灰字：中性色调
  );
  const imgsActive = anchors.map(id =>
    `https://dummyimage.com/180x60/ffd700/000000&text=${id}` // 金黄色高亮+黑字：轻奢风
  );

  const bgColors = ['#fff', '#f5f5f5', '#ebebeb', '#e1e1e1', '#d7d7d7'];

  return (
    <>
      <section
        id="header"
        style={{
          height: '100vh',
          background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4vh 2vw',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#333',
          }}
        >
          Welcome to the Demo
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#666',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          Scroll down to explore different sections using the Elevator component.
        </p>
      </section>

      <Elevator
        anchorPoints={anchors}
        anchorImages={imgs}
        anchorActiveImages={imgsActive}
        number={number}
        width={widthInPx + "px"}
        paddingTab={paddingTab}
        zIndex={zIndex}
        align={align as alignType}
      />

      {anchors.map((id, idx) => (
        <section
          id={id}
          key={id}
          style={{
            height: '100vh',
            paddingTop: 80,
            backgroundColor: bgColors[idx % bgColors.length],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2>{id}</h2>
        </section>
      ))}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App/>
    <Leva
      titleBar={{
        position: { x: 0, y: window.innerHeight - 300 }, // left + bottom（等效左下角）
      }}
    />
  </React.StrictMode>
);
