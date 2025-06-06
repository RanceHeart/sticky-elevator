import React from 'react';
import ReactDOM from 'react-dom/client';
import { Elevator } from './lib/elevator';
import './lib/elevator.scss';

const anchors = ['section1', 'section2', 'section3', 'section4', 'section5'];
const imgs = anchors.map(id => `https://dummyimage.com/180x60/000/fff&text=${id}`);
const imgsActive = anchors.map(id => `https://dummyimage.com/180x60/ffffff/000000&text=${id}`);

const bgColors = [
  'rgba(255, 255, 255, 1)',
  'rgba(245, 245, 245, 1)',
  'rgba(235, 235, 235, 1)',
  'rgba(225, 225, 225, 1)',
  'rgba(215, 215, 215, 1)'
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
      number={5}
      paddingTab={0}
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
        <h2
          style={{
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            padding: '1em 2em',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {id}
        </h2>
      </section>
    ))}
  </React.StrictMode>
);
