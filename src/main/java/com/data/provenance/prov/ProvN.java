package com.data.provenance.prov;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

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



    public static final String PROVBOOK_NS = "http://www.provbook.org";
    public static final String PROVBOOK_PREFIX = "provbook";

    public static final String JIM_PREFIX = "jim";
    public static final String JIM_NS = "http://www.cs.rpi.edu/~hendler/";

    public final ProvFactory pFactory;
    public final Namespace ns;

    public ProvN(ProvFactory pFactory, HashMap<String, String> map) {
        this.pFactory = pFactory;
//        for (Map.Entry<String, String> entry : map.entrySet()) {
//            System.out.println(entry.getKey()+" : "+entry.getValue());
//            ns=new Namespace();
//            ns.addKnownNamespaces();
//            ns.register(JIM_PREFIX, JIM_NS);
//            ns.register(entry.getKey(), entry.getValue());
//
//       }
        ns=new Namespace();
        ns.addKnownNamespaces();
        ns.register(PROVBOOK_PREFIX, PROVBOOK_NS);
        ns.register(JIM_PREFIX, JIM_NS);
    }


    public void doConversions(String filein, String fileout) {
        InteropFramework intF = new InteropFramework();
        //File file = new File(filein);

        Document document= intF.readDocumentFromFile(filein);
        System.out.println(document.toString());
        //System.out.println("Output2: " + file);
        //intF.writeDocument(fileout, document);
        intF.writeDocument(System.out, ProvFormat.PROVN, document);
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
