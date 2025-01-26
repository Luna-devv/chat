package config

import (
	"log"
	"os"
)

type Config struct {
	Secret string
}

type ApiContext struct {
	Config Config
}

func Get() Config {
	return Config{
		Secret: getEnv("SECRET"),
	}
}

func getEnv(key string) string {
	value, set := os.LookupEnv(key)
	if !set {
		log.Fatalf("Config variable %s was missing\n", key)
	}
	return value
}