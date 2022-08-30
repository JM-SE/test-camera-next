import { useState } from 'react';
import SelfieHooks from '../src/components/SelfieHooks';
import styles from '../styles/Home.module.css';

export const Selfie = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFront, setIsFront] = useState(false);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <button
          disabled={isCameraOpen}
          style={{
            padding: '5px 10px 5px 10px',
            marginBottom: '20px',
          }}
          onClick={() => setIsCameraOpen(true)}
        >
          Inicial camara
        </button>
        <button
          disabled={!isCameraOpen}
          style={{
            padding: '5px 10px 5px 10px',
            marginBottom: '20px',
            marginLeft: '20px',
          }}
          onClick={() => setIsCameraOpen(false)}
        >
          Apagar camara
        </button>
        <button
          disabled={isCameraOpen}
          style={{
            padding: '5px 10px 5px 10px',
            marginBottom: '20px',
            marginLeft: '20px',
          }}
          onClick={() => setIsFront(!isFront)}
        >
          Rotar camara
        </button>
        <div>Camara actual: {isFront ? 'Frontal' : 'Trasera'}</div>
        {isCameraOpen && (
          <SelfieHooks cameraOpen={isCameraOpen} isFront={isFront} />
        )}
      </main>
    </div>
  );
};

export default Selfie;
