package com.comicverse.sync.controller;

import com.comicverse.sync.model.ReadingProgress;
import com.comicverse.sync.service.ReadingProgressService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reading-progress")
public class ReadingProgressController {

    private final ReadingProgressService service;

    public ReadingProgressController(ReadingProgressService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReadingProgress> getReadingProgress() {
        return service.getAllReadingProgress();
    }
}
