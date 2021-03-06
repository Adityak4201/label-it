import React, { useState, useEffect, useRef } from "react";
import "./EditImage.css";

const EditImage = ({ currImage, array, setArray }) => {
  // console.log(currImage);

  let ctx = null;
  const canvas = useRef();
  const image = useRef();
  const [xyval, setXY] = useState({ xval: 0, yval: 0 });

  const [r, setR] = useState(null);
  // const [array, setArray] = useState([]);
  // console.log(array);

  const [draw, setDraw] = useState(false);
  const onImageLoad = () => {
    const canvasEle = canvas.current;
    const imageEle = image.current;

    canvasEle.width = imageEle.clientWidth;
    canvasEle.height = imageEle.clientHeight;
    // console.log(canvasEle, imageEle);
    ctx = canvasEle.getContext("2d");
    // console.log(ctx);

    setR(ctx);
  };

  // useEffect(() => {
  //   canvas.current.addEventListener("keydown", handleKeyDown);
  // }, []);

  // const handleKeyDown = (event) => {
  //   if (event.ctrlKey && (event.key === "Z" || event.key === "z")) {
  //     if (array.length !== 0) {
  //       console.log(true);
  //       console.log("Hello", array.splice(array.length - 1));
  //       return array.splice(array.length - 1);
  //     }
  //   }
  // };

  useEffect(() => {
    setArray([]);
    //eslint-disable-next-line
  }, [currImage]);

  const drawRect = (e, style = {}) => {
    let rectw = e.pageX - e.nativeEvent.path[0].offsetLeft - xyval.xval;
    let recth = e.pageY - e.nativeEvent.path[0].offsetTop - xyval.yval;
    const { borderColor = "black", borderWidth = 2 } = style;
    r.clearRect(0, 0, image.current.clientWidth, image.current.clientHeight);

    // console.log(xyval.xval, xyval.yval, rectw, recth);

    let data = {
      x: (xyval.xval + rectw / 2) / image.current.clientWidth,
      y: (xyval.yval + recth / 2) / image.current.clientHeight,
      w: rectw / image.current.clientWidth,
      h: recth / image.current.clientHeight,
    };

    // console.log(array);
    setArray([...array, data]);

    r.strokeStyle = borderColor;
    r.lineWidth = borderWidth;
    r.beginPath();
    array.map((item) => {
      return r.rect(
        (item.x - item.w / 2) * image.current.clientWidth,
        (item.y - item.h / 2) * image.current.clientHeight,
        item.w * image.current.clientWidth,
        item.h * image.current.clientHeight
      );
    });
    r.rect(xyval.xval, xyval.yval, rectw, recth);

    r.stroke();
    r.closePath();
  };
  const moveRect =
    (r) =>
    (e, style = {}) => {
      if (draw) {
        let rectw = e.pageX - e.nativeEvent.path[0].offsetLeft - xyval.xval;
        let recth = e.pageY - e.nativeEvent.path[0].offsetTop - xyval.yval;
        const { borderColor = "black", borderWidth = 2 } = style;
        r.clearRect(
          0,
          0,
          image.current.clientWidth,
          image.current.clientHeight
        );

        r.strokeStyle = borderColor;
        r.lineWidth = borderWidth;
        r.beginPath();

        r.rect(xyval.xval, xyval.yval, rectw, recth);
        // console.log(xyval.xval, xyval.yval, rectw, recth);
        r.stroke();
      }
    };

  const init = (e) => {
    setXY({
      xval: e.pageX - e.nativeEvent.path[0].offsetLeft,
      yval: e.pageY - e.nativeEvent.path[0].offsetTop,
    });

    setDraw(true);
  };

  const endit = (e) => {
    r.closePath();
    setDraw(false);
    drawRect(e);
  };

  return (
    <div className="image-area">
      <canvas
        className="canvas-img"
        tabIndex="0"
        ref={canvas}
        onMouseMove={(e) => {
          moveRect(r)(e);
        }}
        onMouseDown={(e) => init(e)}
        onMouseUp={(e) => {
          endit(e);
        }}
      />
      <img
        className="labelling-img"
        src={currImage}
        ref={image}
        onLoad={onImageLoad}
        alt="Phone"
      />
    </div>
  );
};

export default EditImage;
