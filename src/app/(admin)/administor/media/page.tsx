"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { getSignedUrl } from "./action"; // async function expected here

type SignedUrlSuccess = {
  url: string;
  mediaId: string;
};

type SignedUrlResult =
  | { success: SignedUrlSuccess }
  | { failure: string };

// SHA-256 hash oluşturucu
const computeSHA256 = async (file: File): Promise<string> => {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("SHA-256 hashing is not supported in this environment.");
  }

  const buffer = await file.arrayBuffer();
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export default function Media() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonDisabled = files.length === 0 || loading;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("Uploading media...");
    setLoading(true);

    if (files.length === 0) {
      setStatusMessage("No files selected");
      setLoading(false);
      return;
    }

    try {
      const mediaIds: string[] = [];

      for (const file of files) {
        setStatusMessage(`Generating signed URL for ${file.name}...`);

        const checksum = await computeSHA256(file);
        const result: SignedUrlResult = await getSignedUrl(
          file.type,
          file.size,
          checksum
        );

        if ("failure" in result) {
          throw new Error(`Failed to generate signed URL: ${result.failure}`);
        }

        const { url, mediaId } = result.success;

        setStatusMessage(`Uploading ${file.name}...`);

        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`File upload failed for ${file.name}`);
        }

        mediaIds.push(mediaId);
      }

      setStatusMessage("All files uploaded successfully!");
      setFiles([]);
      setFileUrls([]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
      setStatusMessage(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) {
      const fileArray = Array.from(selected);
      setFiles(fileArray);
      setFileUrls(fileArray.map((file) => URL.createObjectURL(file)));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-neutral-500 rounded-lg px-6 py-4"
    >
      {statusMessage && (
        <p className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 mb-4 rounded relative">
          {statusMessage}
        </p>
      )}

      <div className="flex gap-4 items-start pb-4 w-full">
        <div className="flex flex-wrap gap-2">
          {fileUrls.map((url, index) => (
            <div
              key={url}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-500"
            >
              <Image
                src={url}
                width={80}
                height={80}
                alt={`Preview ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="flex items-center cursor-pointer">
          

            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              multiple
              hidden
            />
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <div className="text-neutral-500">Files: {files.length}</div>
        <button
          type="submit"
          disabled={buttonDisabled}
          aria-disabled={buttonDisabled}
          className={twMerge(
            "border rounded-xl px-4 py-2",
            buttonDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          Upload Media
        </button>
      </div>
    </form>
  );
}
