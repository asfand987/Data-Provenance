package com.data.provenance.controller;

import com.data.provenance.prov.ProvN;
import org.json.JSONArray;
import org.json.JSONException;
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
        JSONObject jsonObject = new JSONObject();

        jsonObject.put("entity",jsonArray.getJSONObject(1).getJSONObject("entity"));
        jsonObject.put("activity",jsonArray.getJSONObject(2).getJSONObject("activity"));
        jsonObject.put("agent",jsonArray.getJSONObject(3).getJSONObject("agent"));

        populateNamespaceMap(jsonArray);

        try {
            String str = "";
            ProvN tutorial = new ProvN(InteropFramework.getDefaultFactory());
            tutorial.doConversions(jsonObject.toString());
        }
        catch (Exception e) {
            System.out.println(e);
        }

    }

    public void populateNamespaceMap(JSONArray jsonArray) throws JSONException {
        JSONObject namespaceObject = new JSONObject(jsonArray.get(0).toString());
        JSONObject namespaceArray = namespaceObject.getJSONObject("prefix");

        Iterator ite = namespaceArray.keys();

        while (ite.hasNext()){
            String key = (String) ite.next();
            namespaceMap.put(key, namespaceArray.get(key).toString());
        }
//        for (Map.Entry<String, String> entry : namespaceMap.entrySet()) {
//            System.out.println(entry.getKey()+" : "+entry.getValue());
//        }

    }

}

