package com.data.provenanceTest;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.data.provenance.prov.Convert;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.openprovenance.prov.interop.InteropFramework;

import java.io.FileNotFoundException;
import java.util.HashMap;

public class ConvertTest {
    private Convert convert;
    private HashMap<String, String> namespaceMap;
    private JSONObject provJSON;

    @BeforeEach
    public void setUp() throws JSONException {
        namespaceMap = new HashMap<>();
        setUpProvEnvironment();
        convert = new Convert(InteropFramework.getDefaultFactory(), namespaceMap);
    }

    public void setUpProvEnvironment() throws JSONException {
        JSONArray jsonArray = new JSONArray("[{\"prefix\":{\"default\":\"http://www.w3.org/ns/prov#\"}},{\"entity\":{}},{\"activity\":{}},{\"agent\":{}},{\"wasDerivedFrom\":{}},{\"wasAttributedTo\":{}},{\"wasGeneratedBy\":{}},{\"wasAssociatedWith\":{}},{\"used\":{}},{\"wasInformedBy\":{}},{\"actedOnBehalfOf\":{}},\"N\"]");
        namespaceMap.put("default", "http://www.w3.org/ns/prov#");
        provJSON = new JSONObject();
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
    }

    /**
     * Verified PROV-N format is supported
     * @throws FileNotFoundException
     */
    @Test
    public void provN_conversionTest() throws JSONException, FileNotFoundException {
        String type = "N";
        convert.doConversions(provJSON.toString(), type);
        String actualOutput = convert.returnConvertedFile();
        String expectedOutput = "document\n" + "default <http://www.w3.org/ns/prov#>\n" + "endDocument\n".replaceAll("\\n|\\r\\n", System.getProperty("line.separator"));
        assertEquals(expectedOutput, actualOutput);
    }

    /**
     * Verified PROV-XML format is supported
     * @throws FileNotFoundException
     */
    @Test
    public void provXML_conversionTest() throws FileNotFoundException {
        String type = "XML";
        convert.doConversions(provJSON.toString(), type);
        String actualOutput = convert.returnConvertedFile();
        String expectedOutput = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
                "<document xmlns=\"http://www.w3.org/ns/prov#\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:ns3=\"http://openprovenance.org/prov/extension#\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"/>".replaceAll("\\n|\\r\\n", System.getProperty("line.separator"));
        assertEquals(expectedOutput, actualOutput);
    }

    /**
     * Verified PROV-RDF format is supported
     * @throws FileNotFoundException
     */
    @Test
    public void provRDF_conversionTest() throws FileNotFoundException {
        String type = "RDF";
        convert.doConversions(provJSON.toString(), type);
        String actualOutput = convert.returnConvertedFile();
        String expectedOutput = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<rdf:RDF\n" +
                "\txmlns:prov=\"http://www.w3.org/ns/prov#\"\n" +
                "\txmlns:xsd=\"http://www.w3.org/2001/XMLSchema#\"\n" +
                "\txmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n" +
                "\txmlns:rdfs=\"http://www.w3.org/2000/01/rdf-schema#\">\n" +
                "\n" +
                "</rdf:RDF>".replaceAll("\\n|\\r\\n", System.getProperty("line.separator"));
        assertEquals(expectedOutput, actualOutput);
    }

    /**
     * Verified PROV-TURTLE format is supported
     * @throws FileNotFoundException
     */
    @Test
    public void provTURTLE_conversionTest() throws JSONException, FileNotFoundException {
        String type = "TURTLE";
        convert.doConversions(provJSON.toString(), type);
        String actualOutput = convert.returnConvertedFile();
        String expectedOutput = "@prefix prov: <http://www.w3.org/ns/prov#> .\r\n" +
                "@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\r\n" +
                "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\r\n" +
                "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\r\n\n".replaceAll("\\n|\\r\\n", System.getProperty("line.separator"));
        assertEquals(expectedOutput, actualOutput);
    }

    /**
     * Verified PROV-JSON format is supported
     * @throws FileNotFoundException
     */
    @Test
    public void provJSON_conversionTest() throws JSONException, FileNotFoundException {
        String type = "JSON";
        convert.doConversions(provJSON.toString(), type);
        String actualOutput = convert.returnConvertedFile();
        String expectedOutput = "{\n" +
                "  \"prefix\": {\n" +
                "    \"xsd\": \"http://www.w3.org/2001/XMLSchema#\",\n" +
                "    \"default\": \"http://www.w3.org/ns/prov#\",\n" +
                "    \"prov\": \"http://www.w3.org/ns/prov#\"\n" +
                "  }\n" +
                "}".replaceAll("\\n|\\r\\n", System.getProperty("line.separator"));
        assertEquals(expectedOutput, actualOutput);
    }

    @Test
    public void verifyElementsSupported() {

    }
}
