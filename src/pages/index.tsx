import React, { useEffect, useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ComputerIcon from "@mui/icons-material/Computer";
import LinkIcon from "@mui/icons-material/Link";
import DriveIcon from "@mui/icons-material/DriveFileMove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import { uploadFile } from "@/libs/storage";
import { LinearProgress } from "@mui/material";
import useDrivePicker from "react-google-drive-picker";
import { UrlUploadModal } from "@/components/UrlModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const listItems = [
  {
    icon: <ComputerIcon />,
    text: "From my Computer",
    action: "uploadFromFile",
  },
  { icon: <LinkIcon />, text: "By URL", action: "uploadFromUrl" },
  { icon: <DriveIcon />, text: "From Google Drive", action: "uploadFromDrive" },
];

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<any>(0);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploaded, setUploaded] = useState<any>(null);
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openPicker, data] = useDrivePicker();
  const [urlModalOpen, setUrlModalOpen] = useState(false);

  const openGooglePicker = () => {
    openPicker({
      clientId:
        "871420478112-2odugpitpr2an97vjrnjbkte5bcc1nau.apps.googleusercontent.com",
      developerKey: "AIzaSyB2WSYMFaZ8vCT42-K1gb-hNTFpILK2OTM",
      viewId: "DOCS",
      token:
        "ya29.a0AcM612yO9jYWRhqAbvMW6ZzNR-UvAetQ6xTEiDZOlhn3SmPu3ZJst4e7gNNiX7SoLNMpfliCep3IM0f902WBqhQFIwjHV9u7jHv3dlSdQTqZ0WYlgYN85Yk_PNfVctGy47HRlQM5eY7f6XtpJbNsaOY4XwpvChVJ9w-YaCgYKAbASARASFQHGX2MiBH6CLteupPP5r3X4CgjIJA0171", // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data?.docs && Array.isArray(data?.docs)) {
          const files = data.docs.map((file: any) => ({
            name: file?.name,
            url: file?.url,
            size: file?.sizeBytes,
          }));

          setUploadedFiles((prevFiles: any) => [...prevFiles, ...files]);
        } else {
          console.error(
            "No files were selected or an unexpected data structure was returned."
          );
        }
      },
    });
  };

  const handleFileUpload = (event: any) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: any) => {
    try {
      if (!file) {
        throw new Error("No file selected");
      }

      const folder = "user/";

      await new Promise<void>((resolve, reject) => {
        uploadFile(
          file,
          folder,
          (progress: any) => {
            setUploadProgress(progress);
          },
          (downloadURL: any) => {
            setUploaded(downloadURL);
            setUploadedFiles((prevFiles: any) => [
              ...prevFiles,
              {
                url: downloadURL,
                name: file?.name,
                progress: uploadProgress,
                size: file?.size,
              },
            ]);
            setUploading(false);
            setSelectedFile(null);
            resolve();
          }
        );
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploading(false); // Ensure uploading state is reset on error
    }
  };

  const handleListItemClick = (action: any) => {
    if (action === "uploadFromFile") {
      inputRef?.current?.click(); // Trigger file input dialog
      setUploading(true);
    } else if (action === "uploadFromDrive") {
      openGooglePicker();
    } else if (action === "uploadFromUrl") {
      setUrlModalOpen(true);
    }
  };

  const handleAddUrl = (url: string) => {
    setUploadedFiles((prevFiles: any) => [
      ...prevFiles,
      {
        url,
        name: url,
        size: "Unknown",
      },
    ]);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#ecedf2] items-center justify-between p-24">
      <div className="w-[50%] h-auto flex rounded-[12px] bg-[#fefefe] flex flex-col">
        <div className="text-[26px] text-[#000] p-3">Upload file</div>
        <div className="w-full border-[1px] border-[#ebecf1]"></div>
        <div className="flex items-center justify-center h-auto p-5">
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="bg-[#b53636] cursor-pointer rounded-[4px] text-[#fff] text-[16px]"
            >
              <div className="w-full h-full cursor-pointer flex items-center rounded-[4px] text-[#fff] text-[16px]">
                Select file
              </div>
            </AccordionSummary>
            <AccordionDetails className="cursor-pointer bg-[#f5f5f5]">
              {listItems?.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      cursor: "pointer",
                    },
                    "&:active": {
                      backgroundColor: "#c0c0c0",
                    },
                  }}
                  onClick={() => handleListItemClick(item?.action)}
                >
                  <ListItemIcon>{item?.icon}</ListItemIcon>
                  <ListItemText primary={item?.text} />
                </ListItem>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="w-full p-3">
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            ref={inputRef}
          />
          {(uploadedFiles?.length > 0 || (selectedFile && uploading)) && (
            <div className="mt-4">
              <div className="text-[#000] text-[20px] ml-4 mb-3">
                Uploaded files
              </div>
              <ul>
                {selectedFile && uploading && (
                  <div className="flex flex-row items-center justify-between mx-4 my-[30px]">
                    <div className="text-[#000]/50 truncate">
                      {selectedFile?.name}
                    </div>
                    {uploading && (
                      <div className="flex items-center w-[40%] gap-x-2">
                        <div className="w-full">
                          <LinearProgress
                            color="primary"
                            variant="determinate"
                            value={uploadProgress}
                            sx={{
                              height: 8,
                              borderRadius: 5,
                            }}
                          />
                        </div>
                        <span className="text-[#007aff] ml-2">
                          {uploadProgress?.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {uploadedFiles?.map((file: any, index: number) => (
                  <li key={index} className="flex flex-col my-5">
                    <div className="flex flex-col ml-4">
                      <a
                        href={file?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#000] truncate"
                      >
                        {file?.name || "Uploading..."}
                      </a>
                      <span className="text-[#555] text-[12px]">
                        {file?.size !== "Unknown" && file?.size
                          ? file?.size > 1024 * 1024
                            ? (file?.size / (1024 * 1024))?.toFixed(2) + " MB"
                            : (file?.size / 1024)?.toFixed(2) + " KB"
                          : "Size unknown"}
                      </span>
                    </div>
                    {uploadedFiles?.length > 1 &&
                      index !== uploadedFiles?.length - 1 && (
                        <div className="w-full items-center justify-center flex my-4">
                          <div className="w-[95%] border-[1px] border-[#ecedf2]" />
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
      <UrlUploadModal
        open={urlModalOpen}
        onClose={() => setUrlModalOpen(false)}
        onAdd={handleAddUrl}
      />
    </main>
  );
}
