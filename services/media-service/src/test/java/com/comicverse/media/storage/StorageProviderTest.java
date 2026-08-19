package com.comicverse.media.storage;

import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StorageProviderTest {

    @Test
    void testLocalStorageProvider_StoreAndGetUrl() {
        LocalStorageProvider provider = new LocalStorageProvider();
        ByteArrayInputStream input = new ByteArrayInputStream("dummy image content".getBytes());

        String url = provider.store("test/cover.jpg", input, 19, "image/jpeg");
        assertNotNull(url);
        assertTrue(url.contains("test/cover.jpg"));
    }
}
