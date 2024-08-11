import { storage } from "@/config/firebase";
import { nanoid } from "nanoid";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { showCustomToast } from "@/components/toast";

export const uploadFile = (file, folder, onProgress, onComplete) => {
  const filename = nanoid();
  const storageRef = ref(
    storage,
    `${folder}${filename}.${file.name.split(".").pop()}`
  );

  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    },
    (error) => {
      if (
        error.code === "storage/retry-limit-exceeded" ||
        error.message.includes("network")
      ) {
        console.error("Network error during upload", error);
        showCustomToast(
          "Network error: Please check your connection.",
          "error"
        );
      } else {
        console.error("Upload failed", error);
        showCustomToast("Upload failed: " + error.message, "error");
      }
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      onComplete(downloadURL);
      showCustomToast("File uploaded successfully", "success");
    }
  );
};

export const getFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  } catch (error) {
    throw error;
  }
};
