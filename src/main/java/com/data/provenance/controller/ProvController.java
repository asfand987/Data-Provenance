package com.data.provenance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ProvController  {
    @RequestMapping("/")
    public String start() {
        System.out.println("YES-----------------------------");
        return "index";
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)//, consumes = "text/plain")
    @ResponseBody
    public void PROV_JSON(@RequestBody String jsonString) throws Exception {
        System.out.println(jsonString);
        
    }
}
