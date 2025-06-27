import { useState, useRef } from "react";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Toast as PrimeToast } from "primereact/toast";
import "antd/dist/reset.css";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type RcFile = import("antd/es/upload").RcFile; // Import RcFile type explicitly

interface ImageUploaderProp {
  initialImageUrl?: string; // URL ảnh ban đầu (từ server hoặc local)
  onFileChange: (file: RcFile | null) => void; // Updated to use RcFile
  maxFileSize?: number; // Kích thước file tối đa (MB), mặc định 2MB
  disabled?: boolean; // Trạng thái vô hiệu hóa
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ImageUploader: React.FC<ImageUploaderProp> = ({
  initialImageUrl,
  onFileChange,
  maxFileSize = 2,
  disabled = false,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>(
    initialImageUrl
      ? [
          {
            uid: "-1",
            name: "avatar",
            status: "done",
            url: initialImageUrl,
          },
        ]
      : []
  );
  const toast = useRef<PrimeToast>(null); // Initialize Toast ref

  // Xử lý preview ảnh
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Xử lý khi file thay đổi
  const handleFileChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj as RcFile; // Use RcFile
      onFileChange(file);
      getBase64(file).then((base64) => {
        setFileList([
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: base64,
          },
        ]);
      });
    } else {
      onFileChange(null);
      setFileList([]);
    }
  };

  // Kiểm tra file trước khi upload
  const beforeUpload = (file: FileType) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "You can only upload image files!",
        life: 3000,
      });
      return false;
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isLtMaxSize) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Image must be smaller than ${maxFileSize}MB!`,
        life: 3000,
      });
      return false;
    }
    return true;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <PrimeToast ref={toast} />
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleFileChange}
        beforeUpload={beforeUpload}
        maxCount={1}
        accept="image/*"
        disabled={disabled}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUploader;
