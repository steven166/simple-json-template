import * as fs from "fs";
import * as pathUtils from "path";

/**
 * Promise wrapper around fs.exists
 * @param {string} file
 * @returns {Promise<boolean>}
 */
export function exists(file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      fs.exists(file, (exists) => {
        resolve(exists);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Promise wrapper around fs.readFile
 * @param {string} file
 * @returns {Promise<Buffer>}
 */
export function readFile(file: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(file, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Promise wrapper around fs.writeFile
 * @param {string} file
 * @param data
 * @returns {Promise<Buffer>}
 */
export function writeFile(file: string, data: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(file, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Resolve path using cwd
 * @param {string} file
 * @returns {string} absolute path
 */
export function resolve(file: string): string {
  return pathUtils.resolve(process.cwd(), file);
}

/**
 * Parse JSON or YAML
 * @param {string} text
 * @returns {any}
 */
export async function parseJsonOrYaml(text: string): Promise<any> {
  try {
    return JSON.parse(text);
  } catch (e) {
    const yaml = await require("yamljs");
    try {
      return yaml.parse(text);
    } catch (e) {
      throw new Error("Unable to parse text as JSON or YAML");
    }
  }
}