package com.data.provenance;

import org.apache.log4j.BasicConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class provenance {
    public static void main(String[] args) {
        BasicConfigurator.configure();
        SpringApplication.run(provenance.class, args);
    }
}