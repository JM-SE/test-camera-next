/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from 'react';

export const Selfie = () => {
    const [imageURL, setImageURL] = useState('');

    const videoEle = useRef(null);
    const canvasEle = useRef(null);
    const imageEle = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            videoEle.current.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    };

    const stopCam = () => {
        const stream = videoEle.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });
    };

    const takeSelfie = async () => {
        const width = videoEle.current.videoWidth;
        const height = videoEle.current.videoHeight;

        const ctx = canvasEle.current.getContext('2d');

        canvasEle.current.width = width;
        canvasEle.current.height = height;

        ctx.drawImage(videoEle.current, 0, 0, width, height);

        const imageDataURL = canvasEle.current.toDataURL('image/png');

        stopCam();

        setImageURL(imageDataURL);
    };

    const backToCam = () => {
        setImageURL('');
        startCamera();
    };

    useEffect(() => startCamera());

    return (
        <div style={{ width: '100%', background: '#e2eae9' }}>
            {imageURL === '' && (
                <div>
                    <video
                        width="100%"
                        height="100%"
                        autoPlay={true}
                        ref={videoEle}
                        style={{ transform: 'scaleX(-1)' }}
                    ></video>
                    <button
                        style={{
                            marginTop: '20px',
                            width: '100%',
                            height: '80px',
                            border: 'none',
                            borderRadius: 10,
                            background: '#98d7c2',
                            cursor: 'pointer',
                        }}
                        onClick={takeSelfie}
                    >
                        <span style={{ fontSize: 40 }}>TAKE PHOTO</span>
                    </button>
                </div>
            )}

            <canvas ref={canvasEle} style={{ display: 'none' }}></canvas>
            {imageURL !== '' && (
                <div>
                    <div>
                        <span style={{ fontSize: 25, display: 'block' }}>
                            Image Preview
                        </span>
                        <img
                            src={imageURL}
                            ref={imageEle}
                            alt="img"
                            style={{
                                maxWidth: '90%',
                                height: 'auto',
                                marginTop: '15px',
                                transform: 'scaleX(-1)',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginTop: '20px',
                        }}
                    >
                        <button
                            style={{
                                padding: '10px 15px 10px 15px',
                                height: '50px',
                                border: 'none',
                                borderRadius: 10,
                                background: '#98d7c2',
                                cursor: 'pointer',
                            }}
                            onClick={backToCam}
                        >
                            <span style={{ fontSize: 20 }}>Back</span>
                        </button>
                        <a
                            style={{
                                marginLeft: '20px',
                                fontSize: 20,
                            }}
                            href={imageURL}
                            download="selfie.png"
                        >
                            Download
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Selfie;