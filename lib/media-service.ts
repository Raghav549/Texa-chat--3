/**
 * TEXA Media Upload/Download Service
 * Handles file uploads, downloads, compression, and thumbnail generation
 */

import { EventEmitter } from "events";

export interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  mimeType: string;
  size: number;
  uri: string;
  thumbnail?: string;
  uploadedAt: number;
  uploadedBy: string;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  uploadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  eta: number; // seconds
}

export interface DownloadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  speed: number; // bytes per second
  eta: number; // seconds
}

export class MediaService extends EventEmitter {
  private uploadQueue: Map<string, UploadProgress> = new Map();
  private downloadQueue: Map<string, DownloadProgress> = new Map();
  private maxFileSize = 100 * 1024 * 1024; // 100MB
  private supportedMimeTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/quicktime", "video/x-msvideo"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
    document: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };

  constructor() {
    super();
  }

  /**
   * Validate file
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`,
      };
    }

    // Check mime type
    const isSupported = Object.values(this.supportedMimeTypes).flat().includes(file.type);

    if (!isSupported) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`,
      };
    }

    return { valid: true };
  }

  /**
   * Get file type
   */
  getFileType(
    mimeType: string
  ): "image" | "video" | "audio" | "document" | "unknown" {
    for (const [type, mimes] of Object.entries(this.supportedMimeTypes)) {
      if (mimes.includes(mimeType)) {
        return type as "image" | "video" | "audio" | "document";
      }
    }

    return "unknown";
  }

  /**
   * Compress image
   */
  async compressImage(
    file: File,
    quality: number = 0.8
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Calculate new dimensions (max 1920x1080)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1080;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Could not compress image"));
              }
            },
            "image/jpeg",
            quality
          );
        };

        img.onerror = () => {
          reject(new Error("Could not load image"));
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Could not read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate thumbnail
   */
  async generateThumbnail(file: File): Promise<Blob> {
    const fileType = this.getFileType(file.type);

    if (fileType === "image") {
      return this.compressImage(file, 0.6);
    } else if (fileType === "video") {
      // For video, extract first frame
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Could not generate thumbnail"));
              }
            },
            "image/jpeg",
            0.6
          );
        };

        video.onerror = () => {
          reject(new Error("Could not load video"));
        };

        video.src = URL.createObjectURL(file);
        video.currentTime = 1; // Get frame at 1 second
      });
    } else {
      // For other types, return a placeholder
      return new Blob(["placeholder"], { type: "text/plain" });
    }
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<MediaFile> {
    // Validate file
    const validation = this.validateFile(file);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileType = this.getFileType(file.type);

    // Compress if image
    let uploadBlob = file;

    if (fileType === "image") {
      uploadBlob = await this.compressImage(file);
    }

    // Generate thumbnail
    let thumbnail: string | undefined;

    try {
      const thumbnailBlob = await this.generateThumbnail(file);
      thumbnail = URL.createObjectURL(thumbnailBlob);
    } catch (error) {
      console.warn("Failed to generate thumbnail:", error);
    }

    // Simulate upload with progress
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let uploadedBytes = 0;

      const uploadInterval = setInterval(() => {
        uploadedBytes = Math.min(
          uploadedBytes + Math.random() * 50000,
          uploadBlob.size
        );

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = uploadedBytes / elapsed;
        const remaining = uploadBlob.size - uploadedBytes;
        const eta = remaining / speed;

        const progress: UploadProgress = {
          fileId,
          fileName: file.name,
          progress: Math.round((uploadedBytes / uploadBlob.size) * 100),
          uploadedBytes: Math.round(uploadedBytes),
          totalBytes: uploadBlob.size,
          speed: Math.round(speed),
          eta: Math.round(eta),
        };

        this.uploadQueue.set(fileId, progress);
        onProgress?.(progress);
        this.emit("uploadProgress", progress);

        if (uploadedBytes >= uploadBlob.size) {
          clearInterval(uploadInterval);

          const mediaFile: MediaFile = {
            id: fileId,
            name: file.name,
            type: fileType as any,
            mimeType: file.type,
            size: uploadBlob.size,
            uri: URL.createObjectURL(uploadBlob),
            thumbnail,
            uploadedAt: Date.now(),
            uploadedBy: userId,
          };

          this.uploadQueue.delete(fileId);
          this.emit("uploadComplete", mediaFile);
          resolve(mediaFile);
        }
      }, 100);

      // Simulate network error (5% chance)
      if (Math.random() < 0.05) {
        clearInterval(uploadInterval);
        this.uploadQueue.delete(fileId);
        reject(new Error("Upload failed"));
      }
    });
  }

  /**
   * Download file with progress tracking
   */
  async downloadFile(
    mediaFile: MediaFile,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Blob> {
    const fileId = mediaFile.id;
    const startTime = Date.now();
    let downloadedBytes = 0;

    return new Promise((resolve, reject) => {
      const downloadInterval = setInterval(() => {
        downloadedBytes = Math.min(
          downloadedBytes + Math.random() * 50000,
          mediaFile.size
        );

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = downloadedBytes / elapsed;
        const remaining = mediaFile.size - downloadedBytes;
        const eta = remaining / speed;

        const progress: DownloadProgress = {
          fileId,
          fileName: mediaFile.name,
          progress: Math.round((downloadedBytes / mediaFile.size) * 100),
          downloadedBytes: Math.round(downloadedBytes),
          totalBytes: mediaFile.size,
          speed: Math.round(speed),
          eta: Math.round(eta),
        };

        this.downloadQueue.set(fileId, progress);
        onProgress?.(progress);
        this.emit("downloadProgress", progress);

        if (downloadedBytes >= mediaFile.size) {
          clearInterval(downloadInterval);

          // Simulate file fetch
          fetch(mediaFile.uri)
            .then((res) => res.blob())
            .then((blob) => {
              this.downloadQueue.delete(fileId);
              this.emit("downloadComplete", mediaFile);
              resolve(blob);
            })
            .catch((error) => {
              clearInterval(downloadInterval);
              this.downloadQueue.delete(fileId);
              reject(error);
            });
        }
      }, 100);

      // Simulate network error (5% chance)
      if (Math.random() < 0.05) {
        clearInterval(downloadInterval);
        this.downloadQueue.delete(fileId);
        reject(new Error("Download failed"));
      }
    });
  }

  /**
   * Cancel upload
   */
  cancelUpload(fileId: string): void {
    this.uploadQueue.delete(fileId);
    this.emit("uploadCancelled", { fileId });
  }

  /**
   * Cancel download
   */
  cancelDownload(fileId: string): void {
    this.downloadQueue.delete(fileId);
    this.emit("downloadCancelled", { fileId });
  }

  /**
   * Get upload progress
   */
  getUploadProgress(fileId: string): UploadProgress | undefined {
    return this.uploadQueue.get(fileId);
  }

  /**
   * Get download progress
   */
  getDownloadProgress(fileId: string): DownloadProgress | undefined {
    return this.downloadQueue.get(fileId);
  }

  /**
   * Get all active uploads
   */
  getActiveUploads(): UploadProgress[] {
    return Array.from(this.uploadQueue.values());
  }

  /**
   * Get all active downloads
   */
  getActiveDownloads(): DownloadProgress[] {
    return Array.from(this.downloadQueue.values());
  }

  /**
   * Clear all
   */
  clear(): void {
    this.uploadQueue.clear();
    this.downloadQueue.clear();
    this.emit("cleared");
  }
}

// Export singleton instance
export const mediaService = new MediaService();
