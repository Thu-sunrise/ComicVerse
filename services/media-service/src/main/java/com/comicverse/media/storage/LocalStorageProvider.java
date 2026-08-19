package com.comicverse.media.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.*;

/**
 * Local filesystem implementation of StorageProvider.
 * Used for offline development when S3 / MinIO is not running.
 */
@Component
public class LocalStorageProvider implements StorageProvider {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageProvider.class);

    @Value("${media.storage.local-dir:./data/media}")
    private String baseDir = "./data/media";

    @Value("${media.storage.base-url:http://localhost:8090/api/v1/media/files}")
    private String baseUrl = "http://localhost:8090/api/v1/media/files";

    @Override
    public String store(String path, InputStream inputStream, long size, String contentType) {
        try {
            Path targetPath = Paths.get(baseDir, path);
            Files.createDirectories(targetPath.getParent());
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file locally at path: {}", targetPath);
            return getPublicUrl(path);
        } catch (IOException e) {
            log.error("Failed to store file locally at {}: {}", path, e.getMessage());
            throw new RuntimeException("Local file store failure", e);
        }
    }

    @Override
    public InputStream load(String path) {
        try {
            Path targetPath = Paths.get(baseDir, path);
            return Files.newInputStream(targetPath);
        } catch (IOException e) {
            log.error("Failed to load local file at {}: {}", path, e.getMessage());
            throw new RuntimeException("Local file load failure", e);
        }
    }

    @Override
    public boolean delete(String path) {
        try {
            Path targetPath = Paths.get(baseDir, path);
            return Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            log.error("Failed to delete local file at {}: {}", path, e.getMessage());
            return false;
        }
    }

    @Override
    public String getPublicUrl(String path) {
        return baseUrl + "/" + path;
    }
}
