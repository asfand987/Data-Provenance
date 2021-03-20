package com.data.provenance.prov;
import java.io.*;
import java.util.HashMap;
import java.util.Map;
import org.openprovenance.prov.interop.InteropFramework;
import org.openprovenance.prov.interop.Formats.ProvFormat;
import org.openprovenance.prov.model.Document;
import org.openprovenance.prov.model.Namespace;
import org.openprovenance.prov.model.ProvFactory;


public class Conversion {

    private final ProvFactory pFactory;
    private Namespace ns;
    private String convertedFile;

    public Conversion(ProvFactory pFactory, HashMap<String, String> map) {
        this.pFactory = pFactory;
        ns=new Namespace();

        for (Map.Entry<String, String> entry : map.entrySet()) {
            ns=new Namespace();
            ns.addKnownNamespaces();
            ns.register(entry.getKey(), entry.getValue());
       }
    }

    public void doConversions(String filein, String type) throws FileNotFoundException {
        ProvFormat format = conversionType(type);
        InteropFramework intF = new InteropFramework();
        ByteArrayOutputStream fileOutput = new ByteArrayOutputStream ();

        InputStream stream = new ByteArrayInputStream(filein.getBytes());
        Document document= intF.readDocument(stream, ProvFormat.JSON, null);

        intF.writeDocument(fileOutput, format, document);
        convertedFile = fileOutput.toString();
    }

    private ProvFormat conversionType(String type) {
        ProvFormat format;
        if(type.equals("N")) {
            format = ProvFormat.PROVN;
        }
        else if(type.equals("XML")){
            format = ProvFormat.XML;
        }
        else if(type.equals("RDF")) {
            format = ProvFormat.RDFXML;
        }
        else if(type.equals("TURTLE")) {
            format = ProvFormat.TURTLE;
        }
//        else if(type.equals("JSON-LD")) {
//            format = ProvFormat.JSONLD;
//        }
        else {
            format = ProvFormat.TRIG;
        }
        return format;
    }
    public String returnConvertedFile() {
        return convertedFile;
    }
}
