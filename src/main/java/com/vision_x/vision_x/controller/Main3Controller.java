package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Main3Controller {
    @GetMapping("/main3")
    public String main3(Model model) {
        return "main-type-3";
    }
}

