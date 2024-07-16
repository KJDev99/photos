import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api/api";
import { FaFilePdf } from "react-icons/fa6";
const GetPdf = () => {
  const [pdfData, setPdfData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const userIdentifier = Cookies.get("user_identifier");
        const token = sessionStorage.getItem("succesToken");

        const headers = {
          "user-identifier": userIdentifier,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/pdf",
        };

        const response = await api.get("/file/pdf/", { headers });
        setPdfData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchPdf();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      {pdfData ? (
        <div className="flex flex-col w-full  mb-5">
          {pdfData.map((pdf, index) => {
            return (
              <a
                href={`http://192.168.0.163:8000${pdf.file}`}
                target="_blank"
                className="border rounded-xl mb-4 flex h-14 items-center px-4 justify-between"
                download={`file_${index + 1}.pdf`}
                key={index}
              >
                <div className="flex items-center ">
                  <FaFilePdf />
                  <h2 className="ml-2">{pdf.created_at}</h2>
                </div>
                <button className="uppercase inline-flex items-center justify-center text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-sm max-md:py-2 max-md:px-4 max-md:text-xs">скачать</button>
              </a>
            );
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GetPdf;
