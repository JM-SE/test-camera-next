import { useState } from 'react';
import SelfieHooks from '../src/components/SelfieHooks';
import styles from '../styles/Home.module.css';

export const Selfie = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button
                    style={{
                        padding: '5px 10px 5px 10px',
                        marginBottom: '20px',
                    }}
                    onClick={() => setIsCameraOpen(!isCameraOpen)}
                >
                    OPEN/CLOSE CAMERA
                </button>
                {isCameraOpen && <SelfieHooks cameraOpen={isCameraOpen} />}
            </main>
        </div>
    );
};

export default Selfie;
