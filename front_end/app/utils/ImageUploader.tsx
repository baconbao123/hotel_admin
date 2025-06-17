import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImageUploaderProps {
  onFileChange?: (files: File[] | null) => void;
  maxFileSize?: number;
  disabled?: boolean;
  defaultFileList?: UploadFile[];
  maxCount?: number;
  initialImageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileChange,
  maxFileSize = 3,
  disabled = false,
  defaultFileList = [],
  maxCount = 1,
  initialImageUrl,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);

  useEffect(() => {
    if (initialImageUrl && maxCount === 1) {
      const initialFile: UploadFile = {
        uid: "-1",
        name: "current-avatar",
        status: "done",
        url: initialImageUrl,
      };
      setFileList([initialFile]);
    } else {
      setFileList([]);
    }
  }, [initialImageUrl, maxCount]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const latestFile = newFileList.slice(-maxCount); // Keep up to maxCount files
    setFileList(latestFile);
    const files = latestFile
      .filter((file) => file.originFileObj) // Ensure file exists
      .map((file) => file.originFileObj as File); // Extract File objects
    onFileChange?.(files.length > 0 ? files : null); // Pass array of files or null
    if (latestFile.some((file) => file.status === "error")) {
      message.error("Failed to upload one or more images");
    }
  };

  const beforeUpload = (file: FileType) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isLtMaxSize = file.size / 1024 / 1024 <= maxFileSize;
    if (!isLtMaxSize) {
      message.error(`Image must be smaller than ${maxFileSize}MB!`);
      return false;
    }
    return false; // Handle upload manually via onChange
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        accept="image/*"
        maxCount={maxCount}
        disabled={disabled}
        multiple={maxCount > 1} // Enable multiple file selection if maxCount > 1
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
            zIndex: 10000,
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default ImageUploader;
