package com.comicverse.media.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.InputStream;
import java.net.URI;

/**
 * AWS S3 / MinIO implementation of StorageProvider.
 * Compatible with MinIO local container and AWS S3 in production.
 */
@Component
public class S3StorageProvider implements StorageProvider {

    private static final Logger log = LoggerFactory.getLogger(S3StorageProvider.class);

    @Value("${media.storage.s3.bucket-name:comicverse-media}")
    private String bucketName;

    @Value("${media.storage.s3.endpoint-url:http://minio:9000}")
    private String endpointUrl;

    @Value("${media.storage.s3.region:us-east-1}")
    private String region;

    @Value("${media.storage.s3.access-key:comicverse}")
    private String accessKey;

    @Value("${media.storage.s3.secret-key:change-me-minio-secret}")
    private String secretKey;

    private S3Client getS3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .endpointOverride(URI.create(endpointUrl))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .forcePathStyle(true) // Required for MinIO
                .build();
    }

    @Override
    public String store(String path, InputStream inputStream, long size, String contentType) {
        try {
            S3Client s3 = getS3Client();
            PutObjectRequest putReq = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(path)
                    .contentType(contentType)
                    .build();

            s3.putObject(putReq, RequestBody.fromInputStream(inputStream, size));
            log.info("Uploaded object to S3/MinIO bucket {} key {}", bucketName, path);
            return getPublicUrl(path);
        } catch (Exception e) {
            log.error("Failed to upload object to S3 {}: {}", path, e.getMessage());
            throw new RuntimeException("S3 object store failure", e);
        }
    }

    @Override
    public InputStream load(String path) {
        try {
            S3Client s3 = getS3Client();
            GetObjectRequest getReq = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(path)
                    .build();
            return s3.getObject(getReq);
        } catch (Exception e) {
            log.error("Failed to load object from S3 {}: {}", path, e.getMessage());
            throw new RuntimeException("S3 object load failure", e);
        }
    }

    @Override
    public boolean delete(String path) {
        try {
            S3Client s3 = getS3Client();
            DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(path)
                    .build();
            s3.deleteObject(delReq);
            return true;
        } catch (Exception e) {
            log.error("Failed to delete object from S3 {}: {}", path, e.getMessage());
            return false;
        }
    }

    @Override
    public String getPublicUrl(String path) {
        return String.format("%s/%s/%s", endpointUrl, bucketName, path);
    }
}
