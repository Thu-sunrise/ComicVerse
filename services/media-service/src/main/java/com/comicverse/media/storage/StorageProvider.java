package com.comicverse.media.storage;

import java.io.InputStream;

/**
 * StorageProvider abstraction.
 * Hides storage engine implementation (Local filesystem vs S3 / MinIO).
 */
public interface StorageProvider {

    /**
     * Store a file.
     *
     * @param path        Relative path/key (e.g. "stories/1/cover.jpg")
     * @param inputStream File input stream
     * @param size        Size in bytes
     * @param contentType Content MIME type (e.g. "image/jpeg")
     * @return Public or accessible URL of stored asset
     */
    String store(String path, InputStream inputStream, long size, String contentType);

    /**
     * Retrieve a file as InputStream.
     */
    InputStream load(String path);

    /**
     * Delete a file.
     */
    boolean delete(String path);

    /**
     * Get the external public URL for a given storage path.
     */
    String getPublicUrl(String path);
}
