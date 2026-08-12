package com.comicverse.story.service;

import com.comicverse.story.model.Story;
import com.comicverse.story.repository.StoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;

    public StoryServiceImpl(StoryRepository storyRepository) {
        this.storyRepository = storyRepository;
    }

    @Override
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }
}
