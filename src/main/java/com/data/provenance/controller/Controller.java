package com.data.provenance.controller;

import com.data.provenance.prov.Convert;
import org.json.JSONArray;
import org.json.JSONException;
import org.openprovenance.prov.interop.InteropFramework;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;

@org.springframework.stereotype.Controller
public class Controller {

    private HashMap<String, String> namespaceMap = new HashMap<>();

    /**
     * Start page
     * @return index.html
     */
    @RequestMapping("/")
    public String start() {
        return "index";
    }

    /**
     * Takes PROV-JSON input as a string from client side. Parses and converts the file.
     * Returned back to client as a string.
     * @param jsonString
     * @return String
     */
    @RequestMapping(value = "/", method = RequestMethod.POST)
    @ResponseBody
    public String transferData(@RequestBody String jsonString) {
        String sendDataToClient = "";
        try {
            System.out.println(jsonString);
            JSONArray jsonArray = new JSONArray(jsonString);
            JSONObject provJSON = new JSONObject();

            provJSON.put("prefix", jsonArray.getJSONObject(0).getJSONObject("prefix"));
            provJSON.put("entity", jsonArray.getJSONObject(1).getJSONObject("entity"));
            provJSON.put("activity", jsonArray.getJSONObject(2).getJSONObject("activity"));
            provJSON.put("agent", jsonArray.getJSONObject(3).getJSONObject("agent"));
            provJSON.put("wasDerivedFrom", jsonArray.getJSONObject(4).getJSONObject("wasDerivedFrom"));
            provJSON.put("wasAttributedTo", jsonArray.getJSONObject(5).getJSONObject("wasAttributedTo"));
            provJSON.put("wasGeneratedBy", jsonArray.getJSONObject(6).getJSONObject("wasGeneratedBy"));
            provJSON.put("wasAssociatedWith", jsonArray.getJSONObject(7).getJSONObject("wasAssociatedWith"));
            provJSON.put("used", jsonArray.getJSONObject(8).getJSONObject("used"));
            provJSON.put("wasInformedBy", jsonArray.getJSONObject(9).getJSONObject("wasInformedBy"));
            provJSON.put("actedOnBehalfOf", jsonArray.getJSONObject(10).getJSONObject("actedOnBehalfOf"));

            String conversionType = jsonArray.getString(11).toString();
            populateNamespaceMap(jsonArray);

            String str = "";
            Convert conversion = new Convert(InteropFramework.getDefaultFactory(), namespaceMap);

            conversion.doConversions(provJSON.toString(), conversionType); //jsonObject.toString()
            sendDataToClient = conversion.returnConvertedFile();
        }
        catch (Exception e) {
            sendDataToClient = e.toString();
            return sendDataToClient;
        }

        return sendDataToClient;
    }

    /**
     * Adds all namespaces to hashmap.
     * @param jsonArray
     * @throws JSONException
     */
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

