package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Main1Controller {
    @GetMapping("/main1")
    public String main1(Model model) {
        return "main-type-1";
    }
}

