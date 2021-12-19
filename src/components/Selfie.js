/* eslint-disable @next/next/no-img-element */
import React, { Component } from 'react';

class Selfie extends Component {
    state = {
        imageURL: '',
    };

    videoEle = React.createRef();
    canvasEle = React.createRef();
    imageEle = React.createRef();

    componentDidMount = async () => {
        this.startCamera();
    };

    startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            this.videoEle.current.srcObject = stream;
        } catch (err) {
            this.setState({
                startCameraError: err,
            });
        }
    };

    takeSelfie = async () => {
        // Get the exact size of the video element.
        const width = this.videoEle.current.videoWidth;
        const height = this.videoEle.current.videoHeight;

        // get the context object of hidden canvas
        const ctx = this.canvasEle.current.getContext('2d');

        // Set the canvas to the same dimensions as the video.
        this.canvasEle.current.width = width;
        this.canvasEle.current.height = height;

        // Draw the current frame from the video on the canvas.
        ctx.drawImage(this.videoEle.current, 0, 0, width, height);

        // Get an image dataURL from the canvas.
        const imageDataURL = this.canvasEle.current.toDataURL('image/png');
        this.stopCam();

        this.setState({
            imageURL: imageDataURL,
        });
    };

    stopCam = () => {
        const stream = this.videoEle.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });
    };

    backToCam = () => {
        this.setState(
            {
                imageURL: '',
            },
            () => {
                this.startCamera();
            }
        );
    };

    render() {
        return (
            <div style={{ width: '100%', background: '#e2eae9' }}>
                <h1
                    style={{
                        margin: '20px 0',
                        fontSize: 70,
                    }}
                >
                    Selfie
                </h1>
                {this.state.imageURL === '' && (
                    <div>
                        <video
                            width="100%"
                            height="100%"
                            autoPlay={true}
                            ref={this.videoEle}
                        ></video>
                        <button
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                height: '100px',
                                border: 'none',
                                borderRadius: 15,
                                background: '#98d7c2',
                                cursor: 'pointer',
                            }}
                            onClick={this.takeSelfie}
                        >
                            <span style={{ fontSize: 40 }}>TAKE SELFIE</span>
                        </button>
                    </div>
                )}

                <canvas
                    ref={this.canvasEle}
                    style={{ display: 'none' }}
                ></canvas>
                {this.state.imageURL !== '' && (
                    <div>
                        <div>
                            <span style={{ fontSize: 25 }}>Image Preview</span>
                            <img
                                src={this.state.imageURL}
                                ref={this.imageEle}
                                alt="img"
                                style={{
                                    maxWidth: '90%',
                                    height: 'auto',
                                    marginTop: '15px',
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
                                    borderRadius: 15,
                                    background: '#98d7c2',
                                    cursor: 'pointer',
                                }}
                                onClick={this.backToCam}
                            >
                                <span style={{ fontSize: 20 }}>
                                    Back to cam
                                </span>
                            </button>
                            <a
                                style={{
                                    marginLeft: '20px',
                                    fontSize: 20,
                                }}
                                href={this.state.imageURL}
                                download="selfie.png"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Selfie;
