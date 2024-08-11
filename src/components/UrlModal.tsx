import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import LinkIcon from "@mui/icons-material/Link";
import { Close } from "@mui/icons-material";

export const UrlUploadModal = ({ open, onClose, onAdd }: any) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateUrl = (url: string) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return regex.test(url);
  };

  const handleAdd = () => {
    if (validateUrl(url)) {
      onAdd(url);
      setUrl("");
      onClose();
    } else {
      setError("Please enter a valid URL");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[#B43635] text-[20px]">Add file by URL</h2>
          <span
            className="text-[20px] font-bold text-[#555] cursor-pointer"
            onClick={() => {
              onClose();
            }}
          >
            x
          </span>
        </div>
        <TextField
          fullWidth
          label="Enter URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 2, mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon />
              </InputAdornment>
            ),
          }}
        />
        <div className="flex justify-end" style={{ marginTop: "16px" }}>
          <Button
            className="bg-[#B43635]"
            variant="contained"
            color="primary"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
