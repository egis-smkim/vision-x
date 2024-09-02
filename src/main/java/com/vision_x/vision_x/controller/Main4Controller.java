package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Main4Controller {
    @GetMapping("/main4")
    public String main4(Model model) {
        return "main-type-4";
    }
}

