"use client";

import React, { useState, useRef } from "react";
import { Button, Input, CircularProgress } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { BsUpload } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

const styles = {
  wrapper: {
    height: "100vh",
    padding: "10%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: "20px",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    position: "relative",
    height: "30em",
    padding: 20,
  },
  imagePreview: {
    marginTop: "2em",
  },
  row: {
    display: "flex",
    marginBottom: "10px",
    textAlign: "left",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
  },
  label: {
    fontSize: "16px",
    color: "#FFF",
    textAlign: "left",
  },
  value: {
    fontSize: "16px",
    textAlign: "left",
    color: "#80FFDC",
  },
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:4402/api/user/check-id",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(response.data.data);
      setFlipped(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleTryAgain = () => {
    setFile(null);
    setFileName("");
    setImagePreview(null);
    setData({});
    setFlipped(false);
  };

  const renderDataFields = (data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} style={styles.row}>
        <div style={styles.field}>
          <span style={styles.label}>{key}</span>
          <span style={styles.value}>{value}</span>
        </div>
      </div>
    ));
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2>ID CARD OCR</h2>
        <div className="inputContainer">
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            endContent={
              <BsUpload className="icon" onClick={handleInputClick} />
            }
          />
          <br />
          <div className={styles.buttons}>
            {!file ? null : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                Submit
              </Button>
            )}
            {Object.keys(data).length > 0 && (
              <Button onClick={handleTryAgain} disabled={isLoading}>
                Try Again
              </Button>
            )}
          </div>
          {isLoading && (
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              color="warning"
            />
          )}
          {imagePreview && (
            <div className={`flip-card ${flipped ? "flipped" : ""}`}>
              <div className="flip-card-inner">
                <div className="flip-card-front" style={styles.imagePreview}>
                  <div className="ocrloader">
                    <div className="ocrimage">
                      <Image
                        height={300}
                        width={300}
                        src={imagePreview}
                        alt="Selected"
                        objectFit="contain"
                      />
                    </div>
                    <p>Scanning</p>
                    <em></em>
                    <span></span>
                  </div>
                </div>
                <div className="flip-card-back">
                  {Object.keys(data).length > 0 && (
                    <div className="cardContent">{renderDataFields(data)}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}
