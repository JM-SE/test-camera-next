/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useState, useRef, useEffect } from 'react';
import { testDataRENAPER } from '../constants/testDataRENAPER';

export const Selfie = ({ cameraOpen, isFront }) => {
  const [renaperValid, setRenaperValid] = useState(null);
  const [transactionControlNumber, setTransactionControlNumber] = useState('');
  const [dni, setDni] = useState('');
  const [gender, setGender] = useState('M');

  const [imageURL, setImageURL] = useState('');
  const [cameraFacingMode, setCameraFacingMode] = useState(
    isFront ? 'user' : 'environment'
  );

  const videoEle = useRef(null);
  const canvasEle = useRef(null);
  const imageEle = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
      });

      videoEle.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  };

  const stopCam = () => {
    const stream = videoEle.current.srcObject;
    const tracks = stream?.getTracks();

    tracks?.forEach((track) => {
      track.stop();
    });
  };

  useEffect(() => {
    if (isFront) {
      setCameraFacingMode('user');
    } else {
      setCameraFacingMode('environment');
    }
  }, [isFront]);

  useEffect(() => {
    if (cameraOpen) {
      startCamera();
    } else {
      stopCam();
    }
  }, [cameraOpen]);

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

  // console.log(imageURL.split(',')[1]);

  const backToCam = () => {
    setImageURL('');
    startCamera();
  };

  const postDataRenaper = async () => {
    try {
      const { imagen, dni, sexo } = testDataRENAPER;

      const response = await fetch(
        'https://apirenaper.idear.gov.ar/CHUTROFINAL/API_ABIS/apiInline_v3.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzMjM2IiwidXNlck5hbWUiOiJzY3Jvc3Ryb3RzdCIsInByb3ZpbmNpYUlkIjpudWxsLCJuYmYiOjE2NjI2NTE5MDMsImV4cCI6MTY2MjY5MjM5OX0.g0BrIFm-1PFY00bk7zJGyODvO5q7Nj5KQEdWu3iwTL8`,
            Cookie: 'PHPSESSID=a6c6fccdc6449cd5ade54ddbcc4b751a',
          },
          body: JSON.stringify({ imagen, dni, sexo }),
        }
      );

      const data = await response.json();

      if (data?.data.notificacion.transactionControlNumber) {
        return setTransactionControlNumber(
          data.data.notificacion.transactionControlNumber
        );
      }

      return console.log(data.data.mensaje);
    } catch (error) {
      console.error(error);
    }
  };

  const getDataRenaper = async () => {
    try {
      const response = await fetch(
        `https://apirenaper.idear.gov.ar/CHUTROFINAL/API_ABIS/resultadoTCN.php?id=${transactionControlNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIzMjM2IiwidXNlck5hbWUiOiJzY3Jvc3Ryb3RzdCIsInByb3ZpbmNpYUlkIjpudWxsLCJuYmYiOjE2NjI2NTE5MDMsImV4cCI6MTY2MjY5MjM5OX0.g0BrIFm-1PFY00bk7zJGyODvO5q7Nj5KQEdWu3iwTL8`,
            Cookie: 'PHPSESSID=a6c6fccdc6449cd5ade54ddbcc4b751a',
          },
        }
      );

      const data = await response.json();

      if (data?.data.mensaje === 'OK') {
        return setRenaperValid(true);
      }

      return setRenaperValid(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (transactionControlNumber) {
      getDataRenaper();
    }
  }, [transactionControlNumber]);

  console.log(transactionControlNumber);
  console.log(renaperValid);
  console.log(dni);
  console.log(gender);

  return (
    <div style={{ width: '100%', background: '#e2eae9' }}>
      {imageURL === '' && (
        <div>
          <video
            width="100%"
            height="100%"
            autoPlay={true}
            ref={videoEle}
            style={{
              transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : null,
            }}
          ></video>
          <button
            disabled={!cameraOpen}
            style={{
              marginTop: '20px',
              width: '100%',
              height: '80px',
              border: 'none',
              borderRadius: 10,
              background: '#98d7c2',
            }}
            onClick={takeSelfie}
          >
            <span style={{ fontSize: 40 }}>Sacar foto</span>
          </button>
        </div>
      )}
      <canvas ref={canvasEle} style={{ display: 'none' }}></canvas>
      {imageURL !== '' && (
        <div>
          <div>
            <span style={{ fontSize: 25, display: 'block', marginTop: 20 }}>
              Captura
            </span>
            <img
              src={imageURL}
              ref={imageEle}
              alt="img"
              style={{
                maxWidth: '90%',
                height: 'auto',
                marginTop: '15px',
                transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : null,
              }}
            />
          </div>

          <div
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <label style={{ marginRight: 5 }}>Sexo:</label>
            <select name="gender" id="gender">
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="X">No binario</option>
            </select>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ marginRight: 5 }}>DNI:</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
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
              <span style={{ fontSize: 20 }}>Volver</span>
            </button>
            <button
              style={{
                marginLeft: '20px',
                fontSize: 20,
              }}
              onClick={postDataRenaper}
            >
              Check RENAPER
            </button>
            {renaperValid && (
              <div style={{ padding: '0 10px 0 10px' }}>
                VALIDACION RENAPER OK
              </div>
            )}
            <a
              style={{
                marginLeft: '20px',
                fontSize: 20,
              }}
              href={imageURL}
              download="selfie.png"
            >
              Descargar
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Selfie;
