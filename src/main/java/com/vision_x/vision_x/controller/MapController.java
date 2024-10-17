package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {
    @GetMapping("/map")
    public String map(Model model) {
        return "index";
    }

    @GetMapping("/mapxdo")
    public String mapxdo(Model model) {
        return "mapxdo";
    }

    @GetMapping("/maplv16_1024_L2")
    public String maplv16_1024_L2(Model model) {
        return "maplv16_1024_L2";
    }

    @GetMapping("/maplv16_2048_L2")
    public String maplv16_2048_L2(Model model) {
        return "maplv16_2048_L2";
    }
}

