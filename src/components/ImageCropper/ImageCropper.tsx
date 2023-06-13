import React, { useState, useRef, useEffect } from "react";
import { Col, Row } from 'antd';

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import styles from "./index.less";

import "react-image-crop/dist/ReactCrop.css";
import { Button, Input } from "antd";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper(props: {
  onChange: (value: any) => void;
}) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const [naturalHeight, setNaturalHeight] = useState(0);
  const [naturalWidth, setNaturalWidth] = useState(0);

  const [sizeWidthValue, setSizeWidthValue] = useState(0);
  const [sizeHeightValue, setSizeHeightValue] = useState(0);

  useEffect(() => {
    if (imgRef.current) {
      setSizeWidthValue((imgRef.current.naturalWidth * crop?.width / 100).toFixed(0));
      setSizeHeightValue((imgRef.current.naturalHeight * crop?.height / 100).toFixed(0));
    }
  }, [imgRef.current]);



  useEffect(() => {
    if (imgRef.current) {
      setNaturalHeight(imgRef.current.naturalHeight);
      setNaturalWidth(imgRef.current.naturalWidth);
    }
  }, [imgRef.current]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function selectFiles(files: File[]) {
    if (files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  }

  const onChange = (croppedInfo) => {
    setTimeout(() => {
      const canvas = document.getElementById("canvas-1");
      const base64 = canvas?.toDataURL();
      if (base64) {
        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          return new File([u8arr], filename, { type: mime });
        }
        var file = dataURLtoFile(
          base64,
          `${new Date().valueOf()}` + `.${imgSrc?.split(";")[0]?.slice(11)}`
        );
        props.onChange(file);
      }
    }, 200);
  };

  return (
    <div className="App">
      {!!imgSrc && (
        <div className={styles.ICSection}>
          <Row gutter={12}>
            <Col md={6}>
              <div className={styles.inputWrapper}>
                <label htmlFor="scale-input">Scale: </label>
                <Input
                  style={{ width: 75 }}
                  id="scale-input"
                  type="number"
                  step="0.1"
                  value={scale}
                  disabled={!imgSrc}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.inputWrapper}>
                <label htmlFor="rotate-input">Rotate(deg): </label>
                <Input
                  id="rotate-input"
                  type="number"
                  style={{ width: 75 }}
                  value={rotate}
                  disabled={!imgSrc}
                  onChange={(e) =>
                    setRotate(
                      Math.min(180, Math.max(-180, Number(e.target.value)))
                    )
                  }
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.inputWrapper}>
                <label htmlFor="width-input">Width: </label>
                <Input
                  id="width-input"
                  type="number"
                  style={{ width: 75 }}
                  value={sizeWidthValue}
                  disabled={!imgSrc}
                  min={0}
                  max={naturalWidth}
                  onChange={(e) => {
                    setNaturalWidth(Number(e.target.value).toFixed(0));
                    setSizeWidthValue(Number(e.target.value).toFixed(0));
                    setCrop({
                      ...crop,
                      x:0,
                      y:0,
                      width: Number(e.target.value) * 100 / imgRef.current?.naturalWidth,
                    });
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.inputWrapper}>
                <label htmlFor="height-input">Height: </label>
                <Input
                  id="height-input"
                  type="number"
                  style={{ width: 75 }}
                  value={sizeHeightValue}
                  disabled={!imgSrc}
                  min={0}
                  max={naturalHeight}
                  onChange={(e) => {
                    setNaturalHeight(Number(e.target.value).toFixed(0));
                    setSizeHeightValue(Number(e.target.value).toFixed(0));
                    setCrop({
                      ...crop,
                      x:0,
                      y:0,
                      height: Number(e.target.value) * 100 / imgRef.current?.naturalHeight,
                    });
                  }}
                />
              </div>
            </Col>
          </Row>
          <div className={styles.ICPreview}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => {
                setCrop(percentCrop);
                // console.log("size", imgRef.current?.naturalWidth * percentCrop.width / 100);
                setSizeWidthValue((imgRef.current?.naturalWidth * percentCrop.width / 100).toFixed(0));
                setSizeHeightValue((imgRef.current?.naturalHeight * percentCrop.height / 100).toFixed(0));
              }}
              onComplete={(c) => {
                onChange(c);
                setCompletedCrop(c);
              }}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  height: "100%",
                  width: "auto",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <div>
              <Button onClick={handleToggleAspectClick}>
                Toggle aspect {aspect ? "off" : "on"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="Crop-Controls">
        {!imgSrc && (
          <input type="file" accept="image/*" onChange={onSelectFile} />
        )}
      </div>
      <div>
        {!!completedCrop && (
          <div style={{ position: "absolute", visibility: "hidden" }}>
            <canvas
              id="canvas-1"
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
