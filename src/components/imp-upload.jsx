import { useState } from "react";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import "../App.css";

function ImgUpload() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [colors, setColors] = useState([{ color: getRandomColor() }]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  const rotateLeft = () => {
    setRotation(rotation - 15);
  };

  const rotateRight = () => {
    setRotation(rotation + 15);
  };

  function getRandomColor() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  function handleChangeColor(index, newColor) {
    const newColors = [...colors];
    newColors[index] = { color: newColor };
    setColors(newColors);
  }

  function removeLeadingZero(number) {
    if (number.startsWith("0") && number !== "0") {
      return number.substring(1);
    }
    return number;
  }

  return (
    <div className="container mx-auto grow">
      <h2 className="text-3xl my-6">Загрузить изображение:</h2>
      <div className="input-container">
        <div className="flex md:mx-36 max-md:flex-col">
          <label className="flex md:w-1/2 max-md:w-full mb-5">
            <p className="w-max my-1">Ширина (mm):</p>
            <input
              className="border mx-3 px-2 py-1 rounded"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <p className="my-1 font-medium">
              {Math.floor(width * 3.7795275591)} px
            </p>
          </label>
          <label className="flex md:w-1/2 max-md:w-full mb-5">
            <p className="w-max my-1">Высота (mm):</p>
            <input
              className="border mx-3 px-2 py-1 rounded"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <p className="my-1 font-medium">
              {Math.floor(height * 3.7795275591)} px
            </p>
          </label>
        </div>
        <label className="md:mx-36 mb-10 flex">
          <p className="w-max my-1 mr-3">Загрузить изображение:</p>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>
      {width > 0 && height > 0 ? (
        <div
          className="rectangle mx-auto rounded"
          style={{
            width: `${width}mm`,
            height: `${height}mm`,
            border: "1px solid black",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {image && (
            <img
              src={image}
              alt="Uploaded"
              style={{
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                position: "absolute",
                top: "50%",
                left: "50%",
                objectFit: "cover",
              }}
            />
          )}
        </div>
      ) : (
        ""
      )}

      {image && (
        <div className="flex flex-col">
          <div className="mx-auto flex w-full justify-center my-4">
            <label className="mx-2 flex items-center">
              Шкала:
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={handleScaleChange}
                className="mx-2 mt-1"
              />
            </label>
            <div className="mx-2">
              <button className="mx-1" onClick={rotateLeft}>
                <FaArrowRotateLeft />
              </button>
              <button className="mx-1" onClick={rotateRight}>
                <FaArrowRotateRight />
              </button>
            </div>
          </div>
          <div className="mx-auto flex w-full justify-around items-center my-4 flex-wrap ">
            <label className="flex">
              <p className="my-1 capitalize">количество цветов:</p>
              <input
                className="border mx-3 px-2 py-1 rounded"
                type="number"
                value={colors.length}
                onChange={(e) => {
                  const count = parseInt(removeLeadingZero(e.target.value)); // 0 bilan boshlanmagan son
                  const newColors = Array.from({ length: count }, () => ({
                    color: getRandomColor(),
                  }));
                  setColors(newColors);
                  console.log(colors.length);
                  
                }}
              />
            </label>
            <button className="uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              изменять
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mx-auto">
            {colors.length > 0
              ? colors.map((item, index) => (
                  <div key={index} className="rounded h-10 w-10 flex flex-col">
                    <input
                      className="rounded color-picker"
                      type="color"
                      id={`colorPicker${index}`}
                      value={item.color}
                      onChange={(e) => handleChangeColor(index, e.target.value)}
                    />
                    <label className="text-xs" htmlFor={`colorPicker${index}`}>
                      {item.color}
                    </label>
                  </div>
                ))
              : "rang yoq"}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImgUpload;
