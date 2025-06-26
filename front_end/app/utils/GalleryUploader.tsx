import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";

type FileType = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface GalleryUploaderProps {
  onFileChange?: (files: File[]) => void;
  maxFileSize?: number;
  disabled?: boolean;
  initialImageUrls?: string[];
  maxCount?: number;
}

const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  onFileChange,
  maxFileSize = 6,
  disabled = false,
  initialImageUrls = [],
  maxCount = 3,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(""); // Now used in Image component
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Sync fileList with initialImageUrls on every change
  useEffect(() => {
    const initialFiles: UploadFile[] = initialImageUrls.map((url, index) => ({
      uid: `existing-${index}`,
      name: `image-${index + 1}`,
      status: "done",
      url: url,
    }));
    setFileList(initialFiles);
  }, [initialImageUrls]);

  // Handle image preview
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Handle file selection and generate previews
  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const validFiles = newFileList
      .filter((file) => file.status !== "removed")
      .slice(0, maxCount);

    const updatedFileList = await Promise.all(
      validFiles.map(async (file) => {
        if (file.originFileObj && !file.thumbUrl && !file.preview) {
          const preview = await getBase64(file.originFileObj as FileType);
          return {
            ...file,
            uid: file.uid || `new-${Date.now()}-${Math.random()}`,
            name: file.name || `image-${Date.now()}`,
            status: "done",
            thumbUrl: preview,
            preview,
          };
        }
        return file;
      })
    );

    setFileList(updatedFileList);
    const files = updatedFileList
      .filter((file) => file.originFileObj && file.status === "done")
      .map((file) => file.originFileObj as File);
    onFileChange?.(files);

    if (updatedFileList.some((file) => file.status === "error")) {
      message.error("One or more images failed to process");
    }
  };

  // Validate files before adding to fileList
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
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      disabled={disabled}
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Images</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        accept="image/*"
        maxCount={maxCount}
        disabled={disabled}
        multiple
        showUploadList={{
          showRemoveIcon: !disabled,
        }}
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
    </>
  );
};

export default GalleryUploader;
