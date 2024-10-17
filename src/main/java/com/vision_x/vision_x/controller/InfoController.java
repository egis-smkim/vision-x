package com.vision_x.vision_x.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InfoController {
    @GetMapping("/")
    public String info_main(Model model) {
        return "info/index";
    }
    @GetMapping("/index")
    public String info_index(Model model) {
        return "info/index";
    }

    @GetMapping("/home")
    public String info_home(Model model) {
        return "info/home";
    }

    @GetMapping("/home.html")
    public String info_home_html(Model model) {
        return "info/home";
    }

    @GetMapping("/service")
    public String info_service(Model model) {
        return "info/service";
    }

    @GetMapping("/service.html")
    public String info_service_html(Model model) {
        return "info/service";
    }

    @GetMapping("/xdk")
    public String info_xdk(Model model) {
        return "info/xdk";
    }

    @GetMapping("/xdk.html")
    public String info_xdk_html(Model model) {
        return "info/xdk";
    }

    @GetMapping("/news")
    public String info_news(Model model) {
        return "info/news";
    }

    @GetMapping("/news.html")
    public String info_news_html(Model model) {
        return "info/news";
    }

    @GetMapping("/news_page")
    public String info_news_page(Model model) {
        return "info/news_page";
    }

    @GetMapping("/news_page.html")
    public String info_news_page_html(Model model) {
        return "info/news_page";
    }
}
