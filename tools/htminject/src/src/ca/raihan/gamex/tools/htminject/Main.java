
package ca.raihan.gamex.tools.htminject;

import java.io.*;

import org.w3c.dom.*;

import javax.xml.transform.*;
import javax.xml.transform.dom.*;
import javax.xml.transform.stream.*;

import javax.xml.parsers.*;

public class Main {

    private static final String ID = "id";
    private static final String LOCAL_ID = "local_script";

    public static void main(String[] argv) throws Throwable {
        if (argv.length != 3) {
            printUsage();
            exit(1);
        }
        File inputFile = new File(argv[0]).getCanonicalFile();
        if (!inputFile.exists()) {
            System.err.println("Input file does not exist");
            exit(1);
        }
        File outputFile = new File(argv[1]).getCanonicalFile();

        Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(inputFile);

        final Element documentElement = document.getDocumentElement();

        final NodeList headNodes = documentElement.getElementsByTagName("head");
        handleNodeList(headNodes);
        final NodeList bodyNodes = documentElement.getElementsByTagName("body");
        handleNodeList(bodyNodes);

        Element injectedScript = document.createElement("script");
        injectedScript.setAttribute("src", argv[2]);
        if (headNodes.getLength() > 0) {
            Node first = headNodes.item(0);
            if (first instanceof Element) {
                Element e = (Element) first;
                NodeList nodes = e.getChildNodes();
                final int len = nodes.getLength();
                for (int i = 0; i < len; ++i) {
                    Node n = nodes.item(i);
                    if (n instanceof Element) {
                        Element el = (Element) n;
                        if (el.getAttribute(ID).equalsIgnoreCase(LOCAL_ID)) {
                            el.appendChild(injectedScript);
                            break;
                        }
                    }
                }
            }
        }

        try {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "1");
            transformer.setOutputProperty(OutputKeys.METHOD, "html");
            DOMSource source = new DOMSource(document);

            try (FileWriter fileWriter = new FileWriter(outputFile)) {
                fileWriter.write("<!DOCTYPE html>\n");
                StreamResult result = new StreamResult(fileWriter);
                transformer.transform(source, result);
            }

        } catch (Exception ex) {
            System.err.println(ex);
            exit(1);
        }
    }

    private static void handleNodeList(NodeList nodeList) {
        final int len = nodeList.getLength();
        for (int i = 0; i < len; ++i) {
            Node node = nodeList.item(i);
            if (node instanceof Element) {
                handleElements(node.getChildNodes());
            }
         }
    }

    private static void handleElements(NodeList nodeList) {
        final int nodeListLen = nodeList.getLength();
        for (int i = 0; i < nodeListLen; ++i) {
            Node node = nodeList.item(i);
            if (node instanceof Element) {
                Element element = (Element) node;
                if (element.getAttribute(ID).equalsIgnoreCase(LOCAL_ID)) {
                    NodeList children = element.getChildNodes();
                    final int len = children.getLength();
                    for (int j = 0; j < len; ++j) {
                        Node n = children.item(j);
                        if (n instanceof Element) {
                            Element e = (Element) n;
                            if (e.getTagName().equalsIgnoreCase("script")) {
                                e.getParentNode().removeChild(e);
                            }
                        }
                    }
                }
            }
        }
    }

    private static void printUsage() {
        System.out.println("USAGE: \n\t [relative_input_file] [relative_output_file] [new_src_name]");
    }

    private static void exit(int exitCode) {
        System.exit(exitCode);
    }

}
