package com.data.provenance.prov;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.collections4.map.HashedMap;
import org.openprovenance.prov.interop.InteropFramework;
import org.openprovenance.prov.interop.Formats.ProvFormat;
import org.openprovenance.prov.model.Agent;
import org.openprovenance.prov.model.Document;
import org.openprovenance.prov.model.Entity;
import org.openprovenance.prov.model.Namespace;
import org.openprovenance.prov.model.QualifiedName;
import org.openprovenance.prov.model.ProvFactory;
import org.openprovenance.prov.model.StatementOrBundle;
import org.openprovenance.prov.model.WasAttributedTo;
import org.openprovenance.prov.model.WasDerivedFrom;

/**
 * A little provenance goes a long way.
 * ProvToolbox Tutorial 1: creating a provenance document in Java and serializing it
 * to SVG (in a file) and to PROVN (on the console).
 *
 * @author lucmoreau
 * @see <a href="http://blog.provbook.org/2013/10/11/a-little-provenance-goes-a-long-way/">a-little-provenance-goes-a-long-way blog post</a>
 */
public class ProvN {

    private final ProvFactory pFactory;
    private Namespace ns;
    private String convertedFile;

    public ProvN(ProvFactory pFactory, HashMap<String, String> map) {
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
        else if(type.equals("JSON-LD")) {
            format = ProvFormat.JSONLD;
        }
        else {
            format = ProvFormat.TRIG;
        }
        return format;
    }
    public String returnConvertedFile() {
        return convertedFile;
    }
    public void closingBanner() {
        System.out.println("");
        System.out.println("*************************");
    }

    public void openingBanner() {
        System.out.println("*************************");
        System.out.println("* Converting document  ");
        System.out.println("*************************");
    }



}
