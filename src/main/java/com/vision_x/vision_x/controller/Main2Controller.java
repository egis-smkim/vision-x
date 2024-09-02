package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Main2Controller {
    @GetMapping("/main2")
    public String main2(Model model) {
        return "main-type-2";
    }
}

