import { useState, useEffect, useCallback, useRef } from "react";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { MdKeyboardReturn } from "react-icons/md";
import Cookies from "js-cookie";
import "../App.css";
import api from "../api/api";

function ImgUpload() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [useriIdentifier, setUserIdentifier] = useState("test");
  const [rotation, setRotation] = useState(0);
  const [colors, setColors] = useState([]);
  const [showSort, setShowSort] = useState(true);
  const [activeImage, setActiveImage] = useState(true);
  // const [imageVisible, setImageVisible] = useState(false);
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState("Файл не выбран");
  const [numColors, setNumColors] = useState(0);
  const [getId, setGetId] = useState(0);
  const [hover, setHover] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputActive, setInputActive] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [tempColor, setTempColor] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (width > 0 && height > 0 && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [width, height]);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    preventDefaults(e);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    [...files].forEach(uploadFile);
  };

  const uploadFile = (file) => {
    setImageFile(file); // Set the file for upload
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    document.body.style.overflowY = "auto";
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    e.preventDefault(); // Scrollni to'xtatish uchun
    e.stopPropagation();
    if (isDragging) {
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;
      setTranslateX(translateX + dx);
      setTranslateY(translateY + dy);
      setStartX(e.clientX);
      setStartY(e.clientY);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // Set the file for upload
      const reader = new FileReader();
      setFileName(file.name);
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("Файл не выбран");
    }
  };

  const handleScaleChange2 = (event) => {
    setScale(event.target.value);
  };

  const rotateLeft = () => {
    setRotation(rotation - 15);
  };

  const rotateRight = () => {
    setRotation(rotation + 15);
  };

  const handleLabelHoverEnter = () => {
    setHover(true);
  };

  const handleInputChange = (e) => {
    if (e.target.value > 256) {
      setInputValue(256);
    } else {
      setInputValue(e.target.value);
    }
    setInputActive(true);
  };

  const handleUpload = async () => {
    setLoading(true);
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("user_identifier", useriIdentifier);
      // Cookies.set("user_identifier", JSON.stringify(useriIdentifier));
      try {
        const response = await api.post("/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image uploaded formData:", formData);
        console.log("Image uploaded successfully:", response.data);
        setActiveImage(false);
        setUserIdentifier(response.data.user_identifier);
        console.log(
          "Image uploaded useriIdentifier:",
          response.data.user_identifier
        );
        Cookies.set("user_identifier", response.data.user_identifier);
        getData(`/images/${response.data.uuid}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleHideColors = () => {
    setShowAll(false);
  };

  const getData = (url) => {
    const userIdentifier = Cookies.get("user_identifier");
    api
      .get(url, {
        headers: {
          "user-identifier": userIdentifier,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log("Image uploaded successfully222:", response.data[0]);
        setUserIdentifier(response.data[0].user_identifier);
        Cookies.set("user_identifier", response.data[0].user_identifier);
        setImage(
          `${response.data[0].image}?timestamp=${timestamp}?${response.data[0].uuid}`
        );
        if (response.data[0].colors) {
          const initialColors = response.data[0].colors.map((color) => ({
            color: color.hex,
          }));
          setColors(initialColors);

          console.log(response.data[0], "response.data[0]");
          setNumColors(response.data[0].colors.length);
          setGetId(response.data[0].uuid);
          setLoading(true);
        }
      })
      .catch((error) => console.error("Error:", error));
    // .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (numColors > 0) {
      const userIdentifier = Cookies.get("user_identifier");
      api
        // .get(`/update-colors/${getId}?limit_colors=${numColors}`)
        .get(`/update-colors/${getId}?limit_colors=${numColors}`, {
          headers: {
            "user-identifier": userIdentifier,
          },
        })
        .then((response) => {
          setGetId(response.data.uuid);
          setData(response.data);
          console.log(data);
          setImage(
            `${response.data.image}?timestamp=${timestamp}?${response.data.uuid}?1`
          );
          setTimestamp(Date.now());
          console.log(response.data.image, "rasm kelishi!!!");
          if (response.data.colors) {
            const initialColors = response.data.colors.map((color) => ({
              color: color.hex,
            }));
            setColors(initialColors);
            console.log(response.data, "data");
            console.log("Initial colors:", initialColors);
          }
        })
        .catch(() => {
          setNumColors(colors.length);
          setInputValue(colors.length);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [numColors]);

  const handleButtonClick = useCallback(() => {
    if (inputActive) {
      setLoading(true);
      setHover(false);
      setInputActive(false);
      setNumColors(inputValue);
    }
  }, [inputActive, inputValue]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleButtonClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleButtonClick]);

  const handleChangeColor = (index, newColor) => {
    setTempColor({ index, newColor });
  };

  const handleBlur = async () => {
    if (tempColor !== null) {
      const { index, newColor } = tempColor;
      const oldColor = colors[index].color;

      if (newColor !== oldColor) {
        const updatedColors = colors.map((color, idx) =>
          idx === index ? { ...color, color: newColor } : color
        );
        setColors(updatedColors);
        console.log(tempColor, "tempcolor");
        console.log(updatedColors);
        const payload = {
          color_id: index + 1,
          new_color_hex: newColor,
        };
        console.log(payload);
        try {
          const response = await api.put(
            `color/update/${getId}`, // relative path
            payload
          );
          console.log("Updated color:", response.data.uuid);
        } catch (error) {
          console.error("Error updating color:", error);
        }
      }

      setTempColor(null);
    }
  };

  const handleSortColors = async () => {
    try {
      const response = await api.get(`grouped/colors/${getId}`);
      const data = response.data;
      const initialColors = data.colors.map((color) => ({
        color: color.hex,
      }));
      setColors(initialColors);
      console.log(initialColors, "sort-colors");
      setShowSort(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handleNoSortColors = async () => {
    try {
      const response = await api.get(`return/own-colors/${getId}`);
      const data = response.data;
      const initialColors = data.colors.map((color) => ({
        color: color.hex,
      }));
      setColors(initialColors);
      console.log(initialColors, "nosort-colors");
      setShowSort(true);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="container mx-auto pb-16">
      <div className="flex justify-between items-center max-md:flex-col">
        {activeImage && (
          <h2 className="text-3xl my-6 max-md:text-xl max-md:my-3">
            Загрузить изображение:
          </h2>
        )}

        {/* {!activeImage && (
          <div className="flex justify-center">
            <button
              className="uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg mx-4 my-10 max-md:my-4 max-md:py-2 max-md:px-4 max-md:text-sm"
              onClick={handleRefresh}
            >
              перезапуск
            </button>
            <button
              className="uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg mx-4 my-10 max-md:my-4 max-md:py-2 max-md:px-4 max-md:text-sm"
              // onClick={finish}
            >
              скачать
            </button>
          </div>
        )} */}
      </div>
      <div className="flex md:mx-36 max-md:flex-col">
        <label className="flex md:w-1/2 max-md:w-full mb-5">
          <p className="w-max my-1 max-md:w-[110px]">Ширина (mm):</p>
          <input
            className="border mx-3 px-2 py-1 rounded max-md:w-[150px]"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <p className="my-1 font-medium">
            {Math.floor(width * 3.7795275591)} px
          </p>
        </label>
        <label className="flex md:w-1/2 max-md:w-full mb-5">
          <p className="w-max my-1 max-md:w-[110px]">Высота (mm):</p>
          <input
            className="border mx-3 px-2 py-1 rounded max-md:w-[150px]"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <p className="my-1 font-medium">
            {Math.floor(height * 3.7795275591)} px
          </p>
        </label>
      </div>
      {activeImage && (
        <div className="input-container">
          <div className="md:mx-36 mb-10 flex items-center">
            <p className="w-max my-1 mr-3">Загрузить изображение:</p>
            <input
              className="file-input"
              type="file"
              id="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex max-md:flex-col ">
              <label htmlFor="file" className="file-label">
                Выберите файл
              </label>
              <span className="file-name">{fileName}</span>
            </div>
          </div>
        </div>
      )}
      {width > 0 && height > 0 ? (
        <div className="w-full overflow-x-auto" ref={containerRef}>
          <div
            className="rectangle mx-auto  !border-dashed"
            style={{
              width: `${3 * width}mm`,
              height: `${3 * height}mm`,
              border: "1px solid black",
              position: "relative",
              overflow: "hidden",
            }}
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDragLeave={preventDefaults}
            onDrop={handleDrop}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {image ? (
              <img
                src={`${image}`}
                alt="Uploaded"
                style={{
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                  cursor: isDragging ? "grabbing" : "zoom-out",
                  // transformOrigin: "center center",
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  // objectFit: "cover",
                }}
              />
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                Перетащите изображение сюда
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500  z-50">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}

      {image && (
        <div className="flex flex-col">
          {activeImage ? (
            <div className="flex justify-center items-center my-4 max-md:flex-col">
              <div className="mx-auto flex w-max justify-center my-4">
                <label className="mx-2 flex items-center">
                  Шкала:
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={handleScaleChange2}
                    className="mx-2 mt-1"
                  />
                </label>
                <div className="mx-2 flex">
                  <button className="mx-1" onClick={rotateLeft}>
                    <FaArrowRotateLeft />
                  </button>
                  <button className="mx-1" onClick={rotateRight}>
                    <FaArrowRotateRight />
                  </button>
                </div>
              </div>

              <button
                className="uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm w-[200px] text-center mx-auto justify-center max-md:py-2 max-md:px-4 max-md:text-sm"
                onClick={handleUpload}
              >
                Перевести&nbsp;в&nbsp;пиксели
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="mx-auto flex w-full justify-center items-center my-4 flex-wrap">
                <div className="flex max-md:flex-col">
                  <label
                    className="flex cursor-pointer"
                    onClick={handleLabelHoverEnter}
                  >
                    <div className="my-1 capitalize  flex">
                      <span className="mr-3">количество цветов:</span>
                      {!hover ? (
                        <div className="w-[100px] border rounded px-1">
                          {numColors}
                        </div>
                      ) : (
                        <input
                          className="w-[100px] border rounded px-1"
                          placeholder="число"
                          type="number"
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  </label>
                </div>
                <div className="flex max-md:justify-center max-md:w-full">
                  <button
                    className=" uppercase mx-4 my-2 inline-flex items-center justify-center text-white bg-indigo-500 border-0 py-2 px-10 focus:outline-none hover:bg-indigo-600 rounded text-lg max-md:py-2 max-md:px-4 max-md:text-sm"
                    onClick={handleButtonClick}
                  >
                    <MdKeyboardReturn className="mr-2 text-2xl mt-1" />
                  </button>
                </div>
              </div>
              <div>
                {colors.length > 20 && (
                  <div className="my-4">
                    {showAll ? (
                      <div className="div">
                        {showSort ? (
                          <p
                            className="capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
                            onClick={handleSortColors}
                          >
                            Сортировать
                          </p>
                        ) : (
                          <p
                            className="capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
                            onClick={handleNoSortColors}
                          >
                            нет сортировки
                          </p>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mx-auto justify-center">
                  {colors.length > 0
                    ? colors
                        .slice(0, showAll ? colors.length : 20)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="rounded h-10 w-10 flex flex-col"
                          >
                            <input
                              className="rounded color-picker"
                              type="color"
                              id={`colorPicker${index}`}
                              value={item.color}
                              onChange={(e) =>
                                handleChangeColor(index, e.target.value)
                              }
                              onBlur={handleBlur}
                            />
                            <label
                              className="text-xs"
                              htmlFor={`colorPicker${index}`}
                            >
                              {item.color}
                            </label>
                          </div>
                        ))
                    : "rang yoq"}
                </div>
                {colors.length > 20 && (
                  <div className="my-4">
                    {showAll ? (
                      <p
                        className="capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
                        onClick={handleHideColors}
                      >
                        скрыть больше
                      </p>
                    ) : (
                      <p
                        className="capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
                        onClick={handleShowMore}
                      >
                        Показать больше
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImgUpload;
