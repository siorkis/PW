#! /usr/bin/env bash
import socket
import sys
import json
from bs4 import BeautifulSoup
from urllib.parse import unquote

def fetch_data(*, update: bool = False, json_cache: str, request:str):
    # caching process

    # if I want new data or not
    if update:
        json_data = None

    else:
        try:
            # open the file json and read it
            with open(json_cache, 'r') as file:
                # we do have json data and it was locally cached
                json_data = json.load(file)
                print("Wow, fetched data from the local cache!")
        # we can't decode the json, some errors        
        except(FileNotFoundError, json.JSONDecodeError) as e:
            print(f'No local cache found, the error being: ({e})')
            json_data = None

    # if there is no json data
    if not json_data:
        print('Hey, fetching new json data, by creating local cache')
        json_data = request
        # write this cache file, by inserting in it
        with open(json_cache, 'w') as file:
            json.dump(json_data, file)

    return json_data



def foru(url, json_cache):
    # determine the connection
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
    client.settimeout(1)
    
    # find the host part an the pth part
    http_len = 7
    http = url.find("http://")
    if http == -1:
        http_len = 8
        
    path_begin = url[http_len:].find("/")
    path = str()
    # in case there is no path
    if path_begin == -1:
        path_begin = len(url) + 1
        path = "/"

    else:
        path_begin += http_len
        path = url[path_begin:]

    # the request
    host = url[http_len:path_begin]
    client.connect((host, 80))  
    request = "GET "+path+" HTTP/1.1\r\nHost: "+host+"\r\n\r\n"


    # caching process
    # where all the json data is going to be cached
    # json_cache = 'cache.json'
    data: dict = fetch_data(update=False, json_cache=json_cache, request=request)

    print(data)

    client.send(data.encode())  
    
    # the received data 
    response = b""
    try:
        while True: response = response + client.recv(4096)
    except socket.timeout as e:
        pass

    # extract the html       
    start = response.find(b'<html')
    end = response.find(b'</html>')
    
    # the web scraping
    html_response = response[start:end]
    doc = BeautifulSoup(html_response, 'html.parser')

    # get rid of any styles, heads and scripts using BeautifulSoup
    for i in doc.find_all("style"): i.replaceWith("")
    for y in doc.find_all("head"): y.replaceWith("")
    for x in doc.find_all("script"): x.replaceWith("")

    # work with descendants, so as to get from our child the links that we need
    for child in doc.recursiveChildGenerator():
        name = getattr(child, "name", None)
        if name is not None:
            # found links
            if name == "a":
                link = child['href']
                if link[0] == '/': link = "https://" + host + link
                print(link, end='\n\n\n')
        elif not child.isspace(): print(child)  




def fors(term, json_cache):
    # determine the connection
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
    client.settimeout(1)
    client.connect(("www.google.com", 80))  
    request = "GET /search?q=%s HTTP/1.1\r\nHost: www.google.com\r\n\r\n" % term
    
    # caching process
    # where all the json data is going to be cached
    # json_cache = 'cache.json'
    data: dict = fetch_data(update=False, json_cache=json_cache, request=request)

    print(data)

    client.send(data.encode())  
    
    # the received data 
    response = b""
    try:
        while True: response = response + client.recv(4096)
    except socket.timeout as e:
        pass

    # extract the html
    start = response.find(b'<!doctype html>')
    end = response.find(b'</html>')

    # the web scraping
    html_response = response[start:end]
    doc = BeautifulSoup(html_response, 'html.parser')
    
    # get the result elements
    tags = doc.find_all(class_="egMi0")

    for _, section in enumerate(tags):
        link_entire = str(section.a['href'])

        link_begin = link_entire.find("http")
        link_end = link_entire.find("&sa=")
        # the processed links
        link_proces = link_entire[link_begin:link_end]

        section_name = section.a.h3.div.string
        print(section_name)
        link_proces = unquote(link_proces)
        print(link_proces, end='\n\n\n')




def fetch_data1(*, update: bool = False, json_cache: str, url:str):
    
    # if I want new data or not
    if update:
        json_data = None

    else:
        try:
            # open the file json and read it
            with open(json_cache, 'r') as file:
                # we do have json data and it was locally cached
                json_data = json.load(file)
                print("Wow, fetched data from the local cache!")
        # we can't decode the json, some errors        
        except(FileNotFoundError, json.JSONDecodeError) as e:
            print(f'No local cache found, the error being: ({e})')
            json_data = None

    # if there is no json data
    if not json_data:
        print('Hey, fetching new json data, by creating local cache')
        json_data = url.json()
        # write this cache file, by inserting in it
        with open(json_cache, 'w') as file:
            json.dump(json_data, file)

    return json_data


        
if __name__ == "__main__":

    # # where all the json data is going to be cached
    # json_cache = 'cacheFile/cache.json'
    # data: dict = fetch_data(update=False, json_cache=json_cache, request=request)
    json_cache = 'cache.json'
    n = len(sys.argv)

    if (n == 2 and sys.argv[1] == '-h'):
        print("""
  go2web.py -u <URL>             make an HTTP request to the specified URL and print the response
  go2web.py -s <search-term>     make an HTTP request to search the term using your favorite search engine and print top 10 results
  go2web.py -h                   show this help""")
    if (n == 3 and sys.argv[1] == '-u'):
        url = sys.argv[2]
        foru(url, json_cache)
    if (n == 3 and sys.argv[1] == '-s'):
        term = sys.argv[2]
        fors(term, json_cache)
        