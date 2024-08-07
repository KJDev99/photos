import { useState, useEffect, useCallback, useRef } from "react";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { MdKeyboardReturn } from "react-icons/md";
import Cookies from "js-cookie";
import "../App.css";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

function ImgUpload() {
  const navigate = useNavigate();
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [userIdentifier, setUserIdentifier] = useState(
    Cookies.get("user_identifier") || null
  );
  const [rotation, setRotation] = useState(0);
  const [colors, setColors] = useState([]);
  const [showSort, setShowSort] = useState(true);
  const [activeImage, setActiveImage] = useState(true);
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

  const [schema, setSchema] = useState();
  const [sizePixel, setSizePixel] = useState(2);
  const [hover2, setHover2] = useState(false);
  const [inputSizeValue, setInputSizeValue] = useState("");

  const [initialDistance, setInitialDistance] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (width > 0 && height > 0 && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [width, height]);
  const saveState = (getId, newImage, colors, numColors, activeImage) => {
    const state = {
      width,
      height,
      image: newImage,
      colors: colors,
      fileName,
      numColors: numColors,
      getId,
      translateX,
      translateY,
      scale,
      rotation,
      activeImage: activeImage,
      sizePixel,
    };
    sessionStorage.setItem("image_upload_state", JSON.stringify(state));
  };

  useEffect(() => {
    window.onbeforeunload = () => {
      sessionStorage.removeItem("image_upload_state");
      sessionStorage.removeItem("user_identifier");
    };
  }, []);

  const preventDefaults = (e) => {
    // e.preventDefault();
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

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
    } else {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    preventDefaults(e);
    if (e.touches.length === 2 && initialDistance) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      const newScale = distance / initialDistance;
      setScale(newScale);
    } else if (isDragging) {
      const dx = (e.touches[0].clientX - startX) / scale;
      const dy = (e.touches[0].clientY - startY) / scale;
      setTranslateX((prevTranslateX) => prevTranslateX + dx);
      setTranslateY((prevTranslateY) => prevTranslateY + dy);
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setIsDragging(false);
    }
  };
  const getDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  useEffect(() => {
    const currentRef = containerRef.current;

    // Begin event listeners attachment only to the div
    if (currentRef) {
      currentRef.addEventListener("mousemove", handleMouseMove);
      currentRef.addEventListener("mouseup", handleMouseUp);
      currentRef.addEventListener("mouseleave", handleMouseLeave);
      currentRef.addEventListener("touchmove", handleTouchMove);
      currentRef.addEventListener("touchend", handleTouchEnd);
    }
    // End event listeners attachment only to the div

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", handleMouseMove);
        currentRef.removeEventListener("mouseup", handleMouseUp);
        currentRef.removeEventListener("mouseleave", handleMouseLeave);
        currentRef.removeEventListener("touchmove", handleTouchMove);
        currentRef.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [
    isDragging,
    startX,
    startY,
    translateX,
    translateY,
    scale,
    initialDistance,
  ]);

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

  const handleUpload = async () => {
    setLoading(true);
    setTranslateX(0);
    setTranslateY(0);
    setLoading(true);
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("width", width);
      formData.append("height", height);

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const token = sessionStorage.getItem("succesToken");
      const userIdentifier = sessionStorage.getItem("user_identifier");

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (userIdentifier) {
        headers["user_identifier"] = userIdentifier;
      }

      try {
        const response = await api.post("/upload/", formData, { headers });

        console.log("Image uploaded successfully:", response.data);

        setActiveImage(false);

        setUserIdentifier(response.data.user_identifier);

        Cookies.set("user_identifier", response.data.user_identifier);

        getData(`/images/${response.data.uuid}`);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
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

  const handleSizeChange = (event) => {
    setInputSizeValue(event.target.value);
    setSizePixel(event.target.value);
  };

  const handleButtonClick2 = async () => {
    const newSize = inputSizeValue;
    setSizePixel(newSize);
    const userIdentifier = Cookies.get("user_identifier");
    const token = sessionStorage.getItem("succesToken");

    const headers = {};
    const payload = {
      block_size: newSize,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["user-identifier"] = userIdentifier;
    }

    try {
      const response = await api.put(`/image/pixel/update/${getId}`, payload, {
        headers,
      });
      const timestamp = new Date().getTime();
      const newImage = `${response.data.image}`;
      setImage(newImage);
      if (response.data.colors) {
        const initialColors = response.data.colors.map((color) => ({
          hex: color.hex,
          count: color.count,
        }));
        setColors(initialColors);
        setNumColors(initialColors.length);
        setInputValue(initialColors.length);
        console.log(initialColors.length);
        console.log(response.data, "dataeditsize");
        sessionStorage.setItem(
          "user_identifier",
          response.data.user_identifier
        );
        saveState(
          response.data.uuid,
          newImage,
          response.data.colors,
          response.data.colors.length
        );
      }
    } catch (error) {
      console.error("Error updating pixel size:", error);
    }
  };

  const handleKeyDown2 = (event) => {
    if (event.key === "Enter") {
      handleButtonClick2();
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
    const token = sessionStorage.getItem("succesToken");

    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["user-identifier"] = userIdentifier;
    }
    api
      .get(url, { headers })
      .then((response) => {
        setData(response?.data[0]);
        if (response.data[0].user_identifier) {
          setUserIdentifier(response.data[0].user_identifier);
          Cookies.set("user_identifier", userIdentifier);
          Cookies.set("UUID", response.data[0].uuid);
        }

        setImage(`${response.data[0].image}`);

        if (response.data[0].colors) {
          const initialColors = response.data[0].colors.map((color) => ({
            hex: color.hex,
            count: color.count,
          }));
          setColors(initialColors);
          console.log(response.data[0], "Get data");
          setNumColors(response.data[0].colors.length);
          setGetId(response.data[0].uuid);
          setLoading(true);
          handleUpdateColors(256, response.data[0].uuid);
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));
  };

  const handleUpdateColors = async (newNumColors, getIDD) => {
    if (newNumColors > 0) {
      const userIdentifier = Cookies.get("user_identifier");
      const token = sessionStorage.getItem("succesToken");

      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (userIdentifier) {
        headers["user-identifier"] = userIdentifier;
      }

      try {
        const response = await api.get(
          `/update-colors/${
            getIDD ? getIDD : getId
          }?limit_colors=${newNumColors}`,
          { headers }
        );
        setGetId(response.data.uuid);
        setData(response.data);
        setTimestamp(Date.now());
        const newImage = `${response.data.image}`;
        setImage(newImage);

        if (response.data.colors) {
          const initialColors = response.data.colors.map((color) => ({
            hex: color.hex,
            count: color.count,
          }));
          setColors(initialColors);
          console.log(response.data, "response.data useeffects");
          sessionStorage.setItem(
            "user_identifier",
            response.data.user_identifier
          );
          saveState(
            response.data.uuid,
            newImage,
            response.data.colors,
            response.data.colors.length,
            false
          );
        }
      } catch (error) {
        setNumColors(colors.length); // Agar catch bo'lsa, `colors` uchun qiymatni o'zgartirish kerak bo'ladi
        setInputValue(colors.length); // `setInputValue` ni qanday chaqirish kerakligi o'rniga o'zingiz o'ylashingiz kerak
      } finally {
        setLoading(false);
      }
    }
  };

  const handleButtonClick = useCallback(() => {
    if (inputActive) {
      setLoading(true);
      setHover(false);
      setInputActive(false);
      const newNumColors = inputValue;
      setNumColors(newNumColors);
      handleUpdateColors(newNumColors); // handleUpdateColors ni yangi numColors bilan chaqiramiz
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
          idx === index ? { ...color, hex: newColor } : color
        );
        setColors(updatedColors);

        const payload = {
          color_id: index + 1,
          new_color_hex: newColor,
        };

        const userIdentifier = Cookies.get("user_identifier");
        const token = sessionStorage.getItem("succesToken");

        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          headers["user-identifier"] = userIdentifier;
        }
        try {
          const response = await api.put(`color/update/${getId}`, payload, {
            headers,
          });
          const newImage = `${response.data.image}`;
          setImage(newImage);
          saveState(
            response.data.uuid,
            newImage,
            response.data.colors,
            numColors
          );
        } catch (error) {
          console.error("Error updating color:", error);
        }
      }

      setTempColor(null);
    }
  };

  const handleSortColors = async () => {
    const userIdentifier = Cookies.get("user_identifier");
    const token = sessionStorage.getItem("succesToken");

    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["user-identifier"] = userIdentifier;
    }

    try {
      const response = await api.get(
        `grouped/colors/${getId}?limit_colors=${numColors}`,
        {
          headers,
          withCredentials: true, // Agar kerak bo'lsa
        }
      );

      const data = response.data;
      const initialColors = data.colors.map((color) => ({
        color_id: color.id,
        hex: color.hex,
        count: color.count,
      }));

      setColors(initialColors);
      setShowSort(false); // Sort tugmasini yopish
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleNoSortColors = async () => {
    const userIdentifier = Cookies.get("user_identifier");
    const token = sessionStorage.getItem("succesToken");

    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      headers["user-identifier"] = userIdentifier;
    }

    try {
      const response = await api.get(
        `return/own-colors/${getId}?limit_colors=${numColors}`,
        {
          headers,
          withCredentials: true, // Agar kerak bo'lsa
        }
      );

      const data = response.data;
      const initialColors = data.colors.map((color) => ({
        color_id: color.id,
        hex: color.hex,
        count: color.count,
      }));

      setColors(initialColors);
      setShowSort(true); // Sort tugmasini ko'rsatish
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    // Login holatini tekshirish va saqlash
    const savedState = sessionStorage.getItem("image_upload_state");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setWidth(parsedState.width);
      setHeight(parsedState.height);
      setImage(parsedState.image);
      setColors(parsedState.colors);
      setFileName(parsedState.fileName);
      setNumColors(parsedState.numColors);
      setGetId(parsedState.getId);
      setTranslateX(0);
      setTranslateY(0);
      setScale(parsedState.scale);
      setRotation(parsedState.rotation);
      setActiveImage(parsedState.activeImage);
      setSizePixel(parsedState.sizePixel);
    }
  }, []);

  const schemaCreate = async () => {
    const userIdentifier = Cookies.get("user_identifier");
    const token = sessionStorage.getItem("succesToken");

    const headers = {
      "user-identifier": userIdentifier,
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const response = await api.get(`schema/${getId}`, {
        headers,
      });
      const data = response.data;
      setSchema(data.schema);
      console.log(response.data, "data-schema");
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setLoading(true);
    document.querySelectorAll(".print").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelector(".printcolor").style.marginTop = "65px";

    setShowAll(true);

    const content = document.querySelector("#content");

    // Get all images within the content
    const images = content.querySelectorAll("img");

    const convertImgToBase64 = (url) => {
      return fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        });
    };

    const replaceImageSources = async () => {
      for (const img of images) {
        try {
          const base64URL = await convertImgToBase64(img.src);
          img.src = base64URL;
        } catch (error) {
          console.error("Error converting image to base64:", error);
        }
      }
    };

    replaceImageSources().then(() => {
      const opt = {
        margin: 0,
        filename: "web-page.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, background: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
      };

      html2pdf()
        .from(content)
        .set(opt)
        .save()
        .outputPdf("datauristring")
        .then((pdfAsString) => {
          const userIdentifier = Cookies.get("user_identifier");
          const token = sessionStorage.getItem("succesToken");

          const headers = {
            "user-identifier": userIdentifier,
            Authorization: `Bearer ${token}`,
          };

          const byteString = atob(pdfAsString.split(",")[1]);
          const mimeString = pdfAsString
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          console.log(opt);
          const formData = new FormData();
          formData.append("file", blob, "web-page.pdf");

          api
            .post("/file/pdf/", formData, { headers })
            .then((response) => {
              console.log("File sent successfully", response);
            })
            .catch((error) => {
              console.error("Error sending file", error);
            })
            .finally(() => {
              document.querySelectorAll(".print").forEach((element) => {
                element.style.display = "";
              });
              document.querySelector(".printcolor").style.marginTop = "0px";
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error generating PDF", error);
          setLoading(false);
        });
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500  z-50">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
      <div className="container mx-auto pb-16" id="content">
        <div className="flex justify-between items-center max-md:flex-col">
          {activeImage && (
            <h2 className="text-3xl my-6 max-md:text-xl max-md:my-3">
              Загрузить изображение:
            </h2>
          )}
        </div>
        <div className="flex lg:mx-2 max-lg:flex-col print:hidden print">
          <label className="flex lg:w-1/3 max-lg:w-full mb-5">
            <div className="mediaedit">
              <p className="w-max my-1 mx-1 max-lg:w-[110px]">
                Ширина&nbsp;(mm):
              </p>
              <div className="flex">
                <input
                  className="border mx-1 px-2 py-1 rounded max-lg:w-[150px] h-8"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <p className="my-1 font-medium">
                  {Math.floor(width * 3.7795275591)}&nbsp;px
                </p>
              </div>
            </div>
          </label>
          <label className="flex lg:w-1/3 max-lg:w-full mb-5">
            <div className="mediaedit">
              <p className="w-max my-1 mx-1 max-lg:w-[110px]">
                Высота&nbsp;(mm):
              </p>
              <div className="flex">
                <input
                  className="border mx-1 px-2 py-1 rounded max-lg:w-[150px] h-8"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
                <p className="my-1 font-medium">
                  {Math.floor(height * 3.7795275591)}&nbsp;px
                </p>
              </div>
            </div>
          </label>
          {!activeImage && (
            <label className="flex cursor-pointer  lg:w-1/3 max-lg:w-full mb-5">
              <div
                className=" capitalize  flex"
                onMouseEnter={() => setHover2(true)}
                onMouseLeave={() => setHover2(false)}
              >
                <div className="mediaedit">
                  <span className="mx-1  my-1">размер&nbsp;пикселя:</span>
                  {!hover2 ? (
                    <div className="!w-[130px] border rounded px-2 py-1 mx-1 flex items-center  h-8">
                      {sizePixel}
                    </div>
                  ) : (
                    <>
                      <input
                        className="!w-[130px] border rounded px-2 py-1 mx-1 max-lg:w-[150px] h-8"
                        placeholder="число"
                        type="number"
                        value={inputSizeValue}
                        onChange={handleSizeChange}
                        onKeyDown={handleKeyDown2}
                      />
                    </>
                  )}
                </div>
                <button
                  className="buttonmedia uppercase mx-4 inline-flex items-center justify-center h-max text-white bg-indigo-500 border-0 px-10 focus:outline-none hover:bg-indigo-600 rounded text-lg  max-md:px-4 max-md:text-sm"
                  onClick={handleButtonClick2}
                >
                  <MdKeyboardReturn className="mr-2 text-2xl mt-1" />
                </button>
              </div>
            </label>
          )}
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
          <div className="w-full overflow-x-auto">
            <div
              className="overflow-y-auto max-h-[70vh] w-max mx-auto"
              ref={containerRef}
            >
              <div
                className="rectangle mx-auto  !border-dashed"
                style={{
                  width: `${width}mm`,
                  height: `${height}mm`,
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
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {image ? (
                  <img
                    src={`${image}`}
                    alt="Uploaded"
                    style={{
                      width: width < height ? "100%" : "auto",
                      height: width < height ? "auto" : "100%",
                      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
                      cursor: isDragging ? "grabbing" : "zoom-out",
                      touchAction: "none",
                      position: "absolute",
                      top: "0%",
                      left: "0%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    Перетащите изображение сюда
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
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
                <div className="mx-auto flex w-full justify-center items-center my-4 flex-wrap print:hidden print">
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
                        <div className="div print:hidden print">
                          {showSort ? (
                            <p
                              className="print capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
                              onClick={handleSortColors}
                            >
                              Сортировать
                            </p>
                          ) : (
                            <p
                              className="print capitalize bg-transparent cursor-pointer text-center underline text-[blue]"
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
                  <div className="flex flex-wrap gap-4 mx-auto justify-center printcolor">
                    {colors.length > 0
                      ? colors
                          .slice(0, showAll ? colors.length : 20)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="rounded h-14 w-10 flex flex-col"
                            >
                              <input
                                className={`rounded color-picker`}
                                style={{
                                  backgroundColor: `${item.hex}`,
                                  color: `${item.hex}`,
                                }}
                                type="color"
                                id={`colorPicker${index}`}
                                value={item.hex}
                                onChange={(e) =>
                                  handleChangeColor(index, e.target.value)
                                }
                                onBlur={handleBlur}
                              />
                              <div className="flex flex-col items-center">
                                <label
                                  className="text-xs"
                                  htmlFor={`colorPicker${index}`}
                                >
                                  {item.hex}
                                </label>
                                <div className="text-xs">
                                  {item.count}&nbsp;PX
                                </div>
                              </div>
                            </div>
                          ))
                      : "rang yoq"}
                  </div>
                  {colors.length > 20 && (
                    <div className="my-4 print:hidden print">
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

                <div className="mx-auto flex w-full justify-center items-center my-4 flex-wrap">
                  {schema ? (
                    <button
                      onClick={handlePrint}
                      className="print:hidden print uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm w-[200px] text-center mx-auto justify-center max-md:py-2 max-md:px-4 max-md:text-sm"
                    >
                      скачать
                    </button>
                  ) : (
                    <button
                      onClick={schemaCreate}
                      className="print:hidden print uppercase inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm w-[200px] text-center mx-auto justify-center max-md:py-2 max-md:px-4 max-md:text-sm"
                    >
                      схема
                    </button>
                  )}
                </div>

                <div className="mx-auto flex w-full justify-center items-center my-4 flex-wrap printsxema">
                  <br />
                  {schema
                    ? schema.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-8 space-x-4">
                          <h2 className="text-lg font-bold"></h2>
                          <div className="">
                            {group.groups.map((item) => (
                              <div key={item.id} className="flex">
                                {item.colors.map((color, colorIndex) => (
                                  <div
                                    key={colorIndex}
                                    className="w-6 h-6 flex items-center justify-center text-xs !text-[red] border border-dashed border-black"
                                    style={{ backgroundColor: color.hex_code }}
                                  >
                                    {color.color_name}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ImgUpload;
