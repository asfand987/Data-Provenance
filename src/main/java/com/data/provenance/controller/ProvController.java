package com.data.provenance.controller;

import com.data.provenance.prov.conversion;
import org.json.JSONArray;
import org.json.JSONException;
import org.openprovenance.prov.interop.InteropFramework;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;
import org.springframework.web.servlet.ModelAndView;

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

    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public String PROV_JSON(@RequestBody String jsonString) {
        String sendDataToClient = "";
        try {
            JSONArray jsonArray = new JSONArray(jsonString);
            JSONObject jsonObject = new JSONObject();

            jsonObject.put("prefix", jsonArray.getJSONObject(0).getJSONObject("prefix"));
            jsonObject.put("entity", jsonArray.getJSONObject(1).getJSONObject("entity"));
            jsonObject.put("activity", jsonArray.getJSONObject(2).getJSONObject("activity"));
            jsonObject.put("agent", jsonArray.getJSONObject(3).getJSONObject("agent"));
            jsonObject.put("wasDerivedFrom", jsonArray.getJSONObject(4).getJSONObject("wasDerivedFrom"));
            jsonObject.put("wasAttributedTo", jsonArray.getJSONObject(5).getJSONObject("wasAttributedTo"));
            jsonObject.put("wasGeneratedBy", jsonArray.getJSONObject(6).getJSONObject("wasGeneratedBy"));
            jsonObject.put("wasAssociatedWith", jsonArray.getJSONObject(7).getJSONObject("wasAssociatedWith"));
            jsonObject.put("used", jsonArray.getJSONObject(8).getJSONObject("used"));
            jsonObject.put("wasInformedBy", jsonArray.getJSONObject(9).getJSONObject("wasInformedBy"));
            jsonObject.put("actedOnBehalfOf", jsonArray.getJSONObject(10).getJSONObject("actedOnBehalfOf"));

            String conversionType = jsonArray.getString(11).toString();
            populateNamespaceMap(jsonArray);

            String str = "";
            conversion conversion = new conversion(InteropFramework.getDefaultFactory(), namespaceMap);

            conversion.doConversions(jsonObject.toString(), conversionType); //jsonObject.toString()
            sendDataToClient = conversion.returnConvertedFile();
        }
        catch (Exception e) {
            sendDataToClient = e.toString();
            return sendDataToClient;
        }

        return sendDataToClient;
    }

    public void populateNamespaceMap(JSONArray jsonArray) throws JSONException {
        JSONObject namespaceObject = new JSONObject(jsonArray.get(0).toString());
        JSONObject namespaceArray = namespaceObject.getJSONObject("prefix");

        Iterator ite = namespaceArray.keys();

        while (ite.hasNext()) {
            String key = (String) ite.next();
            namespaceMap.put(key, namespaceArray.get(key).toString());
        }
    }

}

