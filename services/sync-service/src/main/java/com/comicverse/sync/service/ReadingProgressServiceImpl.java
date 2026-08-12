package com.comicverse.sync.service;

import com.comicverse.sync.model.ReadingProgress;
import com.comicverse.sync.repository.ReadingProgressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReadingProgressServiceImpl implements ReadingProgressService {

    private final ReadingProgressRepository repository;

    public ReadingProgressServiceImpl(ReadingProgressRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ReadingProgress> getAllReadingProgress() {
        return repository.findAll();
    }
}
