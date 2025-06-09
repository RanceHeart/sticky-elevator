import React from 'react';
import ReactDOM from 'react-dom/client';
import { Elevator } from './lib/elevator';
import './lib/elevator.scss';

const App = () => {
  const { number, paddingTab } = {number: 4.5, paddingTab: 0}

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
        paddingTab={paddingTab}
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
  </React.StrictMode>
);
