package com.data.provenance;

import org.apache.log4j.BasicConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Provenance {
    public static void main(String[] args) {
        BasicConfigurator.configure();
        SpringApplication.run(Provenance.class, args);
    }
}
