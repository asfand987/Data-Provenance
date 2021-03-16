package com.data.provenance.controller;

import com.data.provenance.prov.ProvN;
import org.json.JSONArray;
import org.openprovenance.prov.interop.InteropFramework;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Controller
public class ProvController {

    private HashMap<String, String> namespaceMap = new HashMap<>();

    @RequestMapping("/")
    public String start() {
        return "index";
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)//, consumes = "text/plain")
    @ResponseBody
    public void PROV_JSON(@RequestBody String jsonString) throws Exception {
        JSONArray jsonArray = new JSONArray(jsonString);
        populateNamespaceMap(jsonArray);

    }


    public void populateNamespaceMap(JSONArray jsonArray) {
        try {
            JSONObject namespaceObject = new JSONObject(jsonArray.get(0).toString());
            JSONArray namespaceJSONArr = new JSONArray(namespaceObject.get("prefix").toString());

            for (int i = 0; i < namespaceJSONArr.length(); i++) {
                JSONObject json = namespaceJSONArr.getJSONObject(i);
                Iterator<String> keys = json.keys();
                while (keys.hasNext()) {
                    String key = keys.next();
                    //System.out.println("Key :" + key + "  Value :" + json.get(key));
                    namespaceMap.put(key, json.get(key).toString());
                }
            }
        }
        catch (Exception e) {
        }
//        for (Map.Entry<String, String> entry : namespaceMap.entrySet()) {
//            System.out.println(entry.getKey()+" : "+entry.getValue());
//        }
    }


}

