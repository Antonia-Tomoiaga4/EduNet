package com.edunet;

public final class Logger {

    private static Logger instance;

    private Logger() {
        // constructor privat
    }

    public static  synchronized Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}