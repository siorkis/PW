#! /usr/bin/env bash
import socket
import sys
from bs4 import BeautifulSoup
from urllib.parse import unquote

def search(key):
    # determine the connection
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  
    client.settimeout(1)
    client.connect(("www.google.com", 80))  
    request = "GET /search?q=%s HTTP/1.1\r\nHost: www.google.com\r\n\r\n" % key
    
    data = request
    print(data)
    client.send(data.encode())  
    
    response = b""
    try:
        while True: response = response + client.recv(4096)
    except socket.timeout as e:
        pass

    # extract the html
    start = response.find(b'<!doctype html>')
    end = response.find(b'</html>')
    html_response = response[start:end]
    doc = BeautifulSoup(html_response, 'html.parser')
    tags = doc.find_all(class_="egMi0")

    for _, section in enumerate(tags):
        link_entire = str(section.a['href'])

        link_begin = link_entire.find("http")
        link_end = link_entire.find("&sa=")
        # the processed links
        link_process = link_entire[link_begin:link_end]

        section_name = section.a.h3.div.string
        print(section_name)
        link_process = unquote(link_process)
        print(link_process, end='\n\n\n')
        
if __name__ == "__main__":

    args_number = len(sys.argv)

    if (args_number == 2 and sys.argv[1] == '-h'):
        print("""
go2web.py -s <search-term>     make an HTTP request to search via google 
go2web.py -h                   show this help""")
    if (args_number == 3 and sys.argv[1] == '-s'):
        key = sys.argv[2]
        search(key)
        