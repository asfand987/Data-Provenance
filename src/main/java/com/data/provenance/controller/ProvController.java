package com.data.provenance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ProvController  {
    @RequestMapping("/")
    public String start() {
        return "index";
    }

    
}
        